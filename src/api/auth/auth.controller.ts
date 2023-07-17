// libs
import {
	Req,
	Body,
	Post,
	HttpCode,
	HttpStatus,
	UseInterceptors,
	ClassSerializerInterceptor,
} from '@nestjs/common'

// decorators
import { ApiController } from '@app/decorators'
import { Public } from '@api/auth/decorators'

// services
import { AuthService } from '@api/auth/auth.service'

// entities
import { User } from '@api/users/user.entity'

// DTO
import {
	LoginReqDto,
	LoginResDto,
	RegisterReqDto,
	RegisterResDto,
	RenewTokenResDto,
} from '@api/auth/dto'

// interfaces
import { AuthorizedRequest } from '@api/auth/auth.interface'

@ApiController('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('renew-token')
	@HttpCode(HttpStatus.OK)
	async renewToken(@Req() req: AuthorizedRequest): Promise<RenewTokenResDto> {
		const jwt = await this.authService.renewToken(req.user)
		return { jwt }
	}

	@Public()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	async login(@Body() loginDto: LoginReqDto): Promise<LoginResDto> {
		const { jwt, user } = await this.authService.login(loginDto)

		return {
			jwt,
			user: new User(user),
		}
	}

	@Public()
	@Post('register')
	async register(@Body() registerDto: RegisterReqDto): Promise<RegisterResDto> {
		const user = await this.authService.register(registerDto)
		return new User(user)
	}
}
