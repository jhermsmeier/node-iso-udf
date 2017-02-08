var UDF = require( './udf' )

/**
 * CharSpec
 * @constructor
 * @memberOf UDF
 * @param {Number} [type=UDF.CHARACTER_SET_TYPE]
 * @param {String} [info=UDF.CHARACTER_SET_INFO]
 * @returns {CharSpec}
 */
function CharSpec( type, info ) {

  if( !(this instanceof CharSpec) )
    return new CharSpec( type, info )

  this.type = type || UDF.CHARACTER_SET_TYPE
  this.info = info || UDF.CHARACTER_SET_INFO

}

/**
 * Parse a charspec structure from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {CharSpec}
 */
CharSpec.parse = function( buffer, offset ) {
  return new CharSpec().parse( buffer, offset )
}

/**
 * CharSpec prototype
 * @type {Object}
 * @ignore
 */
CharSpec.prototype = {

  constructor: CharSpec,

  parse: function( buffer, offset ) {

    offset = offset || 0

    this.type = buffer.readUInt8( offset + 0 )
    this.info = buffer.toString( 'utf8', offset + 1, offset + 64 )
      .replace( /\u0000/g, '' )

    return this

  },

}

// Exports
module.exports = CharSpec
