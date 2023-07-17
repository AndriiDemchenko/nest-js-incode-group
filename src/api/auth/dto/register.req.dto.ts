import { ApiProperty, PickType } from '@nestjs/swagger'
import { User } from '@api/users/user.entity'
import { IsNumber, Min, ValidateIf } from 'class-validator'
import { UserRole } from '@api/users/constants'

export class RegisterReqDto extends PickType(User, [
	'username',
	'password',
	'role',
] as const) {
	@ApiProperty()
	@IsNumber()
	@Min(0)
	@ValidateIf(obj => obj.role !== UserRole.Admin)
	bossId?: number

	@ApiProperty()
	@IsNumber()
	@Min(0)
	@ValidateIf(obj => obj.role === UserRole.Boss)
	subordinateId?: number
}
