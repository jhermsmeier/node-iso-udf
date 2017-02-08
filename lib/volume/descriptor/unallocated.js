var UDF = require( '../../udf' )

/**
 * UnallocatedSpace
 * @constructor
 * @memberOf UDF.Volume.Descriptor
 * @return {UnallocatedSpace}
 */
function UnallocatedSpace() {

  if( !(this instanceof UnallocatedSpace) )
    return new UnallocatedSpace()

  this.tag = new UDF.DescriptorTag()
  this.sequenceNumber = 0x00000000
  this.allocationDescriptorCount = 0x00000000
  this.allocationDescriptors = []

}

/**
 * Parse the structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {UnallocatedSpace}
 */
UnallocatedSpace.parse = function( buffer, offset ) {
  return new UnallocatedSpace().parse( buffer, offset )
}

/**
 * UnallocatedSpace prototype
 * @type {Object}
 * @ignore
 */
UnallocatedSpace.prototype = {

  constructor: UnallocatedSpace,

  /**
   * Parse the structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {UnallocatedSpace}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.tag.parse( buffer, offset )
    this.sequenceNumber = buffer.readUInt32LE( offset + 16 )
    this.allocationDescriptorCount = buffer.readUInt32LE( offset + 20 )
    this.allocationDescriptors = []

    for( var i = 0; i < this.allocationDescriptorCount; i++ ) {
      this.allocationDescriptors.push(
        UDF.ExtentAddress.parse( buffer, offset + 24 + i * UDF.ExtentAddress.size )
      )
    }

    return this

  },

}

// Exports
module.exports = UnallocatedSpace
