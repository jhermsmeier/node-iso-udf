var UDF = require( '../../udf' )

/**
 * Terminal
 * @constructor
 * @memberOf UDF.Volume.Descriptor
 * @return {Terminal}
 */
function Terminal() {

  if( !(this instanceof Terminal) )
    return new Terminal()

  this.tag = new UDF.DescriptorTag()
  this.reserved = new Buffer(496)
  this.reserved.fill(0)

}

/** @type {Number} Struct size in bytes */
Terminal.size = 512

/**
 * Parse the structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {Terminal}
 */
Terminal.parse = function( buffer, offset ) {
  return new Terminal().parse( buffer, offset )
}

/**
 * Terminal prototype
 * @type {Object}
 * @ignore
 */
Terminal.prototype = {

  constructor: Terminal,

  /**
   * Parse the structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {Terminal}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.tag.parse( buffer, offset )
    buffer.copy( this.reserved, 0, offset + 16, offset + 512 )

    return this

  },

}

// Exports
module.exports = Terminal
