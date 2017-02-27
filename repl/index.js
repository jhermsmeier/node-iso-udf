var UDF = require( '..' )
var BlockDevice = require( 'blockdevice' )
var util = require( 'util' )
var fs = require( 'fs' )
var path = require( 'path' )

function inspect( value ) {
  return util.inspect( value, {
    depth: null,
    colors: process.stdout.isTTY,
  })
}

var EOL = '\n'

console.log( EOL + 'UDF', inspect( UDF ) )

var imagePath = path.join( process.env.HOME, 'Downloads', 'image.iso' )
var stats = fs.statSync( imagePath )

console.log( EOL + 'stats', inspect( stats ) )

var device = new BlockDevice({
  blockSize: 512,
  path: imagePath,
  size: stats.size,
  mode: 'r',
})

var volume = new UDF.Volume( device )

device.open( function( error ) {

  if( error ) throw error

  volume.open( function( error, desc ) {
    console.log( '' )
    // console.log( buffer )
    console.log( desc )
    console.log( '' )
    console.log( error || inspect( volume ) )
  })

})
