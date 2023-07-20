// libs
import { Repository } from 'typeorm'
import {
	BadRequestException,
	ForbiddenException,
	Injectable,
} from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

// main
import { User } from './user.entity'
import { ChangeBossDto, CreateUserReqDto, UpdateUserReqDto } from './dto'
import { UserRole } from './constants'
import { JwtPayload } from '@api/auth/auth.interface'

@Injectable()
export class UsersService {
	constructor(
		@InjectRepository(User)
		private readonly usersRepository: Repository<User>,
	) {}

	async create(createUserDto: CreateUserReqDto): Promise<User> {
		return this.usersRepository.save(createUserDto)
	}

	async findAllBasedOnRole(user: JwtPayload): Promise<User[]> {
		const where: any = {}

		switch (user.role) {
			case UserRole.Admin: {
				break
			}
			case UserRole.Boss: {
				return this.usersRepository.query(`
					WITH RECURSIVE subordinates AS (
						SELECT
							id,
							username,
							role,
							status,
							"user"."bossId",
							"user"."createdAt",
							"user"."updatedAt"
						FROM
							public.user
						WHERE
							id = ${user.id}
						UNION
							SELECT
								e.id,
								e.username,
								e.role,
								e.status,
								"e"."bossId",
								"e"."createdAt",
								"e"."updatedAt"
							FROM
								public.user e
							INNER JOIN subordinates s ON s.id = "e"."bossId"
					) SELECT
						*
					FROM
						subordinates;
				`)
			}
			case UserRole.Subordinate: {
				where.id = user.id
				break
			}
			default: {
				throw new Error('Role is not supported')
			}
		}

		return this.usersRepository.find({
			where,
			order: { id: -1 },
		})
	}

	findOneById(id: number): Promise<User | null> {
		return this.usersRepository.findOne({
			where: { id },
			relations: { boss: true, subordinates: true },
		})
	}

	async getBossById(id: number): Promise<User | never> {
		const boss = await this.usersRepository.findOne({
			where: { id, role: UserRole.Boss },
		})

		if (!boss) {
			throw new BadRequestException({
				message: 'Boss with provided ID is not exists',
			})
		}

		return boss
	}

	async getSubordinateById(id: number): Promise<User | never> {
		const subordinate = await this.usersRepository.findOne({
			where: { id, role: UserRole.Subordinate },
			relations: { boss: true },
		})

		if (!subordinate) {
			throw new BadRequestException({
				message: 'Subordinate with provided ID is not exists',
			})
		}

		return subordinate
	}

	findOneByUsername(username: string): Promise<User | null> {
		return this.usersRepository.findOne({
			where: { username },
			relations: { boss: true, subordinates: true },
		})
	}

	async changeBoss(
		user: JwtPayload,
		changeBossDto: ChangeBossDto,
	): Promise<void> {
		const { id: userId, subordinates } = user
		const { newBossId, subordinateId } = changeBossDto

		const newBoss = await this.getBossById(newBossId)
		const subordinate = await this.getSubordinateById(subordinateId)

		if (subordinate.boss.id !== userId) {
			throw new ForbiddenException({
				message: 'Boss can change only own subordinates',
			})
		}

		if (subordinates.length === 1) {
			throw new ForbiddenException({
				message: 'Boss cannot remove last subordinate',
			})
		}

		subordinate.boss = newBoss

		await this.usersRepository.save(subordinate)
	}

	async update(id: number, updateUserDto: UpdateUserReqDto) {
		await this.usersRepository.update(id, updateUserDto)
	}

	async remove(id: number): Promise<void> {
		await this.usersRepository.delete(id)
	}
}
