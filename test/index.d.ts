import { NestFastifyApplication } from '@nestjs/platform-fastify'

declare global {
	// eslint-disable-next-line no-var
	var app: NestFastifyApplication
}
