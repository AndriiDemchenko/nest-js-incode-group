import * as fs from 'fs'
import * as path from 'path'

function getRootDir() {
	const relativePath = path.relative(__dirname, '')

	if (relativePath) {
		return `<rootDir>/${relativePath}`
	}

	return '<rootDir>'
}

function getModuleNameMapper() {
	const rootDir = getRootDir()
	const tsconfigBuffer = fs.readFileSync('tsconfig.json')
	const tsconfig = JSON.parse(tsconfigBuffer.toString())
	const paths = tsconfig.compilerOptions.paths
	const moduleNameMapper = {}

	for (const [key, value] of Object.entries(paths)) {
		const isStaticAlias = key.indexOf('*') === -1
		if (isStaticAlias) {
			// '@logger' -> '^@logger$'
			const newKey = `^${key}$`
			// ['src/app/logger/index'] -> '<rootDir>/../src/logger/index'
			const newValue = `${rootDir}/${value}`

			moduleNameMapper[newKey] = newValue
			continue
		}

		// '@config/*' -> '^@config/(.*)$'
		const newKey = `^${key.replace('*', '(.*)$')}`
		// ['src/config/*'] -> '<rootDir>/../src/config/$1'
		const newValue = `${rootDir}/${value[0].replace('*', '$1')}`

		moduleNameMapper[newKey] = newValue
	}

	return moduleNameMapper
}

export default {
	setupFilesAfterEnv: ['jest-extended/all', './setup-after-env.ts'],
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: '.',
	testEnvironment: 'node',
	testRegex: '.e2e-spec.ts$',
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	transformIgnorePatterns: ['/node_modules/', '/dist/', '/.npm/'],
	moduleNameMapper: getModuleNameMapper(),
}
