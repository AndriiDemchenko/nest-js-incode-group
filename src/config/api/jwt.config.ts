import { env } from '@config/utils'

export const JwtSecret = env('JWT_SECRET')
export const JwtOptions = { expiresIn: '30d' }
