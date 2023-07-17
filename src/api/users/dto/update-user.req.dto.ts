import { User } from '@api/users/user.entity'
import { PartialType } from '@nestjs/swagger'

export class UpdateUserReqDto extends PartialType(User) {}
