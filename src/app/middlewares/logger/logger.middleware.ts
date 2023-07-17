import { Injectable, NestMiddleware } from '@nestjs/common'
import { FastifyRequest, FastifyReply } from 'fastify'
import Logger from '@logger'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	use(req: FastifyRequest['raw'], res: FastifyReply['raw'], next: () => void) {
		const now = Date.now()

		res.on('close', () => {
			const duration = Date.now() - now
			Logger.debug(`${req.method} ${req.url} (${duration}ms) ${res.statusCode}`)
		})

		next()
	}
}
