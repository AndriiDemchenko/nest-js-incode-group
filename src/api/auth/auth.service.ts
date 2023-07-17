// libs
import * as _ from 'lodash'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import {
	Injectable,
	BadRequestException,
	UnauthorizedException,
} from '@nestjs/common'

// DTO
import { LoginReqDto, RegisterReqDto } from '@api/auth/dto'

// interfaces
import { JwtPayload, JwtCreatePayload } from '@api/auth/auth.interface'

// services
import { UsersService } from '@api/users/users.service'

// config
import { BcryptConfig } from '@config/api/auth.config'
import { UserRole } from '@api/users/constants'
import { User } from '@api/users/user.entity'

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async renewToken(payload: JwtPayload) {
		const user = await this.usersService.findOneById(payload.id)
		return this.signJwt(user)
	}

	async login({ username, password }: LoginReqDto) {
		const user = await this.usersService.findOneByUsername(username)

		if (!user) {
			throw new UnauthorizedException({
				message: 'username or password is incorrect',
			})
		}

		const isPassMatch = await bcrypt.compare(password, user.password)
		if (!isPassMatch) {
			throw new UnauthorizedException({
				message: 'username or password is incorrect',
			})
		}

		const payload: JwtCreatePayload = _.omit(user, ['password'])
		const jwt = await this.signJwt(payload)
		return { jwt, user }
	}

	async register(registerUserDto: RegisterReqDto): Promise<User> {
		const { username, password, role } = registerUserDto

		const existedUser = await this.usersService.findOneByUsername(username)
		if (existedUser) {
			throw new BadRequestException({
				message: 'User with provided username already exists',
			})
		}

		const salt = await bcrypt.genSalt(BcryptConfig.saltRounds)
		const hashedPassword = await bcrypt.hash(password, salt)

		registerUserDto.password = hashedPassword

		switch (role) {
			case UserRole.Admin: {
				return this.registerAdministrator(registerUserDto)
			}
			case UserRole.Boss: {
				return this.registerBoss(registerUserDto)
			}
			case UserRole.Subordinate: {
				return this.registerSubordinate(registerUserDto)
			}
			default: {
				throw new Error('Role is not supported')
			}
		}
	}

	async registerAdministrator(registerUserDto: RegisterReqDto): Promise<User> {
		const { username, password, role } = registerUserDto

		return this.usersService.create({
			username,
			password,
			role,
		})
	}

	async registerBoss(registerUserDto: RegisterReqDto): Promise<User> {
		const { username, password, role, bossId, subordinateId } = registerUserDto

		const boss = await this.usersService.getBossById(bossId)
		const subordinate = await this.usersService.getSubordinateById(
			subordinateId,
		)

		if (subordinate.boss) {
			throw new BadRequestException({
				message: 'Subordinate already has a boss',
			})
		}

		return this.usersService.create({
			username,
			password,
			role,
			boss,
			subordinates: [subordinate],
		})
	}

	async registerSubordinate(registerUserDto: RegisterReqDto): Promise<User> {
		const { username, password, role, bossId } = registerUserDto

		const boss = await this.usersService.findOneById(bossId)
		if (!boss) {
			throw new BadRequestException({
				message: 'Boss with provided ID is not exists',
			})
		}

		return this.usersService.create({
			username,
			password,
			role,
			boss,
		})
	}

	private async signJwt(payload: JwtCreatePayload): Promise<string> {
		return this.jwtService.signAsync(payload)
	}
}
