var UDF = require( '../udf' )

/**
 * PrimaryVolume
 * @constructor
 * @memberOf UDF.Descriptor
 * @return {PrimaryVolume}
 */
function PrimaryVolume() {

  if( !(this instanceof PrimaryVolume) )
    return new PrimaryVolume()

  this.tag = new UDF.DescriptorTag()
  this.sequenceNumber = 0
  this.number = 0
  this.volumeIdentifier = 0
  this.volumeSequenceNumber = 0
  this.maxVolumeSequenceNumber = 0
  this.interchangeLevel = 0
  this.maxInterchangeLevel = 0
  this.charsetList = 0
  this.maxCharsetList = 0
  this.volumeSetIdentifier = ''
  this.charset = new UDF.CharSpec()
  this.explanatoryCharset = new UDF.CharSpec()
  this.volumeAbstract = new UDF.ExtentAddress()
  this.volumeCopyrightNotice = new UDF.ExtentAddress()
  this.applicationIdentifier = new UDF.EntityID()
  this.recorded = new UDF.Timestamp()
  this.implementationIdentifier = new UDF.EntityID()
  this.implementationUse = new Buffer(64)
  this.predecessorVolumeDescriptorSequenceLocation = 0
  this.flags = 0x0000
  this.reserved = new Buffer(22)

  this.implementationUse.fill(0)
  this.reserved.fill(0)

}

/** @type {Number} Struct size in bytes */
PrimaryVolume.size = 512

/**
 * Parse the structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {PrimaryVolume}
 */
PrimaryVolume.parse = function( buffer, offset ) {
  return new PrimaryVolume().parse( buffer, offset )
}

/**
 * PrimaryVolume prototype
 * @type {Object}
 * @ignore
 */
PrimaryVolume.prototype = {

  constructor: PrimaryVolume,

  /**
   * Parse the structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {PrimaryVolume}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.tag.parse( buffer, offset )
    this.sequenceNumber = buffer.readUInt32LE( offset + 16 )
    this.number = buffer.readUInt32LE( offset + 20 )
    this.volumeIdentifier = buffer.toString( 'utf16le', offset + 24, offset + 56 )
    this.volumeSequenceNumber = buffer.readUInt16LE( offset + 56 )
    this.maxVolumeSequenceNumber = buffer.readUInt16LE( offset + 58 )
    this.interchangeLevel = buffer.readUInt16LE( offset + 60 )
    this.maxInterchangeLevel = buffer.readUInt16LE( offset + 62 )
    this.charsetList = buffer.readUInt32LE( offset + 64 )
    this.maxCharsetList = buffer.readUInt32LE( offset + 68 )
    this.volumeSetIdentifier = buffer.toString( 'utf8', offset + 72, offset + 128 )
    this.charset.parse( buffer, offset + 200 )
    this.explanatoryCharset.parse( buffer, offset + 264 )
    this.volumeAbstract.parse( buffer, offset + 328 )
    this.volumeCopyrightNotice.parse( buffer, offset + 336 )
    this.applicationIdentifier.parse( buffer, offset + 344 )
    this.recorded.parse( buffer, offset + 376 )
    this.implementationIdentifier.parse( buffer, offset + 388 )

    buffer.copy( this.implementationUse, 0, offset + 420, offset + 484 )

    this.predecessorVolumeDescriptorSequenceLocation = buffer.readUInt32LE( offset + 484 )
    this.flags = buffer.readUInt16LE( offset + 488 )

    buffer.copy( this.reserved, 0, offset + 490, offset + 512 )

    return this

  },

}

// Exports
module.exports = PrimaryVolume
