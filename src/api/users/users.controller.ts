// libs
import {
	Req,
	Get,
	Post,
	Body,
	HttpCode,
	HttpStatus,
	UseInterceptors,
	ClassSerializerInterceptor,
} from '@nestjs/common'

// decorators
import { ApiController } from '@app/decorators'

// services
import { UsersService } from './users.service'

// entities
import { User } from '@api/users/user.entity'

// DTO
import { ChangeBossDto } from './dto'
import { AuthorizedRequest } from '@api/auth/auth.interface'

@ApiController('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	async findAllBasedOnRole(@Req() req: AuthorizedRequest): Promise<User[]> {
		const { user } = req
		return this.usersService.findAllBasedOnRole(user)
	}

	@Post('change-boss')
	@HttpCode(HttpStatus.OK)
	async changeBoss(
		@Req() req: AuthorizedRequest,
		@Body() changeBossDto: ChangeBossDto,
	): Promise<void> {
		const { user } = req
		return this.usersService.changeBoss(user, changeBossDto)
	}
}
