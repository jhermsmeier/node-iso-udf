var UDF = module.exports

UDF.SYSTEM_REGION_SIZE = 32 * 1024 // 32 KB, 32768 B

UDF.CHARACTER_SET_TYPE = 0
UDF.CHARACTER_SET_INFO = 'OSTA Compressed Unicode'

UDF.CharSpec = require( './charspec' )
UDF.Timestamp = require( './timestamp' )
UDF.DescriptorTag = require( './descriptor-tag' )
