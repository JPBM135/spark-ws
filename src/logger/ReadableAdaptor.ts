import kleur from 'kleur';
import type { ILoggerAdapter } from './index.js';
import { Logger, LoggerLevel } from './index.js';

export class ReadableLoggerAdapter implements ILoggerAdapter {
	public success(prefix: string, message: string, ...args: any[]) {
		console.log(
			`${kleur.green((prefix ? `[${prefix}] ` : '') + `[Success]:`)} ${message}`,
			...args,
		);
	}

	public info(prefix: string, message: string, ...args: any[]) {
		if (Logger.LOGGER_LEVEL < LoggerLevel.Info) return;
		console.log(
			`${kleur.blue((prefix ? `[${prefix}] ` : '') + '[Info]:')} ${message}`,
			...args,
		);
	}

	public debug(prefix: string, message: string, ...args: any[]) {
		if (Logger.LOGGER_LEVEL < LoggerLevel.Debug) return;
		console.log(
			`${kleur.gray((prefix ? `[${prefix}] ` : '') + '[Debug]:')} ${message}`,
			...args,
		);
	}

	public warn(prefix: string, message: string, ...args: any[]) {
		console.log(
			`${kleur.yellow((prefix ? `[${prefix}] ` : '') + '[Warn]:')} ${message}`,
			...args,
		);
	}

	public error(prefix: string, message: string, ...args: any[]) {
		console.log(
			`${kleur.red((prefix ? `[${prefix}] ` : '') + '[Error]:')} ${message}`,
			...args,
		);
	}
}
