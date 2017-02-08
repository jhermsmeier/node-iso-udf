/**
 * Timestamp
 * @constructor
 * @memberOf UDF
 * @param {Number} [time]
 * @param {Number} [tzOffset]
 * @returns {Timestamp}
 */
function Timestamp( time, tzOffset ) {

  if( !(this instanceof Timestamp) )
    return new Timestamp( time, tzOffset )

  this.type = 0
  this.timezone = 0
  this.year = 0
  this.month = 0
  this.day = 0
  this.hour = 0
  this.minute = 0
  this.second = 0
  this.centiseconds = 0
  this.hundredsofMicroseconds = 0
  this.microseconds = 0

}

/**
 * Parse a timestamp structure from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {Timestamp}
 */
Timestamp.parse = function( buffer, offset ) {
  return new Timestamp().parse( buffer, offset )
}

/**
 * Timestamp prototype
 * @type {Object}
 * @ignore
 */
Timestamp.prototype = {

  constructor: Timestamp,

  parse: function( buffer, offset ) {

    offset = offset || 0

    this.type = buffer.readUInt16LE( offset + 0 ) & 0xF000
    this.timezone = buffer.readUInt16LE( offset + 0 ) & 0x0FFF
    this.year = buffer.readInt16LE( offset + 1 )
    this.month = buffer.readUInt8( offset + 5 )
    this.day = buffer.readUInt8( offset + 6 )
    this.hour = buffer.readUInt8( offset + 7 )
    this.minute = buffer.readUInt8( offset + 8 )
    this.second = buffer.readUInt8( offset + 9 )
    this.centiseconds = buffer.readUInt8( offset + 10 )
    this.hundredsofMicroseconds = buffer.readUInt8( offset + 11 )
    this.microseconds = buffer.readUInt8( offset + 12 )

    return this

  },

  valueOf: function() {
    // TODO:
    // return new Date( ... )
    return this
  },

}

// Exports
module.exports = Timestamp
