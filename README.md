# Universal Disk Format (UDF)
[![npm](https://img.shields.io/npm/v/iso-udf.svg?style=flat-square)](https://npmjs.com/package/iso-udf)
[![npm license](https://img.shields.io/npm/l/iso-udf.svg?style=flat-square)](https://npmjs.com/package/iso-udf)
[![npm downloads](https://img.shields.io/npm/dm/iso-udf.svg?style=flat-square)](https://npmjs.com/package/iso-udf)
[![build status](https://img.shields.io/travis/jhermsmeier/node-iso-udf.svg?style=flat-square)](https://travis-ci.org/jhermsmeier/node-iso-udf)

OSTA Universal Disk Format (UDF) / ISO 9660 file system

## Install via [npm](https://npmjs.com)

```sh
$ npm install --save iso-udf
```

## Specification

UDF is specified by the [Optical Storage Technology Association (OSTA)](http://www.osta.org/specs/index.htm),
this module aims to implement [Revision 2.60](http://www.osta.org/specs/pdf/udf260.pdf).

## Usage

```js
var UDF = require( 'iso-udf' )
```

## References

- [Understanding the UDF file system specification](https://www.rodneybeede.com/Understanding_the_UDF_file_system_specification.html)
- [Wenguang's Introduction to Universal Disk Format (UDF)](https://sites.google.com/site/udfintro/)
- [wiki.osdev.org/ISO_9660](https://wiki.osdev.org/ISO_9660)
- [pali/udftools](https://github.com/pali/udftools/blob/master/wrudf/wrudf.c)
- [El Torito (CD-ROM standard)](https://en.wikipedia.org/wiki/El_Torito_(CD-ROM_standard))
- [A BIOS to UEFI Transformation](http://www.rodsbooks.com/bios2uefi/) (regarding flashing .iso images & making them bootable)
- [UEFI Installation Media Format and default boot behavior](https://technet.microsoft.com/en-us/library/dn387088.aspx)
