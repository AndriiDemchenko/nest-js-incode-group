// libs
import {
	Entity,
	Index,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	OneToMany,
	ManyToOne,
	Column,
} from 'typeorm'

// decorators
import {
	IdProperty,
	StringProperty,
	Hidden,
	RefProperty,
} from '@app/decorators'

// constants
import {
	UserStatus,
	UserRole,
	UsernameMinLen,
	PasswordMinLen,
} from './constants'

@Entity()
export class User {
	@IdProperty()
	id: number

	@Index({ unique: true })
	@StringProperty({ minLength: UsernameMinLen, matches: /^\w+$/ })
	username: string

	@Hidden()
	@StringProperty({ minLength: PasswordMinLen })
	password: string

	@StringProperty({ enum: UserRole })
	role: UserRole

	@ManyToOne(() => User, user => user.subordinates)
	@JoinColumn()
	@RefProperty({ nullable: true })
	boss?: User

	@Column({ nullable: true })
	bossId?: number

	@OneToMany(() => User, user => user.boss)
	@JoinColumn()
	@RefProperty({ nullable: true })
	subordinates?: User[]

	@StringProperty({ enum: UserStatus, default: UserStatus.Active })
	status: string

	@CreateDateColumn()
	createdAt: Date

	@UpdateDateColumn()
	updatedAt: Date

	constructor(partial: Partial<User>) {
		Object.assign(this, partial)
	}
}
