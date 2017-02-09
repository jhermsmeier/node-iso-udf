var UDF = require( '../udf' )

/**
 * Anchor Volume Descriptor Pointer (AVDP)
 * @constructor
 * @memberOf UDF.Descriptor
 * @return {AnchorVolumePointer}
 */
function AnchorVolumePointer() {

  if( !(this instanceof AnchorVolumePointer) )
    return new AnchorVolumePointer()

  /** @type {UDF.DescriptorTag} Descriptor Tag */
  this.tag = new UDF.DescriptorTag()
  /** @type {UDF.ExtentAddress} VDS Extent */
  this.mainVolumeDescriptorSequenceExtent = new UDF.ExtentAddress()
  /** @type {UDF.ExtentAddress} Reserve VDS Extent */
  this.reserveVolumeDescriptorSequenceExtent = new UDF.ExtentAddress()
  /** @type {Buffer} Reserved */
  this.reserved = new Buffer( 480 )
  this.reserved.fill(0)

}

/** @type {Number} Struct size in bytes */
AnchorVolumePointer.size = 2048

/**
 * Parse an Anchor Volume Descriptor Pointer structure from a buffer
 * @param {Buffer} buffer
 * @param {Numfer} [offset=0]
 * @returns {AnchorVolumePointer}
 */
AnchorVolumePointer.parse = function( buffer, offset ) {
  return new AnchorVolumePointer().parse( buffer, offset )
}

/**
 * AnchorVolumePointer prototype
 * @type {Object}
 * @ignore
 */
AnchorVolumePointer.prototype = {

  constructor: AnchorVolumePointer,

  /**
   * Parse an Anchor Volume Descriptor Pointer structure from a buffer
   * @param {Buffer} buffer
   * @param {Numfer} [offset=0]
   * @returns {AnchorVolumePointer}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.tag.parse( buffer, offset )
    this.mainVolumeDescriptorSequenceExtent.parse( buffer, offset + 16 )
    this.reserveVolumeDescriptorSequenceExtent.parse( buffer, offset + 16 + 8 )

    buffer.copy( this.reserved, 0, offset + 30, offset + 2048 )

    return this

  },

}

// Exports
module.exports = AnchorVolumePointer
