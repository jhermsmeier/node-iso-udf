var UDF = require( '../../udf' )
var debug = require( 'debug' )( 'udf:volume:descriptor' )

var Descriptor = module.exports

/** @type {Number} Primary Volume Descriptor */
Descriptor.PVD = 0x0001
/** @type {Number} Anchor Volume Descriptor Pointer */
Descriptor.AVDP = 0x0002
/** @type {Number} Volume Descriptor Pointer */
Descriptor.VDP = 0x0003
/** @type {Number} Implementation Use Volume Descriptor */
Descriptor.IUVD = 0x0004
/** @type {Number} Partition Descriptor */
Descriptor.PD = 0x0005
/** @type {Number} Logical Volume Descriptor */
Descriptor.LVD = 0x0006
/** @type {Number} Unallocated Space Descriptor */
Descriptor.USD = 0x0007
/** @type {Number} Terminating Descriptor */
Descriptor.TD = 0x0008
/** @type {Number} Logical Volume Integrity Descriptor */
Descriptor.LVID = 0x0009

// Descriptor.Tag = UDF.DescriptorTag
Descriptor.Primary = require( './primary' )
Descriptor.AnchorVolumePointer = require( './anchor-volume-pointer' )
Descriptor.VolumePointer = require( './volume-pointer' )
Descriptor.Implementation = require( './implementation' )
Descriptor.Partition = require( './partition' )
Descriptor.Logical = require( './logical' )
Descriptor.UnallocatedSpace = require( './unallocated' )
Descriptor.Terminal = require( './terminal' )
Descriptor.LogicalVolumeIntegrity = require( './logical-volume-integrity' )
Descriptor.Unknown = require( './unknown' )

/**
 * [parse description]
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @return {Descriptor.*}
 */
Descriptor.parse = function( buffer, offset ) {

  offset = offset || 0

  var type = buffer.readUInt8( offset )
  var desc = null

  switch( type ) {
    case Descriptor.PVD: desc = Descriptor.Primary.parse( buffer, offset ); break
    case Descriptor.AVDP: desc = Descriptor.AnchorVolumePointer.parse( buffer, offset ); break
    case Descriptor.VDP: desc = Descriptor.VolumePointer.parse( buffer, offset ); break
    case Descriptor.IUVD: desc = Descriptor.Implementation.parse( buffer, offset ); break
    case Descriptor.PD: desc = Descriptor.Partition.parse( buffer, offset ); break
    case Descriptor.LVD: desc = Descriptor.Logical.parse( buffer, offset ); break
    case Descriptor.USD: desc = Descriptor.UnallocatedSpace.parse( buffer, offset ); break
    case Descriptor.TD: desc = Descriptor.Terminal.parse( buffer, offset ); break
    case Descriptor.LVID: desc = Descriptor.LogicalVolumeIntegrity.parse( buffer, offset ); break
    default:
      debug( 'unknown', type )
      desc = Descriptor.Unknown.parse( buffer, offset );
      break
  }

  return desc

}
