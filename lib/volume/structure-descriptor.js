var UDF = require( '../udf' )

/**
 * Volume Structure Descriptor (VSD)
 * Used in the Volume Recognition Sequence (VRS)
 * @constructor
 * @memberOf UDF.Volume
 * @returns {StructureDescriptor}
 */
function StructureDescriptor() {

  if( !(this instanceof StructureDescriptor) )
    return new StructureDescriptor()

  /** @type {Number} Type ID */
  this.type = 0
  /** @type {String} Type */
  this.id = ''
  /** @type {Number} Version */
  this.version = 0
  /** @type {Buffer} Data */
  this.data = new Buffer( 2048 - 7 )
  this.data.fill(0)

}

/**
 * Volume Structure Descriptor structure size in bytes
 * @type {Number}
 */
StructureDescriptor.size = 2048

/** @type {String} CD-ROM Volume Descriptor */
StructureDescriptor.CD001 = 'CD001'
/** @type {String} CD-ROM Volume Descriptor */
StructureDescriptor.CDW02 = 'CDW02'
/** @type {String} Beginning Extended Area Descriptor */
StructureDescriptor.BEA01 = 'BEA01'
/** @type {String} Boot Descriptor */
StructureDescriptor.BOOT2 = 'BOOT2'
/** @type {String} Volume Recognition Structure NSR02 */
StructureDescriptor.NSR02 = 'NSR02'
/** @type {String} Volume Recognition Structure NSR03 */
StructureDescriptor.NSR03 = 'NSR03'
/** @type {String} Terminating Extended Area Descriptor */
StructureDescriptor.TEA01 = 'TEA01'

/**
 * Parse a Volume Structure Descriptor from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @returns {StructureDescriptor}
 */
StructureDescriptor.parse = function( buffer, offset ) {
  return new StructureDescriptor().parse( buffer, offset )
}

/**
 * StructureDescriptor prototype
 * @type {Object}
 * @ignore
 */
StructureDescriptor.prototype = {

  constructor: StructureDescriptor,

  /**
   * Parse a Volume Structure Descriptor from a buffer
   * @param {Buffer} buffer
   * @param {Number} [offset=0]
   * @returns {StructureDescriptor}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.type = buffer.readUInt8( offset + 0 )
    this.id = buffer.toString( 'ascii', offset + 1, offset + 6 )
    this.version = buffer.readUInt8( offset + 6 )

    buffer.copy( this.data, 0, offset + 7, offset + 2048 )

    switch( this.id ) {
      case 'CD001':
        return require( './cd001' ).parse( buffer )
      case 'BOOT2':
        this.boot = UDF.Volume.BootDescriptor.parse( this.data )
        break
    }

    return this

  },

}

// Exports
module.exports = StructureDescriptor
