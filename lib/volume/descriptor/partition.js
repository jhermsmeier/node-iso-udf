var UDF = require( '../../udf' )

/**
 * Partition
 * @constructor
 * @memberOf UDF.Volume.Descriptor
 * @return {Partition}
 */
function Partition() {

  if( !(this instanceof Partition) )
    return new Partition()

  this.tag = new UDF.DescriptorTag()
  this.sequenceNumber = 0x00000000
  this.flags = 0x0000
  this.number = 0x0000
  this.contents = new UDF.EntityID()
  this.contentsUse = new Buffer(128)
  this.accessType = 0x00000000
  this.location = 0x00000000
  this.length = 0x00000000
  this.implementationIdentifier = new UDF.EntityID()
  this.implementationUse = new Buffer(128)
  this.reserved = new Buffer(156)

  this.contentsUse.fill(0)
  this.implementationUse.fill(0)
  this.reserved.fill(0)

}

/** @type {Number} Struct size in bytes */
Partition.size = 512

/**
 * Parse the structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {Partition}
 */
Partition.parse = function( buffer, offset ) {
  return new Partition().parse( buffer, offset )
}

/**
 * Partition prototype
 * @type {Object}
 * @ignore
 */
Partition.prototype = {

  constructor: Partition,

  /**
   * Parse the structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {Partition}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.tag.parse( buffer, offset )
    this.sequenceNumber = buffer.readUInt32LE( offset + 16 )
    this.flags = buffer.readUInt16LE( offset + 20 )
    this.number = buffer.readUInt16LE( offset + 22 )

    this.contents.parse( buffer, offset + 24 )

    buffer.copy( this.contentsUse, 0, offset + 56, offset + 184 )

    this.accessType = buffer.readUInt32LE( offset + 184 )
    this.location = buffer.readUInt32LE( offset + 188 )
    this.length = buffer.readUInt32LE( offset + 192 )

    this.implementationIdentifier.parse( buffer, offset + 196 )

    buffer.copy( this.implementationUse, 0, offset + 228, offset + 356 )
    buffer.copy( this.reserved, 0, offset + 356, offset + 512 )

    return this

  },

}

// Exports
module.exports = Partition
