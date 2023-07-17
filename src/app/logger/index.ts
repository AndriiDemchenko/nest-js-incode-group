import { createLogger, transports, format } from 'winston'
const { combine, simple, timestamp, printf } = format

import LoggerConfig from '@config/logger'

const myFormat = printf(({ level, message, timestamp }) => {
	return `[${timestamp}] ${level}: ${message}`
})

const logger = createLogger({
	...LoggerConfig,
	transports: [
		new transports.Console({
			format: combine(simple(), timestamp(), myFormat),
		}),
	],
})

export default logger
