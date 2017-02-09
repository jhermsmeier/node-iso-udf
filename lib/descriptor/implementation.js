var UDF = require( '../udf' )

/**
 * ImplementationUse
 * @constructor
 * @memberOf UDF.Descriptor
 * @return {ImplementationUse}
 */
function ImplementationUse() {

  if( !(this instanceof ImplementationUse) )
    return new ImplementationUse()

  this.tag = new UDF.DescriptorTag()
  this.sequenceNumber = 0x00000000
  this.implementationIdentifier = new UDF.EntityID()
  this.ImplementationUse = new Buffer(460)

}

/** @type {Number} Struct size in bytes */
ImplementationUse.size = 512

/**
 * Parse the structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {ImplementationUse}
 */
ImplementationUse.parse = function( buffer, offset ) {
  return new ImplementationUse().parse( buffer, offset )
}

/**
 * ImplementationUse prototype
 * @type {Object}
 * @ignore
 */
ImplementationUse.prototype = {

  constructor: ImplementationUse,

  /**
   * Parse the structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {ImplementationUse}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.tag.parse( buffer, offset )
    this.sequenceNumber = buffer.readUInt32LE( offset + 16 )
    this.implementationIdentifier.parse( buffer, offset + 20 )

    buffer.copy( this.ImplementationUse, 0, offset + 52, offset + 512 )

    return this

  },

}

// Exports
module.exports = ImplementationUse
