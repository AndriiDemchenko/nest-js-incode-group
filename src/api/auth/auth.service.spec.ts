import { UserRole } from '@api/users/constants'
import { User } from '@api/users/user.entity'
import { UsersService } from '@api/users/users.service'
import { BadRequestException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AuthService } from './auth.service'
import { RegisterReqDto } from './dto'

describe.only('AuthService', () => {
	let authService: AuthService
	let userService: UsersService

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthService,
				UsersService,
				JwtService,
				{
					provide: getRepositoryToken(User),
					useValue: {},
				},
			],
		}).compile()

		authService = module.get<AuthService>(AuthService)
		userService = module.get<UsersService>(UsersService)
	})

	it('should be defined', () => {
		expect(authService).toBeDefined()
	})

	describe('register', () => {
		it('should register a new administrator user successfully', async () => {
			const registerUserDto: RegisterReqDto = {
				username: 'admin',
				password: 'admin123',
				role: UserRole.Admin,
			}

			jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(null)
			jest
				.spyOn(authService, 'registerAdministrator')
				.mockResolvedValue(undefined)

			const result = await authService.register(registerUserDto)

			expect(result).toBeUndefined()
			expect(userService.findOneByUsername).toHaveBeenCalledWith(
				registerUserDto.username,
			)
			expect(authService.registerAdministrator).toHaveBeenCalledWith(
				registerUserDto,
			)
		})

		it('should register a new boss user successfully', async () => {
			const registerUserDto: RegisterReqDto = {
				username: 'boss',
				password: 'boss123',
				role: UserRole.Boss,
				bossId: 1,
				subordinateId: 2,
			}

			jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(null)
			jest.spyOn(userService, 'getBossById').mockResolvedValue(null)
			jest
				.spyOn(userService, 'getSubordinateById')
				.mockResolvedValue({} as User)
			jest.spyOn(userService, 'create').mockResolvedValue(undefined)
			jest.spyOn(authService, 'registerBoss')

			const result = await authService.register(registerUserDto)
			expect(result).toBeUndefined()
			expect(userService.findOneByUsername).toHaveBeenCalledWith(
				registerUserDto.username,
			)
			expect(userService.getBossById).toHaveBeenCalledWith(
				registerUserDto.bossId,
			)
			expect(userService.getSubordinateById).toHaveBeenCalledWith(
				registerUserDto.subordinateId,
			)
			expect(authService.registerBoss).toHaveBeenCalledWith(registerUserDto)
		})

		it('should register a new subordinate user successfully', async () => {
			const registerUserDto: RegisterReqDto = {
				username: 'subordinate',
				password: 'subordinate123',
				role: UserRole.Subordinate,
				bossId: 1,
			}

			jest.spyOn(userService, 'findOneByUsername').mockResolvedValue(null)
			jest.spyOn(userService, 'findOneById').mockResolvedValue({} as User)
			jest.spyOn(userService, 'create').mockResolvedValue(undefined)
			jest.spyOn(authService, 'registerSubordinate')

			const result = await authService.register(registerUserDto)
			await expect(result).toBeUndefined()
			expect(userService.findOneByUsername).toHaveBeenCalledWith(
				registerUserDto.username,
			)
			expect(userService.findOneById).toHaveBeenCalledWith(
				registerUserDto.bossId,
			)
			expect(authService.registerSubordinate).toHaveBeenCalledWith(
				registerUserDto,
			)
		})

		it('should throw a BadRequestException if a user with the provided username already exists', async () => {
			const registerUserDto: RegisterReqDto = {
				username: 'admin',
				password: 'admin123',
				role: UserRole.Admin,
			}

			jest.spyOn(userService, 'findOneByUsername').mockResolvedValue({} as any)

			await expect(async () => {
				await authService.register(registerUserDto)
			}).rejects.toThrowError(BadRequestException)
			expect(userService.findOneByUsername).toHaveBeenCalledWith(
				registerUserDto.username,
			)
		})

		it('should throw an Error if the provided role is not supported', async () => {
			const registerUserDto: RegisterReqDto = {
				username: 'invalid',
				password: 'invalid123',
				role: 'InvalidRole' as UserRole,
			}

			await expect(async () => {
				await authService.register(registerUserDto)
			}).rejects.toThrowError(Error)
		})
	})
})
