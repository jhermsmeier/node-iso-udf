var UDF = require( '../../udf' )
var debug = require( 'debug' )( 'udf:volume:descriptor' )

var Descriptor = module.exports

/** @type {Number} Primary Volume Descriptor */
Descriptor.PVD = 0x0001
/** @type {Number} Anchor Volume Descriptor Pointer */
Descriptor.AVDP = 0x0002
/** @type {Number} Volume Descriptor Pointer */
Descriptor.VDP = 0x0003
/** @type {Number} Implementation Use Volume Descriptor */
Descriptor.IUVD = 0x0004
/** @type {Number} Partition Descriptor */
Descriptor.PD = 0x0005
/** @type {Number} Logical Volume Descriptor */
Descriptor.LVD = 0x0006
/** @type {Number} Unallocated Space Descriptor */
Descriptor.USD = 0x0007
/** @type {Number} Terminating Descriptor */
Descriptor.TD = 0x0008
/** @type {Number} Logical Volume Integrity Descriptor */
Descriptor.LVID = 0x0009

Descriptor.FSD = 0x0100
Descriptor.FID = 0x0101
Descriptor.AED = 0x0102
Descriptor.IE = 0x0103
Descriptor.TE = 0x0104
Descriptor.FE = 0x0105
Descriptor.EAHD = 0x0106
Descriptor.USE = 0x0107
Descriptor.SBD = 0x0108
Descriptor.PIE = 0x0109
Descriptor.EFE = 0x010A

// Descriptor.Tag = UDF.DescriptorTag
Descriptor.Primary = require( './primary' )
Descriptor.AnchorVolumePointer = require( './anchor-volume-pointer' )
Descriptor.VolumePointer = require( './volume-pointer' )
Descriptor.Implementation = require( './implementation' )
Descriptor.Partition = require( './partition' )
Descriptor.Logical = require( './logical' )
Descriptor.UnallocatedSpace = require( './unallocated' )
Descriptor.Terminal = require( './terminal' )
Descriptor.LogicalVolumeIntegrity = require( './logical-volume-integrity' )
Descriptor.Unknown = require( './unknown' )

/**
 * Get a descriptors constructor by type ident
 * @param {Number} typeId
 * @return {Descriptor.*}
 */
Descriptor.get = function( typeId ) {
  switch( typeId ) {
    // Main VDS
    case Descriptor.PVD: return Descriptor.Primary
    case Descriptor.AVDP: return Descriptor.AnchorVolumePointer
    case Descriptor.VDP: return Descriptor.VolumePointer
    case Descriptor.IUVD: return Descriptor.Implementation
    case Descriptor.PD: return Descriptor.Partition
    case Descriptor.LVD: return Descriptor.Logical
    case Descriptor.USD: return Descriptor.UnallocatedSpace
    case Descriptor.TD: return Descriptor.Terminal
    case Descriptor.LVID: return Descriptor.LogicalVolumeIntegrity
    // Partition
    case Descriptor.FSD: return Descriptor.FileSet
    case Descriptor.FID: return Descriptor.FileIdentifier
    case Descriptor.AED: return Descriptor.Unknown
    case Descriptor.IE: return Descriptor.Unknown
    case Descriptor.TE: return Descriptor.Unknown
    case Descriptor.FE: return Descriptor.FileEntry
    case Descriptor.EAHD: return Descriptor.Unknown
    case Descriptor.USE: return Descriptor.Unknown
    case Descriptor.SBD: return Descriptor.Unknown
    case Descriptor.PIE: return Descriptor.Unknown
    case Descriptor.EFE: return Descriptor.Unknown
    // Unknown
    default: return Descriptor.Unknown
  }
}

/**
 * Parse a descriptor from a buffer
 * @param {Buffer} buffer
 * @param {Number} [offset=0]
 * @return {Descriptor.*}
 */
Descriptor.parse = function( buffer, offset ) {

  offset = offset || 0

  var typeId = buffer.readUInt8( offset )
  var desc = Descriptor.get( typeId )

  if( desc === Descriptor.Unknown )
    debug( 'unknown', typeId )

  return desc.parse( buffer, offset )

}
