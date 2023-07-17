import { User } from '@api/users/user.entity'
import { FastifyRequest } from 'fastify'

export type JwtCreatePayload = Omit<User, 'password'>

export interface JwtPayload extends JwtCreatePayload {
	iat: number
	exp: number
}

export interface AuthorizedRequest extends FastifyRequest {
	user: JwtPayload
}

export type PublicRequest = FastifyRequest
