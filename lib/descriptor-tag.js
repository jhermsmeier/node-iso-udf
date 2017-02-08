var UDF = require( './udf' )

/**
 * DescriptorTag
 * @constructor
 * @memberOf UDF
 * @returns {DescriptorTag}
 */
function DescriptorTag() {

  if( !(this instanceof DescriptorTag) )
    return new DescriptorTag()

  this.id = 0
  this.version = 0
  this.checksum = 0
  this.reserved = 0
  this.serialNumber = 0
  this.crc = 0
  this.crcLength = 0
  this.location = 0

}

/** @type {Number} Descriptor Tag structure size in bytes */
DescriptorTag.size = 16

/** @type {Number} Primary Volume Descriptor */
DescriptorTag.PVD = 0x0001
/** @type {Number} Anchor Volume Descriptor Pointer */
DescriptorTag.AVDP = 0x0002
/** @type {Number} Volume Descriptor Pointer */
DescriptorTag.VDP = 0x0003
/** @type {Number} Implementation Use Volume Descriptor */
DescriptorTag.IUVD = 0x0004
/** @type {Number} Partition Descriptor */
DescriptorTag.PD = 0x0005
/** @type {Number} Logical Volume Descriptor */
DescriptorTag.LVD = 0x0006
/** @type {Number} Unallocated Space Descriptor */
DescriptorTag.USD = 0x0007
/** @type {Number} Terminating Descriptor */
DescriptorTag.TD = 0x0008
/** @type {Number} Logical Volume Integrity Descriptor */
DescriptorTag.LVID = 0x0009

/**
 * Parse a Descrptor Tag structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {DescriptorTag}
 */
DescriptorTag.parse = function( value, offset ) {
  return new DescriptorTag().parse( value, offset )
}

/**
 * DescriptorTag prototype
 * @type {Object}
 * @ignore
 */
 DescriptorTag.prototype = {

  constructor: DescriptorTag,

  /**
   * Parse a Descrptor Tag structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {DescriptorTag}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.id = buffer.readUInt16LE( offset + 0 )
    this.version = buffer.readUInt16LE( offset + 2 )
    this.checksum = buffer.readUInt8( offset + 4 )
    this.reserved = buffer.readUInt8( offset + 5 )
    this.serialNumber = buffer.readUInt16LE( offset + 6 )
    this.crc = buffer.readUInt16LE( offset + 8 )
    this.crcLength = buffer.readUInt16LE( offset + 10 )
    this.location = buffer.readUInt32LE( offset + 12 )

    return this

  },

}

// Exports
module.exports = DescriptorTag
