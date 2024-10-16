import { inspect } from 'node:util';
import kleur from 'kleur';
import { ReadableLoggerAdapter } from './ReadableAdaptor.js';

kleur.enabled = true;

inspect.defaultOptions.depth = 10;
inspect.defaultOptions.maxArrayLength = 100;

export interface ILoggerAdapter {
	debug(prefix: string, message: string, ...args: any[]): void;
	error(prefix: string, message: string, ...args: any[]): void;
	info(prefix: string, message: string, ...args: any[]): void;
	success(prefix: string, message: string, ...args: any[]): void;
	warn(prefix: string, message: string, ...args: any[]): void;
}

export enum LoggerLevel {
	None,
	Error,
	Info,
	Debug,
}

class Logger {
	public static LOGGER_LEVEL = LoggerLevel.Debug;

	public static setLevel(level: LoggerLevel) {
		Logger.LOGGER_LEVEL = level;
	}

	public static DEFAULT_ADAPTER: ILoggerAdapter = new ReadableLoggerAdapter();

	public static setDefaultAdapter(adapter: ILoggerAdapter) {
		Logger.DEFAULT_ADAPTER = adapter;
	}

	private static instance: Logger;

	public static getInstance(): Logger {
		return Logger.instance ?? (Logger.instance = new Logger());
	}

	public PREFIX = '';

	private readonly adapter: ILoggerAdapter;

	private constructor(prefix?: string, adapter?: ILoggerAdapter) {
		if (prefix) this.PREFIX = prefix;
		this.adapter = adapter ?? Logger.DEFAULT_ADAPTER;
	}

	public success(message: string, ...args: any[]) {
		this.adapter.success(this.PREFIX, message, ...args);
	}

	public info(message: string, ...args: any[]) {
		this.adapter.info(this.PREFIX, message, ...args);
	}

	public debug(message: string, ...args: any[]) {
		this.adapter.debug(this.PREFIX, message, ...args);
	}

	public warn(message: string, ...args: any[]) {
		this.adapter.warn(this.PREFIX, message, ...args);
	}

	public error(message: string, ...args: any[]) {
		this.adapter.error(this.PREFIX, message, ...args);
	}

	public createChildren(prefix: string) {
		if (!this.PREFIX) return new Logger(prefix);
		return new Logger(`${this.PREFIX}/${prefix}`);
	}
}

export { Logger };
