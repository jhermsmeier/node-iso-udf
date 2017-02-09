var UDF = require( '../udf' )

/**
 * LogicalVolume
 * @constructor
 * @memberOf UDF.Descriptor
 * @return {LogicalVolume}
 */
function LogicalVolume() {

  if( !(this instanceof LogicalVolume) )
    return new LogicalVolume()

  this.tag = new UDF.DescriptorTag()
  this.sequenceNumber = 0x00000000
  this.charset = new UDF.CharSpec()
  this.identifier = ''
  this.blockSize = 0x00000000
  this.domainIdentifier = new UDF.EntityID()
  this.contentsUse = new Buffer(16)
  this.mapTableLength = 0x00000000
  this.numberOfPartitionMaps = 0x00000000
  this.implementationIdentifier = new UDF.EntityID()
  this.implementationUse = new Buffer(128)
  this.integritySequence = new UDF.ExtentAddress()
  this.partitionMaps = null // new Buffer( this.mapTableLength )

}

/** @type {Number} Struct size in bytes (?) */
LogicalVolume.size = 512

/**
 * Parse the structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {LogicalVolume}
 */
LogicalVolume.parse = function( buffer, offset ) {
  return new LogicalVolume().parse( buffer, offset )
}

/**
 * LogicalVolume prototype
 * @type {Object}
 * @ignore
 */
LogicalVolume.prototype = {

  constructor: LogicalVolume,

  /**
   * Parse the structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {LogicalVolume}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.tag.parse( buffer, offset )
    this.sequenceNumber = buffer.readUInt32LE( offset + 16 )
    this.charset.parse( buffer, offset + 20 )
    this.identifier = buffer.toString( 'utf8', offset + 84, offset + 212 )
    this.blockSize = buffer.readUInt32LE( offset + 212 )
    this.domainIdentifier.parse( buffer, offset + 216 )

    buffer.copy( this.contentsUse, 0, offset + 248, offset + 264 )

    this.mapTableLength = buffer.readUInt32LE( offset + 264 )
    this.numberOfPartitionMaps = buffer.readUInt32LE( offset + 268 )
    this.implementationIdentifier.parse( buffer, offset + 272 )

    buffer.copy( this.implementationUse, 0, offset + 304, offset + 432 )

    this.integritySequence.parse( buffer, offset + 432 )
    this.partitionMaps = new Buffer( this.mapTableLength )

    // TODO: Parse partition maps

    return this

  },

}

// Exports
module.exports = LogicalVolume
