var UDF = require( '../../udf' )

/**
 * Unknown
 * @constructor
 * @memberOf UDF.Volume.Descriptor
 * @return {Unknown}
 */
function Unknown() {

  if( !(this instanceof Unknown) )
    return new Unknown()

  this.tag = new UDF.DescriptorTag()

}

/**
 * Parse the structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {Unknown}
 */
Unknown.parse = function( buffer, offset ) {
  return new Unknown().parse( buffer, offset )
}

/**
 * Unknown prototype
 * @type {Object}
 * @ignore
 */
Unknown.prototype = {

  constructor: Unknown,

  /**
   * Parse the structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {Unknown}
   */
  parse: function( buffer, offset ) {
    offset = offset || 0
    this.tag.parse( buffer, offset )
    return this
  },

}

// Exports
module.exports = Unknown
