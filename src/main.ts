// setup
import './core/dotenv'
import './core/tsconfig-paths'

// libs
import { NestFactory } from '@nestjs/core'
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify'

// main
import { AppModule } from './app.module'
import Logger from '@logger'

// config
import { Port } from '@config/server'
import { SetupServer } from './setup'

async function bootstrap() {
	const now = Date.now()
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter(),
	)

	await SetupServer(app)

	await app.listen(Port, '0.0.0.0')

	Logger.info(`Application start time is: ${Date.now() - now}ms`)
	Logger.info(`Application is running on: ${await app.getUrl()}`)
}

bootstrap()
