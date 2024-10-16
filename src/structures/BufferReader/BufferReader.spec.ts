import { Buffer } from 'node:buffer';
import { describe, it, expect } from 'vitest';
import { BufferReader } from './BufferReader.js';

describe('BufferReader', () => {
	it('should initialize buffer and offset correctly', () => {
		const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);
		const reader = new BufferReader(buffer);
		expect(reader.buffer).toBe(buffer);
		expect(reader.offset).toBe(0);
	});

	it('should read UInt8 correctly', () => {
		const buffer = Buffer.from([0x01]);
		const reader = new BufferReader(buffer);
		expect(reader.readUInt8()).toBe(1);
		expect(reader.offset).toBe(1);
	});

	it('should read UInt16 correctly', () => {
		const buffer = Buffer.from([0x01, 0x00]);
		const reader = new BufferReader(buffer);
		expect(reader.readUInt16()).toBe(1);
		expect(reader.offset).toBe(2);
	});

	it('should read UInt32 correctly', () => {
		const buffer = Buffer.from([0x01, 0x00, 0x00, 0x00]);
		const reader = new BufferReader(buffer);
		expect(reader.readUInt32()).toBe(1);
		expect(reader.offset).toBe(4);
	});

	it('should read UInt64 correctly', () => {
		const buffer = Buffer.from([
			0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		]);
		const reader = new BufferReader(buffer);
		expect(reader.readUInt64()).toBe(BigInt(1));
		expect(reader.offset).toBe(4);
	});

	it('should read Int8 correctly', () => {
		const buffer = Buffer.from([0x01]);
		const reader = new BufferReader(buffer);
		expect(reader.readInt8()).toBe(1);
		expect(reader.offset).toBe(1);
	});

	it('should read Int16 correctly', () => {
		const buffer = Buffer.from([0x01, 0x00]);
		const reader = new BufferReader(buffer);
		expect(reader.readInt16()).toBe(1);
		expect(reader.offset).toBe(2);
	});

	it('should read Int32 correctly', () => {
		const buffer = Buffer.from([0x01, 0x00, 0x00, 0x00]);
		const reader = new BufferReader(buffer);
		expect(reader.readInt32()).toBe(1);
		expect(reader.offset).toBe(4);
	});

	it('should read Int64 correctly', () => {
		const buffer = Buffer.from([
			0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
		]);
		const reader = new BufferReader(buffer);
		expect(reader.readInt64()).toBe(BigInt(1));
		expect(reader.offset).toBe(8);
	});

	it('should read Float32 correctly', () => {
		const buffer = Buffer.from(new Float32Array([1]).buffer);
		const reader = new BufferReader(buffer);
		expect(reader.readFloat32()).toBeCloseTo(1);
		expect(reader.offset).toBe(4);
	});

	it('should read Float64 correctly', () => {
		const buffer = Buffer.from(new Float64Array([1]).buffer);
		const reader = new BufferReader(buffer);
		expect(reader.readFloat64()).toBeCloseTo(1);
		expect(reader.offset).toBe(8);
	});

	it('should read UUID correctly', () => {
		const buffer = Buffer.from('1234567890abcdef1234567890abcdef', 'hex');
		const reader = new BufferReader(buffer);
		expect(reader.readUUID()).toBe('12345678-90ab-cdef-1234-567890abcdef');
		expect(reader.offset).toBe(16);
	});

	it('should read BitField correctly', () => {
		const buffer = Buffer.from([1, 0b00100101]);
		const reader = new BufferReader(buffer);
		expect(reader.readBitField()).toEqual([
			true,
			false,
			true,
			false,
			false,
			true,
			false,
			false,
		]);
		expect(reader.offset).toBe(3);
	});

	it('should read String correctly', () => {
		const buffer = Buffer.from([0x05, 0x00, ...Buffer.from('hello')]);
		const reader = new BufferReader(buffer);
		expect(reader.readString()).toBe('hello');
		expect(reader.offset).toBe(7);
	});

	it('should set offset correctly', () => {
		const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);
		const reader = new BufferReader(buffer);
		reader.setOffset(2);
		expect(reader.offset).toBe(2);
		expect(() => reader.setOffset(-1)).toThrow(RangeError);
		expect(() => reader.setOffset(5)).toThrow(RangeError);
	});

	it('should clone correctly', () => {
		const buffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);
		const reader = new BufferReader(buffer);

		reader.setOffset(2);

		const clone = reader.clone();
		expect(clone.buffer).toBe(buffer);
		expect(clone.offset).toBe(0);

		const cloneWithOffset = reader.clone(true);
		expect(cloneWithOffset.buffer).toBe(buffer);
		expect(cloneWithOffset.offset).toBe(2);
	});
});
