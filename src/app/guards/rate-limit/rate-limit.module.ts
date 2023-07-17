// libs
import { APP_GUARD } from '@nestjs/core'
import { Module } from '@nestjs/common'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'

// config
import { RateLimitOptions } from '@config/middlewares'

@Module({
	imports: [ThrottlerModule.forRoot(RateLimitOptions)],
	providers: [
		{
			provide: APP_GUARD,
			useClass: ThrottlerGuard,
		},
	],
})
export class RateLimitModule {}
