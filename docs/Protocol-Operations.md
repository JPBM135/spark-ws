# Spark WS Operations

Operations are a set of enums that are used to indentify the type of message that is being sent or received. They are used to determine how the message should be handled and how its data should be interpreted.

## Operation Codes

Since the OpCode is a U8, it can have a maximum of 256 different values.

Subscriptions are used to listen to specific events inside that unless the client is subscribed to that event, it will not receive any messages related to it.

## Operation Categories

Categories are used to group operations that have similar purposes, they are used to make it easier to identify the type of operation that is being performed.

The only reserved category is the `0x00` category, it is used to identify the internal operations of the application.

| Category | Bitwise Operation | TLDR | Description          |
| -------- | ----------------- | ---- | -------------------- |
| 0        | `0 << 0`          | `ws` | WebSocket operations |

### WebSocket Operations (`ws`)

| OpCode | Bitwise Operation | Readable Code      | Description                                                                            | Sendable By   |
| ------ | ----------------- | ------------------ | -------------------------------------------------------------------------------------- | ------------- |
| 1      | `1 << 0`          | `ws:ping`          | Pings the client                                                                       | Server/Client |
| 2      | `1 << 1`          | `ws:heartbeat`     | Sends a heartbeat to the server                                                        | Client        |
| 3      | `1 << 2`          | `ws:heartbeat_ack` | Acknowledges the heartbeat from the client                                             | Server        |
| 4      | `1 << 3`          | `ws:ack`           | Acknowledges the message from the server                                               | Server/Client |
| 5      | `1 << 4`          | `ws:connect`       | Connects the client to the server                                                      | Client        |
| 6      | `1 << 5`          | `ws:connect_ack`   | Acknowledges the connection from the server and sends the gateway information          | Server        |
| 7      | `1 << 6`          | `ws:close`         | Will be sent before the connection is closed by any party                              | Server/Client |
| 8      | `1 << 7`          | `ws:resume`        | Resumes the connection using the `session_id`, `heartbeat_token` and `last_message_id` | Client        |
| 9      | `1 << 8`          | `ws:resume_ack`    | Acknowledges the resuming process and sends updated information about the client       | Server        |

#### `ws:ping`

- **OpCode**: 1
- **Bitwise Operation**: `1 << 0`
- **Sendable By**: Server/Client

Pings the client to check if it is still connected. The client MUST respond to this message with a `ws:ack` message in the specified `ackTimeout` time to avoid being disconnected. The server may send a ping to the client at any time even out of the normal heartbeat interval.

*This message has no fields apart from the header.*

#### `ws:heartbeat`

- **OpCode**: 2
- **Bitwise Operation**: `1 << 1`
- **Sendable By**: Client

Sends a heartbeat to the server to keep the connection alive. The server will send the ack interval in the first `ws:gateway` message.

| Field          | Type     | Description                                                                                               | Required |
| -------------- | -------- | --------------------------------------------------------------------------------------------------------- | :------: |
| HeartbeatToken | `String` | The token to be used to authenticate the heartbeat, this token will be sent in the first gateway package. |    ✔️     |

#### `ws:heartbeat_ack`

- **OpCode**: 3
- **Bitwise Operation**: `1 << 2`
- **Sendable By**: Server

Acknowledges the heartbeat from the client. The server may also send updated information about the client in this message.

| Field                    | Type     | Description                                                                                                    | Required |
| ------------------------ | -------- | -------------------------------------------------------------------------------------------------------------- | :------: |
| UpdatedToken             | `String` | The updated token to be used to authenticate the heartbeat, this token needs to be used in the next heartbeat. |    ❌     |
| UpdatedHeartbeatInterval | `U32`    | The updated heartbeat interval to be used in the next heartbeat.                                               |    ❌     |

> [!IMPORTANT]
> Since both fields are optional, if one of them is present, the other one must be present as well but will contain a type of `null`.

#### `ws:ack`

