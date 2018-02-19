var UDF = require( '../udf' )
var debug = require( 'debug' )( 'udf:volume' )
var async = require( 'async' )

/**
 * Volume
 * @constructor
 * @memberOf UDF.Volume
 * @param {BlockDevice} device
 * @param {Object} [options]
 * @returns {Volume}
 */
function Volume( device, options ) {

  if( !(this instanceof Volume) )
    return new Volume( device, options )

  /** @type {BlockDevice} Block device */
  this.device = device

  /**
   * Logical block size in bytes
   * NOTE: Starts as the underlying device's block size,
   * but will be overridden by the CD001 Primary Volume Descriptor's
   * logical block size field, which ensures correct block addressing
   * TODO: Have these two disconnected from each other, so that the BlockDevice
   * can operate with a different block size than the UDF Volume
   * @type {Number}
   */
  this.blockSize = this.device.blockSize

}

Volume.StructureDescriptor = require( './structure-descriptor' )

/**
 * Volume prototype
 * @type {Object}
 * @ignore
 */
Volume.prototype = {

  constructor: Volume,

  /**
   * Read the Volume Recognition Sequence (VRS)
   * TODO: Split this into reading the VRS (CD001),
   * and reading the Volume Structure Descriptors
   * (BEA01, NSR02, NSR03, TEA01) from the Extended Area (?)
   * @param {Function} callback
   */
  readRecognitionSequence: function( callback ) {
    // End of chain?
    var EOC = false
    // Each Volume Structure Descriptor (VSD) is 2048 bytes in size
    var vsdBlocks = 2048 / this.device.blockSize
    // Start readng after the reserved system region
    var fromLBA = UDF.SYSTEM_REGION_SIZE / this.device.blockSize
    var toLBA = fromLBA + vsdBlocks

    var sequence = []

    var test = () => !EOC
    var iter = ( next ) => {
      debug( 'read_vrs:blocks (%s): %s -> %s', toLBA - fromLBA, fromLBA, toLBA )
      this.device.readBlocks( fromLBA, toLBA, function( error, buffer, bytesRead ) {

        if( error ) return next( error )

        var desc = new UDF.Volume.StructureDescriptor().parse( buffer )

        debug( 'read_vrs:desc %s type: %s', desc.id, desc.type )
        sequence.push( desc )

        // Check if we've reached the end of it
        // TODO: Detect this by observing TEA01
        if( desc.type === 255 ) {
          EOC = true
        }

        fromLBA = toLBA
        toLBA = fromLBA + vsdBlocks
        next()

      })
    }

    async.whilst( test, iter, ( error ) => {
      error && debug( 'read_vrs:error', error.message )
      callback.call( this, error, sequence )
    })

  },

  /**
   * Find & read the Anchor Volume Descriptor Pointer (AVDP)
   * NOTE: This essentially determines the mountability of the volume
   * Steps:
   *   - find the AVDP at sector address 256
   *   - AVDP contains the start address and size of the main
   *     Volume Descriptor Sequence (VDS) and a reserved VDS
   *   - VDS contains many descriptors until it is terminated by a Terminating Descriptor (TD):
   *     - Partition Descriptor (PD): states the start and size of a partition.
   *       All files and directories are stored in the partition.
   *     - Logical Volume Descriptor (LVD): specifies the name of the volume through
   *       the `Logical Volume Identifier`, defines all the physical and logical partitions through
   *       the `Partition Map`, and indicates the location of the root directory through `File Set`.
   * @param {Function} callback
   */
  readAnchorVolumePointer: function( callback ) {

    // The last addressable block of the image
    // TODO: Make UDF.Volume throw if device.size is not set (if == -1 || null)
    var lastLBA = this.device.size / this.device.blockSize
    var size = UDF.Descriptor.AnchorVolumePointer.size / this.device.blockSize

    // The AVDP structure should be recorded in
    // at least 2 of the following 3 locations
    // (where N is the last addressable sector):
    // NOTE: It appears, there is an AVDP @ 0x80000 (LBA 1024), not 256
    // TODO: Figure out the correct locations, these block addresses
    // seem to be relative to something else
    var locations = [
      { from: 256, to: 256 + size }, // Logical Sector 256
      { from: lastLBA - 256, to: lastLBA - 256 + size }, // Logical Sector (N - 256).
      { from: lastLBA - size, to: lastLBA }, // N
    ]

    // Read a potential ADVP location, and inspect it's DescriptorTag
    // to detemine whether it is in fact an AVDP record
    var readAVDP = ( from, to, callback ) => {
      debug( 'read_avdp', from, to )
      this.device.readBlocks( from, to, ( error, buffer, bytesRead ) => {

        if( error ) return callback.call( this, error )

        var desc = new UDF.DescriptorTag().parse( buffer )
        var avdp = desc.id === UDF.DescriptorTag.AVDP ? buffer : null

        callback.call( this, error, avdp )

      })
    }

    // Read all possible AVDP locations
    async.parallel([
      ( next ) => { readAVDP( locations[0].from, locations[0].to, next ) },
      ( next ) => { readAVDP( locations[1].from, locations[1].to, next ) },
      ( next ) => { readAVDP( locations[2].from, locations[2].to, next ) },
    ], ( error, results ) => {
      // Filter out empty blocks, parse & filter out invalid AVDPs
      results = results.filter( (x) => !!x )
        .map( UDF.Descriptor.AnchorVolumePointer.parse )
        .filter( (avdp) => avdp.tag.id === 2 )
      // Return the first valid one found
      debug( 'read_avdp:results', results )
      callback.call( this, error, results.shift() )
    })

  },

  /**
   * Read a Descriptor Sequence (VDS,PDS) from a given ExtentAddress
   * @param {UDF.ExtentAddress} extent
   * @param {Function} callback
   */
  readDescriptorSequence: function( extent, callback ) {

    debug( 'read_desc_sequence', extent.location, extent.length )

    var fromLBA = extent.location
    var toLBA = fromLBA + ( extent.length / this.blockSize )

    this.device.readBlocks( fromLBA, toLBA, ( error, buffer, bytesRead ) => {
      if( error ) return callback.call( this, error )

      var descriptors = []
      var offset = 0
      var desc = null

      while( offset < buffer.length ) {
        desc = UDF.Descriptor.parse( buffer, offset )
        offset += this.blockSize
        descriptors.push( desc )
        if( desc.tag.id === UDF.DescriptorTag.TD ) { break }
      }

      callback.call( this, null, descriptors )

    })

  },

  open: function( callback ) {

    // Read the Volume Recognition Sequence (VRS)
    var readVRS = ( next ) => {
      this.readRecognitionSequence( ( error, vrs ) => {
        this.vrs = vrs
        this.pvd = vrs && vrs.filter( (desc) => desc.type === 1 ).shift()
        if( this.pvd != null ) {
          this.blockSize = this.device.blockSize = this.pvd.logicalBlockSize
        }
        next( error )
      })
    }

    // Find & read the Anchor Volume Descriptor Pointer (AVDP)
    var readAVDP = ( next ) => {
      this.readAnchorVolumePointer( ( error, avdp ) => {
        this.avdp = avdp
        next( error )
      })
    }

    // Read the Main Volume Descriptor Sequence (VDS)
    // pointed to by the AVDP
    var readVDS = ( next ) => {
      if( !this.avdp ) return next()
      var extent = this.avdp.mainVolumeDescriptorSequenceExtent
      this.readDescriptorSequence( extent, ( error, vds ) => {
        this.vds = vds
        next( error )
      })
    }

    var readPD = ( next ) => {
      if( !this.vds ) return next()
      var extent = this.vds.filter( ( ds ) => {
        return ds.tag.id === UDF.Descriptor.PD
      }).shift()
      this.readDescriptorSequence( extent, ( error, pds ) => {
        this.pds = pds
        next( error )
      })
    }

    async.series([
      readVRS,
      readAVDP,
      readVDS,
      readPD,
    ], ( error ) => {
      callback.call( this, error )
    })

  },

}

// Exports
module.exports = Volume
