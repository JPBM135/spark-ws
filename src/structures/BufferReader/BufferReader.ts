import type { Buffer } from 'node:buffer';
import { Logger } from '../../logger/index.js';

export class BufferReader {
	private static logger = Logger.getInstance().createChildren('BufferReader');

	public buffer: Buffer;

	public offset: number;

	/**
	 * Creates a new BufferReader instance.
	 *
	 * - **This reader expects a buffer using little-endian byte order.**
	 *
	 * @param buffer - The buffer to read from
	 */
	public constructor(buffer: Buffer) {
		this.buffer = buffer;
		this.offset = 0;
	}

	/**
	 * Reads an unsigned 8-bit integer from the buffer and advances the offset by 1.
	 */
	public readUInt8(): number {
		const value = this.buffer.readUInt8(this.offset);
		this.offset += 1;

		BufferReader.logger.debug('Read UInt8:', {
			value,
			binary: value.toString(2).padStart(8, '0'),
			offset: this.offset,
		});

		return value;
	}

	/**
	 * Reads an unsigned 16-bit integer from the buffer and advances the offset by 2.
	 */
	public readUInt16(): number {
		const value = this.buffer.readUInt16LE(this.offset);
		this.offset += 2;

		BufferReader.logger.debug('Read UInt16:', {
			value,
			binary: value.toString(2).padStart(8, '0'),
			offset: this.offset,
		});

		return value;
	}

	/**
	 * Reads an unsigned 32-bit integer from the buffer and advances the offset by 4.
	 */
	public readUInt32(): number {
		const value = this.buffer.readUInt32LE(this.offset);
		this.offset += 4;

		BufferReader.logger.debug('Read UInt32:', {
			value,
			binary: value.toString(2).padStart(8, '0'),
			offset: this.offset,
		});

		return value;
	}

	/**
	 * Reads an unsigned 64-bit integer from the buffer and advances the offset by 8.
	 */
	public readUInt64(): bigint {
		const value = this.buffer.readBigUInt64LE(this.offset);
		this.offset += 4;

		BufferReader.logger.debug('Read UInt64:', {
			value,
			binary: value.toString(2).padStart(8, '0'),
			offset: this.offset,
		});

		return value;
	}

	/**
	 * Reads a signed 8-bit integer from the buffer and advances the offset by 1.
	 */
	public readInt8(): number {
		const value = this.buffer.readInt8(this.offset);
		this.offset += 1;

		BufferReader.logger.debug('Read Int8:', {
			value,
			binary: value.toString(2).padStart(8, '0'),
			offset: this.offset,
		});

		return value;
	}

	/**
	 * Reads a signed 16-bit integer from the buffer and advances the offset by 2.
	 */
	public readInt16(): number {
		const value = this.buffer.readInt16LE(this.offset);
		this.offset += 2;

		BufferReader.logger.debug('Read Int16:', {
			value,
			binary: value.toString(2).padStart(8, '0'),
			offset: this.offset,
		});
		return value;
	}

	/**
	 * Reads a signed 32-bit integer from the buffer and advances the offset by 4.
	 */
	public readInt32(): number {
		const value = this.buffer.readInt32LE(this.offset);
		this.offset += 4;

		BufferReader.logger.debug('Read Int32:', {
			value,
			binary: value.toString(2).padStart(8, '0'),
			offset: this.offset,
		});
		return value;
	}

	/**
	 * Reads a signed 64-bit integer from the buffer and advances the offset by 8.
	 */
	public readInt64(): bigint {
		const value = this.buffer.readBigInt64LE(this.offset);
		this.offset += 8;

		BufferReader.logger.debug('Read Int64:', {
			value,
			binary: value.toString(2).padStart(8, '0'),
			offset: this.offset,
		});
		return value;
	}

	/**
	 * Reads a 32-bit floating point number from the buffer and advances the offset by 4.
	 */
	public readFloat32(): number {
		const value = this.buffer.readFloatLE(this.offset);
		this.offset += 4;

		BufferReader.logger.debug('Read Float32:', {
			value,
			binary: value.toString(2).padStart(8, '0'),
			offset: this.offset,
		});
		return value;
	}

	/**
	 * Reads a 64-bit floating point number from the buffer and advances the offset by 8.
	 */
	public readFloat64(): number {
		const value = this.buffer.readDoubleLE(this.offset);
		this.offset += 8;

		BufferReader.logger.debug('Read Float64:', {
			value,
			binary: value.toString(2).padStart(8, '0'),
			offset: this.offset,
		});
		return value;
	}

	/**
	 * Reads an UUID from the buffer and advances the offset by 16.
	 */
	public readUUID(): string {
		const value = this.buffer.toString('hex', this.offset, this.offset + 16);
		this.offset += 16;

		if (value.length !== 32) {
			throw new RangeError('UUID length is not 32');
		}

		BufferReader.logger.debug('Read UUID:', {
			value,
			offset: this.offset,
		});

		return (
			value.slice(0, 8) +
			'-' +
			value.slice(8, 12) +
			'-' +
			value.slice(12, 16) +
			'-' +
			value.slice(16, 20) +
			'-' +
			value.slice(20)
		);
	}

	/**
	 * Reads a BitField from the buffer and advances the offset by the length of the BitField plus all the bytes used to store the bits.
	 */
	public readBitField(): boolean[] {
		const length = this.readUInt8();

		const bits: boolean[] = Array.from({ length: length * 8 });

		for (let index = 0; index < length; index += 8) {
			const byte = this.readUInt8();
			for (let bitOffset = 0; bitOffset < 8; bitOffset++) {
				bits[index + bitOffset] = (byte & (1 << bitOffset)) !== 0;
			}
		}

		this.offset += length;

		BufferReader.logger.debug('Read BitField:', {
			bits,
			bitsBinary: bits.map((bit) => (bit ? '1' : '0')).join(''),
			length,
			lengthBinary: length.toString(2).padStart(8, '0'),
			offset: this.offset,
		});

		return bits;
	}

	/**
	 * Reads a string from the buffer and advances the offset by the length of the string plus the 2 bytes used to store the length.
	 */
	public readString(): string {
		const length = this.readUInt16();

		const value = this.buffer.toString(
			'utf8',
			this.offset,
			this.offset + length,
		);
		this.offset += length;

		BufferReader.logger.debug('Read String:', {
			value,
			length,
			lengthBinary: length.toString(2).padStart(8, '0'),
			offset: this.offset,
		});
		return value;
	}

	/**
	 * Sets the offset of the BufferReader.
	 */
	public setOffset(offset: number): void {
		if (offset < 0 || offset > this.buffer.length) {
			throw new RangeError('Offset out of bounds');
		}

		this.offset = offset;
	}

	/**
	 * Reads a boolean from the buffer and advances the offset by 1.
	 */
	public readBoolean(): boolean {
		return this.buffer.readUInt8(this.offset++) === 1;
	}

	/**
	 * Returns whether the buffer has been fully read.
	 */
	public isBufferCompleted(): boolean {
		return this.offset === this.buffer.length;
	}

	/**
	 * Creates a clone of the BufferReader, maintaining the same buffer and or not the same offset.
	 *
	 * @param copyOffset - Whether to copy the offset from the original BufferReader
	 */
	public clone(copyOffset = false): BufferReader {
		const clone = new BufferReader(this.buffer);

		if (copyOffset) {
			clone.setOffset(this.offset);
		}

		return clone;
	}
}
