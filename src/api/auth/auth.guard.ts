// libs
import {
	CanActivate,
	ExecutionContext,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtService } from '@nestjs/jwt'
import { FastifyRequest } from 'fastify'

// interfaces
import { AuthorizedRequest, JwtPayload } from '@api/auth/auth.interface'

// decorators
import { PublicEndpointKey } from '@api/auth/decorators'

// config
import { JwtSecret } from '@config/api/jwt.config'
import { UsersService } from '@api/users/users.service'
import { UserStatus } from '@api/users/constants'
import { throwUnauthorizedException } from '@app/exceptions'

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private jwtService: JwtService,
		private reflector: Reflector,
		private usersService: UsersService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const isPublic = this.reflector.getAllAndOverride<boolean>(
			PublicEndpointKey,
			[context.getHandler(), context.getClass()],
		)

		if (isPublic) {
			return true
		}

		const request: AuthorizedRequest = context.switchToHttp().getRequest()
		const token = this.extractTokenFromHeader(request)
		if (!token) {
			throw new UnauthorizedException()
		}

		const payload: JwtPayload = await this.jwtService
			.verifyAsync(token, {
				secret: JwtSecret,
			})
			.catch(() => throwUnauthorizedException())

		const user = await this.usersService.findOneById(payload.id)

		if (user.status !== UserStatus.Active) {
			throwUnauthorizedException({ message: 'You have been banned' })
		}

		// We're assigning the payload to the request object here
		// so that we can access it in our route handlers
		request.user = payload

		return true
	}

	private extractTokenFromHeader(request: FastifyRequest): string | undefined {
		const [type, token] = request.headers.authorization?.split(' ') ?? []
		return type === 'Bearer' ? token : undefined
	}
}
