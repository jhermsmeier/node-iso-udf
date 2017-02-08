var UDF = require( './udf' )

/**
 * Anchor Volume Descriptor Pointer (AVDP)
 * @constructor
 * @memberOf UDF.Volume
 * @return {AVDP}
 */
function AVDP() {

  if( !(this instanceof AVDP) )
    return new AVDP()

  /** @type {UDF.DescriptorTag} Descriptor Tag */
  this.tag = new UDF.DescriptorTag()
  /** @type {UDF.ExtentDescriptor} VDS Extent */
  this.mainVolumeDescriptorSequenceExtent = new UDF.ExtentDescriptor()
  /** @type {UDF.ExtentDescriptor} Reserve VDS Extent */
  this.reserveVolumeDescriptorSequenceExtent = new UDF.ExtentDescriptor()
  /** @type {Buffer} Reserved */
  this.reserved = new Buffer( 480 )
  this.reserved.fill(0)

}

/**
 * Anchor Volume Descriptor Pointer structure size in bytes
 * @type {Number}
 */
AVDP.size = 2048

/**
 * Parse an Anchor Volume Descriptor Pointer structure from a buffer
 * @param {Buffer} buffer
 * @param {Numfer} [offset=0]
 * @returns {AVDP}
 */
AVDP.parse = function( buffer, offset ) {
  return new AVDP().parse( buffer, offset )
}

/**
 * AVDP prototype
 * @type {Object}
 */
AVDP.prototype = {

  constructor: AVDP,

  /**
   * Parse an Anchor Volume Descriptor Pointer structure from a buffer
   * @param {Buffer} buffer
   * @param {Numfer} [offset=0]
   * @returns {AVDP}
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
module.exports = AVDP