- **OpCode**: 4
- **Bitwise Operation**: `1 << 3`
- **Sendable By**: Server/Client

Used to acknowledge any message that was sent by the server or the client. This message is used to confirm that the message was received and processed.

| Field | Type  | Description                                       | Required |
| ----- | ----- | ------------------------------------------------- | :------: |
| AckId | `U64` | The ID of the message that is being acknowledged. |    ✔️     |

#### `ws:connect`

- **OpCode**: 5
- **Bitwise Operation**: `1 << 4`
- **Sendable By**: Client

Connects the client to the server. The client MUST send this message to the server to start the connection process in the `connectionTimeout` or it will be disconnected. The server will respond with a `ws:connect_ack` message.

| Field | Type     | Description                                          |                        Required                        |
| ----- | -------- | ---------------------------------------------------- | :----------------------------------------------------: |
| Token | `String` | The token to be used to authenticate the connection. | ✔️ (only if the server is required to be authenticated) |

#### `ws:connect_ack`

- **OpCode**: 6
- **Bitwise Operation**: `1 << 5`
- **Sendable By**: Server

Acknowledges the connection from the client and sends the gateway information to the client.

| Field             | Type     | Description                                                             | Required |
| ----------------- | -------- | ----------------------------------------------------------------------- | :------: |
| SessionId         | `UUID`   | The ID of the session that is being created.                            |    ✔️     |
| Token             | `String` | The token to be used to authenticate the heartbeat.                     |    ✔️     |
| HeartbeatInterval | `U32`    | The interval in milliseconds that the client should send the heartbeat. |    ✔️     |

#### `ws:close`

- **OpCode**: 7
- **Bitwise Operation**: `1 << 6`
- **Sendable By**: Server/Client

Will be sent before the connection is closed by any party. This message is used to inform the other party that the connection will be closed.

| Field  | Type     | Description                                                                       | Required |
| ------ | -------- | --------------------------------------------------------------------------------- | :------: |
| Code   | `U16`    | The code of the disconnection. This codes are different from the WebSocket codes. |    ✔️     |
| Reason | `String` | The reason for the disconnection.                                                 |    ✔️     |

> [!NOTE]
> This message does not require a ack, the connection will be closed after this message is sent.

#### `ws:resume`

- **OpCode**: 8
- **Bitwise Operation**: `1 << 7`
- **Sendable By**: Client

Resumes the connection using the `session_id`, `heartbeat_token` and `last_message_id` from the previous connection. The server will respond with a `ws:resume_ack` message if the resuming process was successful or a `ws:close` message if it was not.

| Field          | Type     | Description                                                                                               | Required |
| -------------- | -------- | --------------------------------------------------------------------------------------------------------- | :------: |
| SessionId      | `UUID`   | The ID of the session that is being resumed.                                                              |    ✔️     |
| HeartbeatToken | `String` | The token to be used to authenticate the heartbeat, this token will be sent in the first gateway package. |    ✔️     |
| LastMessageId  | `U64`    | The ID of the last message that was received by the client before the connection was closed.              |    ❌     |

> [!IMPORTANT]
> The `last_message_id` is the ID of the last message that was received by the client before the connection was closed. Since this field is optional, if it is not present, the server will not attempt to replay any missed messages.

#### `ws:resume_ack`

- **OpCode**: 9
- **Bitwise Operation**: `1 << 8`
- **Sendable By**: Server

Acknowledges the resuming process and sends updated information about the client. The server may also replay any missed messages that were sent after the last message ID.

| Field             | Type     | Description                                                             | Required |
| ----------------- | -------- | ----------------------------------------------------------------------- | :------: |
| SessionId         | `UUID`   | The ID of the session that is being resumed.                            |    ✔️     |
| Token             | `String` | The token to be used to authenticate the heartbeat.                     |    ✔️     |
| HeartbeatInterval | `U32`    | The interval in milliseconds that the client should send the heartbeat. |    ✔️     |
