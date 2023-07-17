import * as request from 'supertest'
import * as bcrypt from 'bcrypt'
import { UsersService } from '@api/users/users.service'
import { BcryptConfig } from '@config/api/auth.config'
import { LoginResDto, RenewTokenResDto } from '@api/auth/dto'

describe('App (e2e)', () => {
	let loginJwt: string
	let renewedJwt: string

	it('Should login', async () => {
		const usersService = app.get<UsersService>(UsersService)

		// Setup
		const userPayload = { username: 'username', password: 'password' }
		const salt = await bcrypt.genSalt(BcryptConfig.saltRounds)
		const hashedPassword = await bcrypt.hash(userPayload.password, salt)

		await usersService.create({
			...userPayload,
			password: hashedPassword,
		})

		// Testing
		return await request(app.getHttpServer())
			.post('/api/v1/auth/login')
			.send(userPayload)
			.expect(200)
			.expect(response => {
				expect(response.body).toEqual<LoginResDto>({
					jwt: expect.toBeString(),
					user: {
						id: expect.toBeNumber(),
						username: userPayload.username,
						password: expect.toBeNil(),
						status: 'active',
						email: null,
						profileMedia: null,
						createdAt: expect.toBeDateString(),
						updatedAt: expect.toBeDateString(),
					},
				})
				loginJwt = response.body.jwt
			})
	})

	it('Should renew token after login', async () => {
		return await request(app.getHttpServer())
			.post('/api/v1/auth/renew-token')
			.auth(loginJwt, { type: 'bearer' })
			.expect(200)
			.expect(response => {
				expect(response.body).toEqual<RenewTokenResDto>({
					jwt: expect.toBeString(),
				})
				renewedJwt = response.body.jwt
			})
	})

	it('Should renew token after renew', async () => {
		return await request(app.getHttpServer())
			.post('/api/v1/auth/renew-token')
			.auth(renewedJwt, { type: 'bearer' })
			.expect(200)
			.expect(response => {
				expect(response.body).toEqual<RenewTokenResDto>({
					jwt: expect.toBeString(),
				})
			})
	})
})
