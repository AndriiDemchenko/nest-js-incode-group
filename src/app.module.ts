// libs
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'

// databases
import { PostgreSqlDatabaseModule } from './app/databases'

// middlewares
import { LoggerMiddleware } from './app/middlewares'

// guards
import { RateLimitModule } from './app/guards'

// api
import { AuthModule } from '@api/auth/auth.module'
import { UsersModule } from '@api/users/users.module'

@Module({
	imports: [
		// Databases
		PostgreSqlDatabaseModule,

		// Guards
		RateLimitModule,

		// API
		AuthModule,
		UsersModule,
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(LoggerMiddleware).forRoutes('*')
	}
}
