import { ForbiddenException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserRole } from './constants'
import { ChangeBossDto } from './dto'
import { User } from './user.entity'
import { UsersService } from './users.service'

describe('UsersService', () => {
	let userService: UsersService
	let userRepository: Repository<User>

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UsersService,
				{
					provide: getRepositoryToken(User),
					useClass: Repository,
				},
			],
		}).compile()

		userService = module.get<UsersService>(UsersService)
		userRepository = module.get<Repository<User>>(getRepositoryToken(User))
	})

	it('should be defined', () => {
		expect(userService).toBeDefined()
	})

	describe('findAllBasedOnRole', () => {
		it('should return all users for the admin role', async () => {
			const adminUser: any = {
				id: 1,
				role: UserRole.Admin,
			}

			const expectedUsers: Partial<User>[] = [
				{ id: 99, username: 'admin', role: UserRole.Admin },
			]

			jest
				.spyOn(userRepository, 'find')
				.mockResolvedValue(expectedUsers as User[])

			const result = await userService.findAllBasedOnRole(adminUser)

			expect(result).toEqual(expectedUsers)
			expect(userRepository.find).toHaveBeenCalledWith({
				where: {},
				order: { id: -1 },
				relations: { boss: false, subordinates: true },
			})
		})

		it('should return the boss and their subordinates for the boss role', async () => {
			const bossUser: any = {
				id: 2,
				role: UserRole.Boss,
			}

			const expectedUsers: Partial<User>[] = [
				{ id: 99, username: 'boss', role: UserRole.Boss },
			]

			jest
				.spyOn(userRepository, 'find')
				.mockResolvedValue(expectedUsers as User[])

			const result = await userService.findAllBasedOnRole(bossUser)

			expect(result).toEqual(expectedUsers)
			expect(userRepository.find).toHaveBeenCalledWith({
				where: [{ id: bossUser.id }, { boss: { id: bossUser.id } }],
				order: { id: -1 },
				relations: { boss: false, subordinates: true },
			})
		})

		it('should return the subordinate for the subordinate role', async () => {
			const subordinateUser: any = {
				id: 3,
				role: UserRole.Subordinate,
			}

			const expectedUsers: Partial<User>[] = [
				{ id: 99, username: 'boss', role: UserRole.Subordinate },
			]

			jest
				.spyOn(userRepository, 'find')
				.mockResolvedValue(expectedUsers as User[])

			const result = await userService.findAllBasedOnRole(subordinateUser)

			expect(result).toEqual(expectedUsers)
			expect(userRepository.find).toHaveBeenCalledWith({
				where: { id: subordinateUser.id },
				order: { id: -1 },
				relations: { boss: false, subordinates: true },
			})
		})

		it('should throw an error for an unsupported role', async () => {
			const unsupportedUser: any = {
				id: 4,
				role: 'UnsupportedRole',
			}

			jest.spyOn(userRepository, 'find')

			await expect(async () => {
				await userService.findAllBasedOnRole(unsupportedUser)
			}).rejects.toThrow('Role is not supported')
			expect(userRepository.find).not.toHaveBeenCalled()
		})
	})

	describe('changeBoss', () => {
		it('should change the boss of a subordinate successfully', async () => {
			const user: any = {
				id: 1,
				subordinates: [],
				role: UserRole.Boss,
			}

			const changeBossDto: ChangeBossDto = {
				newBossId: 2,
				subordinateId: 3,
			}

			const newBoss: Partial<User> = { id: 2 }
			const subordinate: Partial<User> = {
				id: 3,
				boss: user,
			}

			jest.spyOn(userService, 'getBossById').mockResolvedValue(newBoss as User)
			jest
				.spyOn(userService, 'getSubordinateById')
				.mockResolvedValue(subordinate as User)
			jest.spyOn(userRepository, 'save').mockResolvedValue(null)

			await expect(
				userService.changeBoss(user, changeBossDto),
			).resolves.toBeUndefined()
			expect(userService.getBossById).toHaveBeenCalledWith(
				changeBossDto.newBossId,
			)
			expect(userService.getSubordinateById).toHaveBeenCalledWith(
				changeBossDto.subordinateId,
			)
			expect(userRepository.save).toHaveBeenCalledWith(subordinate)
		})

		it('should throw a ForbiddenException if the boss does not own the subordinate', async () => {
			const user: any = {
				id: 1,
				subordinates: [],
				role: UserRole.Boss,
			}

			const changeBossDto: ChangeBossDto = {
				newBossId: 2,
				subordinateId: 3,
			}

			const subordinate: Partial<User> = {
				id: 3,
				boss: { id: 4 } as User,
			}

			jest.spyOn(userService, 'getBossById').mockResolvedValue(null)
			jest
				.spyOn(userService, 'getSubordinateById')
				.mockResolvedValue(subordinate as User)

			await expect(
				userService.changeBoss(user, changeBossDto),
			).rejects.toThrowError(ForbiddenException)
			expect(userService.getBossById).toHaveBeenCalledWith(
				changeBossDto.newBossId,
			)
			expect(userService.getSubordinateById).toHaveBeenCalledWith(
				changeBossDto.subordinateId,
			)
		})

		it('should throw a ForbiddenException if the boss tries to remove the last subordinate', async () => {
			const user: any = {
				id: 1,
				subordinates: [4],
				role: UserRole.Boss,
			}

			const changeBossDto: ChangeBossDto = {
				newBossId: 2,
				subordinateId: 3,
			}

			const subordinate: Partial<User> = {
				id: 3,
				boss: user,
			}

			jest.spyOn(userService, 'getBossById').mockResolvedValue(null)
			jest
				.spyOn(userService, 'getSubordinateById')
				.mockResolvedValue(subordinate as User)

			await expect(
				userService.changeBoss(user, changeBossDto),
			).rejects.toThrowError(ForbiddenException)
			expect(userService.getBossById).toHaveBeenCalledWith(
				changeBossDto.newBossId,
			)
			expect(userService.getSubordinateById).toHaveBeenCalledWith(
				changeBossDto.subordinateId,
			)
		})
	})
})
