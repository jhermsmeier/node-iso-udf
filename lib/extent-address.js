/**
 * Extent Descriptor (extent_ad)
 * Describes the length & location of a structure's extent
 * @constructor
 * @memberOf UDF
 * @return {ExtentAddress}
 */
function ExtentAddress() {

  if( !(this instanceof ExtentAddress) )
    return new ExtentAddress()

  /** @type {Number} Extent length in bytes */
  this.length = 0
  /** @type {Number} Extent's logical block address */
  this.location = 0

}

/**
 * Parse an extent_ad structure from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {ExtentAddress}
 */
ExtentAddress.parse = function( buffer, offset ) {
  return new ExtentAddress().parse( buffer, offset )
}

/**
 * ExtentAddress prototype
 * @type {Object}
 */
ExtentAddress.prototype = {

  constructor: ExtentAddress,

  /**
   * Parse an extent_ad structure from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {ExtentAddress}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.length = buffer.readUInt32LE( offset )
    this.location = buffer.readUInt32LE( offset + 4 )

    return this

  },

}

// Exports
module.exports = ExtentAddress
