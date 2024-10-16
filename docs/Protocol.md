# Spark WS Protocol

**Version**: 1.0

## Data Types

| Type     | Description                                                                                     |
| -------- | ----------------------------------------------------------------------------------------------- |
| U8       | Unsigned 8-bit integer                                                                          |
| U16      | Unsigned 16-bit integer                                                                         |
| U32      | Unsigned 32-bit integer                                                                         |
| U24      | Unsigned 24-bit integer                                                                         |
| U64      | Unsigned 64-bit integer, normally used to send snowflake Ids                                    |
| I8       | Signed 8-bit integer                                                                            |
| I16      | Signed 16-bit integer                                                                           |
| I32      | Signed 32-bit integer                                                                           |
| I64      | Signed 64-bit integer                                                                           |
| F32      | 32-bit floating point number                                                                    |
| F64      | 64-bit floating point number                                                                    |
| Offset16 | 16-bit unsigned offset from the start of the message, unless otherwise specified                |
| Offset32 | 32-bit unsigned offset from the start of the message, unless otherwise specified                |
| UUID     | 128-bit UUID                                                                                    |
| BitField | Variable length bit field, the length is prefixed by a U8 and it will always be a multiple of 8 |
| String   | Plain text string, the length is prefixed by a U32                                              |

## Message format

### Header

The header is always the prefix of the message, it contains metadata about the message itself.

| Field          | Type     | Description                           |
| -------------- | -------- | ------------------------------------- |
| MessageID      | U64      | The ID of the message, snowflake ID   |
| PayloadLength  | U32      | The length of the payload             |
| OpCodeCategory | U8       | The operation category of the message |
| OpCode         | U8       | The operation code of the message     |
| Flags          | BitField | Flags for the message                 |
| FieldAmount    | U8       | The amount of fields in the message   |

The operation category and code are used to identify the operation that the message is performing, the category is a general category and the code is a specific operation inside that category.

The flags are used to define some metadata about the message, the flags are:

| Flag     | Description                                                                                        |
| -------- | -------------------------------------------------------------------------------------------------- |
| `1 << 0` | If the message is a response or a request                                                          |
| `1 << 1` | If the client should respond to the message                                                        |
| `1 << 2` | If the client should fetch the information from the server for more information                    |
| `1 << 3` | If the message should trigger an client reload (Dangerous, will be used only for critical updates) |
| `1 << 4` | If the client should return to the home screen after the message is processed                      |

### Field header

The field header is on the start of the message after the header, it contains metadata about each field. The amount of fields is defined by the `FieldAmount` field in the header.

| Field  | Type     | Description                                           |
| ------ | -------- | ----------------------------------------------------- |
| Type   | U8       | The type of the field                                 |
| Length | U16      | The length of the field                               |
| Offset | Offset32 | The offset of the field from the start of the message |

The field type is a U8, it can have a maximum of 256 different values.

| Field Type | TLDR      | Description                                                                                                                      |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------------------- |
| 0          | NULL (U8) | A void field, it is used to represent a field that does not have any data, normally used to be a placeholder for optional fields |
| 1          | UUID      | A 128-bit UUID                                                                                                                   |
| 2          | String    | Plain text string                                                                                                                |
| 3          | Boolean   | A boolean value, 0 for false, 1 for true                                                                                         |
| 4          | U24       | Unsigned 24-bit integer, normally used for colors                                                                                |
| 5          | U64       | Unsigned 64-bit integer, normally used for timestamps                                                                            |
| 6          | I64       | Signed 64-bit integer                                                                                                            |
| 7          | F64       | 64-bit floating point number, normally used for positions                                                                        |
| 8          | JSON      | A JSON object, normally used for complex data, although it kinda defeats the purpose of a binary protocol                        |
| 9          | BitField  | A variable length bit field, normally used to represent permissions                                                              |
| 10         | Buffer    | A binary buffer                                                                                                                  |

### Payload

The payload is the actual data of the message, it contains the fields defined in the field headers.
The field content will be placed after all the field headers, the order of the fields is defined by the order of the field headers and can be extracted by the offset and length of each field.
