// libs
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'

// core
import { APP_GUARD } from '@nestjs/core'

// guards
import { AuthGuard } from '@api/auth/auth.guard'

// controllers
import { AuthController } from '@api/auth/auth.controller'

// services
import { AuthService } from '@api/auth/auth.service'

// modules
import { UsersModule } from '@api/users/users.module'

// config
import { JwtSecret, JwtOptions } from '@config/api/jwt.config'

@Module({
	imports: [
		UsersModule,
		JwtModule.register({
			global: true,
			secret: JwtSecret,
			signOptions: JwtOptions,
		}),
	],
	providers: [AuthService, { provide: APP_GUARD, useClass: AuthGuard }],
	controllers: [AuthController],
	exports: [AuthService],
})
export class AuthModule {}
