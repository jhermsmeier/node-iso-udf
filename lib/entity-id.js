/**
 * Entity Identifier
 * UDF classifies Entity Identifiers into 4 separate types:
 *   - Domain Entity Identifiers
 *   - UDF Entity Identifiers
 *   - Implementation Entity Identifiers
 *   - Application Entity Identifiers
 * @constructor
 * @memberOf UDF
 * @returns {EntityID}
 */
function EntityID() {

  if( !(this instanceof EntityID) )
    return new EntityID()

  /** @type {Number} Flags. Shall be set to `0` */
  this.flags = 0
  /** @type {String} ID uniquely identifying the implementation */
  this.identifier = ''

  /**
   * Dependent on the type of the Identifier
   * @todo Implement different types
   * @type {String}
   */
  this.suffix = ''

}

/**
 * Parse an entity_id structure from a buffer
 * @param {Buffer} value
 * @param {Number} [offset=0]
 * @returns {EntityID}
 */
EntityID.parse = function( value, offset ) {
  return new EntityID().parse( value, offset )
}

/**
 * EntityID prototype
 * @type {Object}
 * @ignore
 */
 EntityID.prototype = {

  constructor: EntityID,

  /**
   * Parse an entity_id structure from a buffer
   * @param {Buffer} value
   * @param {Number} [offset=0]
   * @returns {EntityID}
   */
  parse: function( buffer, offset ) {

    offset = offset || 0

    this.flags = buffer.readUInt8( offset )
    this.identifier = buffer.toString( 'utf8', offset + 1, offset + 24 )
    this.suffix = buffer.toString( 'utf8', offset + 24, offset + 64 )

    return this

  },

}

// Exports
module.exports = EntityID
