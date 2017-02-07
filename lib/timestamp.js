/**
 * Timestamp
 * @return {Timestamp}
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

Timestamp.parse = function( value ) {
  return new Timestamp().parse( value )
}

/**
 * Timestamp prototype
 * @type {Object}
 */
Timestamp.prototype = {

  constructor: Timestamp,

  parse: function( value ) {

    this.type = buffer.readUInt16LE(0) & 0xF000
    this.timezone = buffer.readUInt16LE(0) & 0x0FFF
    this.year = buffer.readInt16LE(1)
    this.month = buffer[5]
    this.day = buffer[6]
    this.hour = buffer[7]
    this.minute = buffer[8]
    this.second = buffer[9]
    this.centiseconds = buffer[10]
    this.hundredsofMicroseconds = buffer[11]
    this.microseconds = buffer[12]

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
