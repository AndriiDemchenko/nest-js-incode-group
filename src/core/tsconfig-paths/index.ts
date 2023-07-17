import * as fs from 'fs'
import * as path from 'path'
import { register } from 'tsconfig-paths'

const tsconfigPath = 'tsconfig.json'
const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf-8')
const tsconfig = JSON.parse(tsconfigContent)

// Register module aliases for .js files
register({
	baseUrl: path.join(__dirname, '..'),
	paths: tsconfig.compilerOptions.paths,
})
