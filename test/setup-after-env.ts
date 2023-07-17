import '../src/core/dotenv'
import { Server } from './server'
import './index.d.ts'

beforeEach(async () => {
	// ;(global as any).app = await Server.init()
	global.app = await Server.init()
})

afterEach(async () => {
	await app.close()
})
