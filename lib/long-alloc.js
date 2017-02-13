/**
 * Long Allocation Descriptor (long_ad)
 * @constructor
 * @memberOf UDF
 * @return {LongAllocation}
 */
function LongAllocation() {

  if( !(this instanceof LongAllocation) )
    return new LongAllocation()

  /** @type {Number} Extent length in bytes */
  this.length = 0x00000000
  /** @type {Object} Extent's logical block address */
  this.location = { // lb_addr
    address: 0x00000000,
    partition: 0x0000,
  }
  /** @type {Buffer} data */
  this.data = new Buffer(6)
  this.data.fill(0)

}

/** @type {Number} Struct size in bytes */
LongAllocation.size = 16

/**
 * Parse an extent_ad structure from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {LongAllocation}
 */
LongAllocation.parse = function( buffer, offset ) {
  return new LongAllocation().parse( buffer, offset )
}

/**
 * LongAllocation prototype
 * @type {Object}
 */
LongAllocation.prototype = {

  constructor: LongAllocation,

  /**
   * Parse an extent_ad structure from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {LongAllocation}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.length = buffer.readUInt32LE( offset )
    this.location.address = buffer.readUInt32LE( offset + 4 )
    this.location.partition = buffer.readUInt16LE( offset + 8 )

    buffer.copy( this.data, 0, offset + 10, offset + 16 )

    return this

  },

}

// Exports
module.exports = LongAllocation
