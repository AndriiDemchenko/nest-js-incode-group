import { env } from './utils'

export const SwaggerConfig = {
	IsSwaggerEnabled: env.boolean('SWAGGER_ENABLED'),
}
