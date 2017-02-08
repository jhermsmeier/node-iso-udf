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
 * @param {Buffer} value
 * @returns {CharSpec}
 */
CharSpec.parse = function( value ) {
  return new CharSpec().parse( value )
}

/**
 * CharSpec prototype
 * @type {Object}
 * @ignore
 */
CharSpec.prototype = {

  constructor: CharSpec,

  parse: function( value ) {
    this.type = value.readUInt8( 0 )
    this.info = value.toString( 'utf16le', 1 )
    return this
  },

}

// Exports
module.exports = CharSpec
