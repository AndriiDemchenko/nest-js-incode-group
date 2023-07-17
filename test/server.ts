import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { SetupServer } from '../src/setup'

export const Server = {
	async init() {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile()

		const app = moduleFixture.createNestApplication<NestFastifyApplication>(
			new FastifyAdapter(),
		)

		await SetupServer(app)
		await app.init()
		await app.getHttpAdapter().getInstance().ready()

		return app
	},
}
