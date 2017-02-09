var UDF = require( '../udf' )

/**
 * VolumePointer
 * @constructor
 * @memberOf UDF.Descriptor
 * @return {VolumePointer}
 */
function VolumePointer() {

  if( !(this instanceof VolumePointer) )
    return new VolumePointer()

  this.tag = new UDF.DescriptorTag()
  this.sequenceNumber = 0x00000000
  this.nextVolumeDescriptor = new UDF.ExtentAddress()
  this.reserved = new Buffer(484)

}

/** @type {Number} Size of the struct in bytes */
VolumePointer.size = 512

/**
 * Parse the structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {VolumePointer}
 */
VolumePointer.parse = function( buffer, offset ) {
  return new VolumePointer().parse( buffer, offset )
}

/**
 * VolumePointer prototype
 * @type {Object}
 * @ignore
 */
VolumePointer.prototype = {

  constructor: VolumePointer,

  /**
   * Parse the structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {VolumePointer}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.tag.parse( buffer, offset )
    this.sequenceNumber = buffer.readUInt32LE( offset + 16 )
    this.nextVolumeDescriptor.parse( buffer, offset + 20 )

    buffer.copy( this.reserved, 0, offset + 28, offset + 484 )

    return this

  },

}

// Exports
module.exports = VolumePointer
