import { env } from './utils/env'

export default {
	level: env('LOG_LEVEL'),
}
