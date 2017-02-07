# UDF Format

[ECMA-167]: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-167.pdf

The Universal Disk Format (UDF) is a subset of the [ECMA-167] standard, attempting to minimize the cost and complexity of an implementation.

This document contains excerpts from the official [UDF Specification 2.60](http://www.osta.org/specs/pdf/udf260.pdf) *(© Copyright 1994-2005
 Optical Storage Technology Association)*, as well as the [ECMA-167 Standard](http://www.ecma-international.org/publications/standards/Ecma-167.htm).

## Index
<!-- MarkdownTOC -->

- [Terminology](#terminology)
- [Data Structures](#data-structures)
    - [Charspec](#charspec)
    - [Timestamp](#timestamp)
    - [Entity Identifier](#entity-identifier)
- [Limitations & Requirements](#limitations--requirements)

<!-- /MarkdownTOC -->


## Terminology

|      |                                      |
|:-----|:-------------------------------------|
| AD   | Allocation Descriptor                |
| AVDP | Anchor Volume Descriptor Pointer     |
| EA   | Extended Attribute                   |
| EFE  | Extended File Entry                  |
| FE   | File Entry                           |
| FID  | File Identifier Descriptor           |
| FSD  | File Set Descriptor                  |
| ICB  | Information Control Block            |
| IUVD | Implementation Use Volume Descriptor |
| LV   | Logical Volume                       |
| LVD  | Logical Volume Descriptor            |
| LVID | Logical Volume Integrity Descriptor  |
| NWA  | Next Writable Address in a track     |
| PD   | Partition Descriptor                 |
| POW  | Pseudo OverWrite                     |
| PVD  | Primary Volume Descriptor            |
| SBD  | Space Bitmap Descriptor              |
| USD  | Unallocated Space Descriptor         |
| VAT  | Virtual Allocation Table             |
| VDS  | Volume Descriptor Sequence           |
| VRS  | Volume Recognition Sequence          |


## Data Structures

### Charspec

```c
/* ECMA 167 1/7.2.1 */
struct charspec {
  UInt8 CharacterSetType;
  byte CharacterSetInfo[63];
}
```

The `CharacterSetType` shall be set to `0`, indicating the CS0 coded character set,
and `CharacterSetInfo` should contain `"OSTA Compressed Unicode"`
(`4F53544120436F6D7072657373656420556E69636F6465`).

### Timestamp

All timestamps shall be recorded in local time. Time zones shall
be recorded on operating systems that support the concept of a
time zone.

```c
/* ECMA 167 1/7.3 */
struct timestamp {
  UInt16 TypeAndTimezone;
  Int16 Year;
  UInt8 Month;
  UInt8 Day;
  UInt8 Hour;
  UInt8 Minute;
  UInt8 Second;
  UInt8 Centiseconds;
  UInt8 HundredsofMicroseconds;
  UInt8 Microseconds;
}
```

#### TypeAndTimezone

`Type` refers to the most significant 4 bits of this field, and
`TimeZone` refers to the least significant 12 bits of this field,
which is interpreted as a signed 12-bit number in two’s complement form. 

`Type` should be equal to `1` for UDF compliant media.

`TimeZone` is the timezone offset **in minutes**, with timezones
West of UTC being negative, and should be interpreted as specifying the
timezone for the location when this field was last modified.
If this field contains `-2047` then the timezone has not been specified.

### Entity Identifier

**NOTE:** UDF uses `EntityID` for the structure that is called `regid` in ECMA-167.

```c
/* ECMA 167 1/7.4 */
struct EntityID {
  UInt8 Flags;
  char Identifier[23];
  char IdentifierSuffix[8];
}
```

#### Identifier

| Descriptor                                    | Field                                           | Value                     | Suffix Type                      |
|:----------------------------------------------|:------------------------------------------------|:--------------------------|:---------------------------------|
| Primary Volume Descriptor                     | Implementation ID                               | "\*Developer ID"           | Implementation Identifier Suffix |
| Primary Volume Descriptor                     | Application ID                                  | "\*Application ID"         | Application Identifier Suffix    |
| Implementation Use Volume Descriptor          | Implementation Identifier                       | "\*UDF LV Info"            | UDF Identifier Suffix            |
| Implementation Use Volume Descriptor          | Implementation ID (in Implementation Use field) | "\*Developer ID"           | Implementation                   |
| Identifier Suffix Partition Descriptor        | Implementation ID                               | "\*Developer ID"           | Implementation                   |
| Identifier Suffix Partition Descriptor        | Partition Contents                              | "+NSR03"                  | Application Identifier Suffix    |
| Logical Volume Descriptor                     | Implementation ID                               | "\*Developer ID"           | Implementation Identifier Suffix |
| Logical Volume Descriptor                     | Domain ID                                       | "\*OSTA UDF Compliant"     | Domain Identifier Suffix         |
| File Set Descriptor                           | Domain ID                                       | "\*OSTA UDF Compliant"     | Domain Identifier Suffix         |
| File Identifier Descriptor                    | Implementation Use (optional)                   | "\*Developer ID"           | Implementation Identifier Suffix |
| File Entry                                    | Implementation ID                               | "\*Developer ID"           | Implementation Identifier Suffix |
| Device Specification Extended Attribute       | Implementation Use                              | "\*Developer ID"           | Implementation Identifier Suffix |
| UDF Implementation Use Extended Attribute     | Implementation ID                               | See 3.3.4.5               | UDF Identifier Suffix            |
| Non-UDF Implementation Use Extended Attribute | Implementation ID                               | "\*Developer ID"           | Implementation Identifier Suffix |
| UDF Application Use Extended Attribute        | Application ID                                  | See 3.3.4.6               | UDF Identifier Suffix            |
| Non-UDF Application Use Extended Attribute    | Application ID                                  | "\*Application ID"         | Application Identifier Suffix    |
| UDF Unique ID Mapping Data                    | Implementation ID                               | "\*Developer ID"           | Implementation Identifier Suffix |
| Power Calibration Table Stream                | Implementation ID                               | "\*Developer ID"           | Implementation Identifier Suffix |
| Logical Volume Integrity Descriptor           | Implementation ID (in Implementation Use field) | "\*Developer ID"           | Implementation Identifier Suffix |
| Partition Integrity Entry                     | Implementation ID                               | N/A                       | N/A                              |
| Virtual Partition Map                         | Partition Type Identifier                       | "\*UDF Virtual Partition"  | UDF Identifier Suffix            |
| Virtual Allocation Table                      | Implementation Use (optional)                   | "\*Developer ID"           | Implementation Identifier Suffix |
| Sparable Partition Map                        | Partition Type Identifier                       | "\*UDF Sparable Partition" | UDF Identifier Suffix            |
| Sparing Table                                 | Sparing Identifier                              | "\*UDF Sparing Table"      | UDF Identifier Suffix            |
| Metadata Partition Map                        | Partition Type Identifier                       | "\*UDF Metadata Partition" | UDF Identifier Suffix            |


## Limitations & Requirements

#### Logical Sector Size

The Logical Sector Size for a specific volume shall be the same as
the physical sector size of the specific volume.

#### Logical Block Size

The Logical Block Size for a Logical Volume shall be set to the
logical sector size of the volume or volume set on which the
specific logical volume resides.

#### Volume Sets

All media within the same Volume Set shall have the same
physical sector size. Rewritable/Overwritable media and WORM
media shall not be mixed in/ be present in the same volume set.

#### First 32K of Volume Space

The first 32768 bytes of the Volume space shall not be used for the
recording of ECMA-167 structures. This area shall not be
referenced by the Unallocated Space Descriptor or any other
ECMA-167 descriptor. This is intended for use by the native
operating system.

#### Volume Recognition Sequence

The Volume Recognition Sequence as described in part 2 of
ECMA-167 shall be recorded.

#### Entity Identifiers

Entity Identifiers shall be recorded in accordance with this
document. Unless otherwise specified in this specification the
Entity Identifiers shall contain a value that uniquely identifies the
implementation. 

#### Descriptor CRCs

CRCs shall be supported and calculated for all Descriptors. There
are exception rules for the Descriptor CRC Length of the Space
Bitmap Descriptor and the Allocation Extent Descriptor.

#### File Name Length

Maximum of 255 bytes

#### Extent Length

Maximum Extent Length shall be 230 – 1 rounded down to the
nearest integral multiple of the Logical Block Size. Maximum
Extent Length for extents in virtual space shall be the Logical
Block Size.

#### Primary Volume Descriptor

There shall be exactly one prevailing Primary Volume Descriptor
recorded per volume. The media where the
VolumeSequenceNumber of this descriptor is equal to 1 (one) must
be part of the logical volume defined by the prevailing Logical
Volume Descriptor.

#### Anchor Volume Descriptor Pointer

Shall be recorded in at least 2 of the following 3 locations: 256,
N-256, or N, where N is the last addressable sector of a volume.


#### Partition Descriptor

A Partition Descriptor Access Type of read-only, rewritable,
overwritable, write-once and pseudo-overwritable shall be
supported. There shall be exactly one prevailing Partition
Descriptor recorded per volume, with one exception. For Volume
Sets that consist of single volume, the volume may contain 2 nonoverlapping
Partitions with 2 prevailing Partition Descriptors only
if one has an Access Type of read-only and the other has an
Access Type of rewritable, overwritable, or write-once. The
Logical Volume for this volume would consist of the contents of
both partitions.

#### Logical Volume Descriptor

There shall be exactly one prevailing Logical Volume Descriptor
recorded per Volume Set.

The LogicalVolumeIdentifier field shall not be null and should
contain an identifier that aids in the identification of the logical
volume. Specifically, software generating volumes conforming to
this specification shall not set this field to a fixed or trivial value.
Duplicate disks, which are intended to be identical, may contain
the same value in this field. This field is extremely important in
logical volume identification when multiple media are present
within a jukebox. This name is typically what is displayed to the
user.

The Logical Volume Descriptor recorded on the volume where the
Primary Volume Descriptor’s VolumeSequenceNumber field is
equal to 1 (one) must have a NumberofPartitionMaps value and
PartitionMaps structure(s) that represent the entire logical volume.
For example, if a volume set is extended by adding partitions, then
the updated Logical Volume Descriptor written to the last volume
in the set must also be written (or rewritten) to the first volume of
the set.

#### Logical Volume Integrity Descriptor

Shall be recorded. The Logical Volume Integrity Sequence extent
of LVIDs may be terminated by the extent length.

#### Partition Integrity Entry

Shall not be recorded.

#### Unallocated Space Descriptor

A single prevailing Unallocated Space Descriptor shall be recorded
per volume.

#### File Set Descriptor

There shall be exactly one File Set Descriptor recorded per Logical
Volume. The sole exception is for non-sequential Write-Once
media (WORM). The FSD extent may be terminated by
the extent length.

#### ICB Tag

Only ICB Strategy Types 4 or 4096 shall be recorded.

#### File Identifier Descriptor

The total length of a File Identifier Descriptor shall not exceed the
size of one Logical Block.

#### File Entry

The total length of a File Entry shall not exceed the size of one
Logical Block.

#### Allocation Descriptors

Only Short and Long Allocation Descriptors shall be recorded.

#### Allocation Extent Descriptors

The length of any single extent of allocation descriptors shall not
exceed the Logical Block Size.

#### Unallocated Space Entry

The total length of an Unallocated Space Entry shall not exceed
the size of one Logical Block.

#### Volume Descriptor Sequence Extent

Both the main and reserve volume descriptor sequence extents
shall each have a minimum length of 16 logical sectors. The VDS
Extent may be terminated by the extent length.

#### Record Structure

Record structure files, as defined in part 5 of ECMA 167, shall not
be created.

#### Minimum UDF Read Revision

The Minimum UDF Read Revision value shall be at most #0250
for all media with a UDF 2.60 file system. This indicates that a
UDF 2.50 implementation can read all UDF 2.60 media. Media
that do not have a Metadata Partition may use a value lower than
\#250.
