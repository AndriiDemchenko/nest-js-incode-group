import { User } from '@api/users/user.entity'

export class LoginResDto {
	jwt: string
	user: User
}
