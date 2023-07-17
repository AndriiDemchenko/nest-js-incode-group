// libs
import helmet from '@fastify/helmet'
import { ValidationPipe } from '@nestjs/common'

// config
import { CorsOptions, ValidationPipeOptions } from '@config/middlewares'
import { NestFastifyApplication } from '@nestjs/platform-fastify'
import { RegisterSwagger } from '@app/swagger'

/**
 * Used to setup backend server and e2e testing
 */
export const SetupServer = async (app: NestFastifyApplication) => {
	// api prefix
	app.setGlobalPrefix('api/v1')

	// middlewares
	await app.register(helmet)
	app.enableCors(CorsOptions)
	app.useGlobalPipes(new ValidationPipe(ValidationPipeOptions))

	// Documentation
	RegisterSwagger(app)
}
