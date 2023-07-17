import { env } from '@config/utils'

export default {
	origin: env.array('CORS_ALLOWED_ORIGINS'),
	methods: env.array('CORS_ALLOWED_METHODS'),
}
