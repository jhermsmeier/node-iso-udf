var UDF = require( '../udf' )

/**
 * FileSet
 * NOTE: Only one File Set Descriptor shall be recorded.
 * On WORM media, multiple File Sets may be recorded.
 * @constructor
 * @memberOf UDF.Descriptor
 * @return {FileSet}
 */
function FileSet() {

  if( !(this instanceof FileSet) )
    return new FileSet()

  this.tag = new UDF.DescriptorTag()
  this.recorded = new UDF.Timestamp()
  this.interchangeLevel = 0x0000
  this.maxInterchangeLevel = 0x0000
  this.charsetList = 0x00000000
  this.maxCharsetList = 0x00000000
  this.number = 0x00000000
  this.descriptorNumber = 0x00000000
  this.logicalVolumeIdentifierCharset = new UDF.CharSpec()
  this.logicalVolumeIdentifier = ''
  this.charset = new UDF.CharSpec()
  this.identifier = ''
  this.copyrightFileIdentifier = ''
  this.abstractFileIdentifier = ''
  this.rootDirectoryICB = new UDF.LongAllocation()
  this.domainIdentifier = new UDF.EntityID()
  this.nextExtent = new UDF.LongAllocation()
  this.systemStreamDirectoryICB = new UDF.LongAllocation()
  this.reserved = new Buffer(32)

  this.reserved.fill(0)

}

/** @type {Number} Struct size in bytes */
FileSet.size = 512

/**
 * Parse the structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {FileSet}
 */
FileSet.parse = function( buffer, offset ) {
  return new FileSet().parse( buffer, offset )
}

/**
 * FileSet prototype
 * @type {Object}
 * @ignore
 */
FileSet.prototype = {

  constructor: FileSet,

  /**
   * Parse the structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {FileSet}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.tag.parse( buffer, offset )
    this.recorded.parse( buffer, offset + 16 )
    this.interchangeLevel = buffer.readUInt16LE( offset + 28 )
    this.maxInterchangeLevel = buffer.readUInt16LE( offset + 30 )
    this.charsetList = buffer.readUInt32LE( offset + 32 )
    this.number = buffer.readUInt32LE( offset + 36 )
    this.descriptorNumber = buffer.readUInt32LE( offset + 40 )
    this.logicalVolumeIdentifierCharset.parse( buffer, offset + 44 )
    this.logicalVolumeIdentifier = buffer.toString( 'utf16le', offset + 112, offset + 240 )
    this.charset.parse( buffer, offset + 240 )
    this.identifier = buffer.toString( 'utf16le', offset + 304, offset + 336 )
    this.copyrightFileIdentifier = buffer.toString( 'utf16le', offset + 336, offset + 368 )
    this.abstractFileIdentifier = buffer.toString( 'utf16le', offset + 368, offset + 400 )
    this.rootDirectoryICB.parse( buffer, offset + 400 )
    this.domainIdentifier.parse( buffer, offset + 416 )
    this.nextExtent.parse( buffer, offset + 448 )
    this.systemStreamDirectoryICB.parse( buffer, offset + 464 )

    buffer.copy( this.reserved, 0, offset + 480, offset + 512 )

    return this

  },

}

// Exports
module.exports = FileSet
