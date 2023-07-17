import { User } from '@api/users/user.entity'
import { UsersService } from '@api/users/users.service'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

describe('AuthController', () => {
	let controller: AuthController

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
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

		controller = module.get<AuthController>(AuthController)
	})

	it('should be defined', () => {
		expect(controller).toBeDefined()
	})
})
