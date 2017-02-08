/**
 * Extent Descriptor (extent_ad)
 * Describes the length & location of a structure's extent
 * @constructor
 * @memberOf UDF
 * @return {ExtentDescriptor}
 */
function ExtentDescriptor() {

  if( !(this instanceof ExtentDescriptor) )
    return new ExtentDescriptor()

  /** @type {Number} Extent length in bytes */
  this.length = 0
  /** @type {Number} Extent's logical block address */
  this.location = 0

}

/**
 * Parse an extent_ad structure from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {ExtentDescriptor}
 */
ExtentDescriptor.parse = function( buffer, offset ) {
  return new ExtentDescriptor().parse( buffer, offset )
}

/**
 * ExtentDescriptor prototype
 * @type {Object}
 */
ExtentDescriptor.prototype = {

  constructor: ExtentDescriptor,

  /**
   * Parse an extent_ad structure from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {ExtentDescriptor}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.length = buffer.readUInt32LE( offset )
    this.location = buffer.readUInt32LE( offset + 4 )

    return this

  },

}

// Exports
module.exports = ExtentDescriptor
