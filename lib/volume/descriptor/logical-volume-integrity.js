var UDF = require( '../../udf' )

/**
 * LogicalVolumeIntegrity
 * @constructor
 * @memberOf UDF.Volume.Descriptor
 * @return {LogicalVolumeIntegrity}
 */
function LogicalVolumeIntegrity() {

  if( !(this instanceof LogicalVolumeIntegrity) )
    return new LogicalVolumeIntegrity()

  this.tag = new UDF.DescriptorTag()
  this.recorded = new UDF.Timestamp()
  this.type = 0x00000000
  this.nextExtent = new UDF.ExtentAddress()
  this.contentsUse = new Buffer(32)
  this.partitionCount = 0x00000000
  this.implementationUseSize = 0x00000000
  this.freeSpaceTable = []
  this.sizeTable = []
  this.implementationUse = null

  this.contentsUse.fill(0)

}

/** @type {Number} Struct size in bytes (?) */
LogicalVolumeIntegrity.size = 512

/**
 * Parse the structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {LogicalVolumeIntegrity}
 */
LogicalVolumeIntegrity.parse = function( buffer, offset ) {
  return new LogicalVolumeIntegrity().parse( buffer, offset )
}

/**
 * LogicalVolumeIntegrity prototype
 * @type {Object}
 * @ignore
 */
LogicalVolumeIntegrity.prototype = {

  constructor: LogicalVolumeIntegrity,

  /**
   * Parse the structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {LogicalVolumeIntegrity}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.tag.parse( buffer, offset )
    this.recorded.parse( buffer, offset + 16 )
    this.type = buffer.readUInt32LE( offset + 28 )
    this.nextExtent.parse( buffer, offset + 32 )

    buffer.copy( this.contentsUse, 0, offset + 40, offset + 72 )

    this.partitionCount = buffer.readUInt32LE( offset + 72 )
    this.implementationUseSize = buffer.readUInt32LE( offset + 76 )
    this.freeSpaceTable = []
    this.sizeTable = []
    this.implementationUse = new Buffer( this.implementationUseSize )

    for( var i = 0; i < this.partitionCount; i++ ) {
      this.freeSpaceTable.push( buffer.readUInt32LE( offset + 80 + i * 4 ) )
      this.sizeTable.push( buffer.readUInt32LE( offset + 80 + this.partitionCount * 4 + i * 4 ) )
    }

    buffer.copy( this.implementationUse, 0, offset + 80 + this.partitionCount * 8 )

    return this

  },

}

// Exports
module.exports = LogicalVolumeIntegrity
