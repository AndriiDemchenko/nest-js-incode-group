/* eslint-disable no-console */
// libs
import '../../../../core/dotenv'
import '../../../../core/tsconfig-paths'
import { readFileSync, writeFileSync } from 'fs'

// constants
import { MigrationConfig } from '@config/databases'
const { MigrationsDir } = MigrationConfig
const NumberOfDefaultArguments = 2

// main
const { argv } = process
const numberOfArguments = argv.length - NumberOfDefaultArguments

if (numberOfArguments !== 1) {
	console.error(`Script supports only one argument. Example:
npm run migration:create remove-all-users
`)
	process.exit(1)
}

const fileName: string = argv[2]

createMigration(fileName)

function toCamelCase(str: string, isFirstCapital = false) {
	if (isFirstCapital) {
		str = ' ' + str
	}

	return str.replace(/^([A-Z])|[\s-_](\w)/g, function (match, p1, p2) {
		if (p2) return p2.toUpperCase()
		return p1.toLowerCase()
	})
}

function getTemplate(name: string, timestamp: number) {
	const classPrefix = toCamelCase(name, true)
	const classPostfix = timestamp
	const className = classPrefix + classPostfix

	const template = readFileSync(
		'src/app/databases/postgres/migration/migration-template.ts',
		'utf-8',
	)

	const filledTemplate = template
		// Remove template notes
		.replace(/\/\/ TEMPLATE_NOTE.*\n/g, '')
		// Replace name
		.replace('$Name', className)
	return filledTemplate
}

function createMigration(fileName) {
	const timestamp = Date.now()
	const template = getTemplate(fileName, timestamp)
	const migrationFileName = `${timestamp}-${fileName}.ts`

	writeFileSync(`${MigrationsDir}/${migrationFileName}`, template)
}
