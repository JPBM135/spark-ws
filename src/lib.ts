import ws from 'ws';
import { Logger, LoggerLevel } from './logger/index.js';

interface SparkWsOptions {
	connectionTimeout?: number;
	/**
	 * The logger level to use for the SparkWs instance.
	 */
	loggerLevel?: LoggerLevel;
}

export class SparkWs extends ws.Server {
	private static logger = Logger.getInstance().createChildren('SparkWs');

	public constructor(options: SparkWsOptions) {
		super({ noServer: true });

		Logger.setLevel(options.loggerLevel ?? LoggerLevel.None);
	}
}
