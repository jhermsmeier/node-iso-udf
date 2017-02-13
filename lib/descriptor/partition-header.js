var UDF = require( '../udf' )

/**
 * PartitionHeader
 * @constructor
 * @memberOf UDF.Descriptor
 * @return {PartitionHeader}
 */
function PartitionHeader() {

  if( !(this instanceof PartitionHeader) )
    return new PartitionHeader()

  this.unallocatedSpaceTable = new UDF.ExtentAddress()
  this.unallocatedSpaceBitmap = new UDF.ExtentAddress()
  this.partitionIntegrityTable = new UDF.ExtentAddress()
  this.freedSpaceTable = new UDF.ExtentAddress()
  this.freedSpaceBitmap = new UDF.ExtentAddress()
  // byte Reserved[88];

}

/**
 * Parse the structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {PartitionHeader}
 */
PartitionHeader.parse = function( buffer, offset ) {
  return new PartitionHeader().parse( buffer, offset )
}

/**
 * PartitionHeader prototype
 * @type {Object}
 * @ignore
 */
PartitionHeader.prototype = {

  constructor: PartitionHeader,

  /**
   * Parse the structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {PartitionHeader}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.unallocatedSpaceTable.parse( buffer, offset + 0 )
    this.unallocatedSpaceBitmap.parse( buffer, offset + 8 )
    this.partitionIntegrityTable.parse( buffer, offset + 16 )
    this.freedSpaceTable.parse( buffer, offset + 24 )
    this.freedSpaceBitmap.parse( buffer, offset + 32 )

    return this

  },

}

// Exports
module.exports = PartitionHeader
