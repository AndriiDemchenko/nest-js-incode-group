import * as fs from 'fs'
import { pathsToModuleNameMapper, JestConfigWithTsJest } from 'ts-jest'

const data = fs.readFileSync('tsconfig.json', 'utf-8')
const { compilerOptions } = JSON.parse(data)

const jestConfig: JestConfigWithTsJest = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	preset: 'ts-jest',
	setupFiles: ['./core/dotenv/index.ts'],
	moduleDirectories: ['node_modules', '<rootDir>/../'],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths),
}

export default jestConfig
