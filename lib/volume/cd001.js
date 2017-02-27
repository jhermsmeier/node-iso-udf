var UDF = require( '../udf' )

/**
 * CD001 Volume Structure Descriptor
 * To be interpreted as per ECMA-119
 * @see http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-119.pdf
 * @return {CD001}
 */
function CD001() {

  if( !(this instanceof CD001) )
    return new CD001()

  /** @type {Number} Type ID */
  this.type = 0
  /** @type {String} Type */
  this.id = ''
  /** @type {Number} Version */
  this.version = 0

}

CD001.size = 2048

/**
 * Parse a CD001 Volume Structure Descriptor from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {CD001}
 */
CD001.parse = function( buffer, offset ) {
  return new CD001().parse( buffer, offset )
}

CD001.parseTimestamp = function( buffer, offset ) {

  var year = +buffer.toString( 'ascii', offset + 0, offset + 4 )
  var month = +buffer.toString( 'ascii', offset + 4, offset + 6 )
  var day = +buffer.toString( 'ascii', offset + 6, offset + 8 )
  var hours = +buffer.toString( 'ascii', offset + 8, offset + 10 )
  var minutes = +buffer.toString( 'ascii', offset + 10, offset + 12 )
  var seconds = +buffer.toString( 'ascii', offset + 12, offset + 14 )
  var centiSeconds = +buffer.toString( 'ascii', offset + 14, offset + 16 )
  var tzOffset = buffer.readInt8( offset + 16 ) * 15 / 60

  var utc = Date.UTC( year, month - 1, day, hours, minutes, seconds, centiSeconds * 10 )
  var time = year !== 0 ? utc + ( tzOffset * 60 * 60 * 1000 ) : NaN

  return new Date( time )

}

/**
 * CD001 prototype
 * @type {Object}
 */
CD001.prototype = {

  constructor: CD001,

  /**
   * Parse a CD001 Volume Structure Descriptor from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {CD001}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.type = buffer.readUInt8( offset + 0 )
    this.id = buffer.toString( 'ascii', offset + 1, offset + 6 )
    this.version = buffer.readUInt8( offset + 6 )

    switch( this.type ) {
      case 0x00:
        this.typeName = 'Boot Record'
        this.bootSystemIdentifier = buffer.toString( 'ascii', offset + 8, offset + 40 ).trim()
        this.bootIdentifier = buffer.toString( 'ascii', offset + 40, offset + 72 ).trim()
        this.bootSystemUse = buffer.slice( offset + 72, offset + 2048 )
        break
      case 0x01:
        this.typeName = 'Primary Volume Descriptor'
        this.systemIdentifier = buffer.toString( 'ascii', offset + 8, offset + 40 ).trim()
        this.volumeIdentifier = buffer.toString( 'utf8', offset + 40, offset + 72 ).trim()
        this.volumeSpaceSize = buffer.readUIntLE( offset + 80, 8 )
        this.volumeSetSize = buffer.readUInt32LE( offset + 120 )
        this.volumeSequenceNumber = buffer.readUInt32LE( offset + 124 )
        this.logicalBlockSize = buffer.readUInt16LE( offset + 128 )
        this.pathTableSize = buffer.readUIntLE( offset + 132, 8 )
        this.typeLpathTableLocation = buffer.readUIntLE( offset + 140, 4 )
        this.optionalTypeLpathTableLocation = buffer.readUIntLE( offset + 144, 4 )
        this.typeMpathTableLocation = buffer.readUIntLE( offset + 148, 4 )
        this.optionalTypeMpathTableLocation = buffer.readUIntLE( offset + 152, 4 )
        this.rootDirectoryRecordLocation = buffer.slice( offset + 156, offset + 190 )
        this.volumeSetIdentifier = buffer.toString( 'utf8', offset + 190, offset + 318 ).trim()
        this.publisherIdentifier = buffer.toString( 'ascii', offset + 318, offset + 446 ).trim()
        this.dataPreparerIdentifier = buffer.toString( 'ascii', offset + 446, offset + 574 ).trim()
        this.applicationIdentifier = buffer.toString( 'ascii', offset + 574, offset + 702 ).trim()
        this.copyrightFileIdentifier = buffer.toString( 'ascii', offset + 702, offset + 739 ).trim()
        this.abstractFileIdentifier = buffer.toString( 'ascii', offset + 739, offset + 776 ).trim()
        this.bibliographicFileIdentifier = buffer.toString( 'ascii', offset + 776, offset + 813 ).trim()
        this.creation = CD001.parseTimestamp( buffer, offset + 813 )
        this.modification = CD001.parseTimestamp( buffer, offset + 830 )
        this.expiration = CD001.parseTimestamp( buffer, offset + 847 )
        this.effective = CD001.parseTimestamp( buffer, offset + 864 )
        this.fileStructureVersion = buffer.readUInt8( offset + 881 )
        // reserved 882
        this.applicationUse = buffer.slice( offset + 883, offset + 1395 )
        // reserved 1395-2048
        break
      case 0x02:
        this.typeName = 'Supplementary Volume Descriptor'
        break
      case 0x03:
        this.typeName = 'Volume Partition Descriptor'
        break
      case 0xFF:
        this.typeName = 'Volume Descriptor Set Terminator'
        break
    }

    return this

  },

}

// Exports
module.exports = CD001
