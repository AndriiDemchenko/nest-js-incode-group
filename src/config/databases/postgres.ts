import { env } from '../utils'
import { IsCiStage } from '../runtime/runtime'

export const PostgreSqlConfig = {
	Host: env('DB_HOST'),
	Port: env.number('DB_PORT'),
	Username: env('DB_USERNAME'),
	Password: env('DB_PASSWORD'),
	Database: env('DB_NAME'),
}

const SrcEntitiesGlob = 'src/api/**/*.entity.ts'
const DistEntitiesGlob = 'dist/api/**/*.entity.js'
const EntitiesGlob = IsCiStage ? SrcEntitiesGlob : DistEntitiesGlob

export const MigrationConfig = {
	MigrationsDir: 'src/migrations',
	MigrationsDistGlob: 'dist/migrations/*.js',
	MigrationsTableName: 'migrations',
	EntitiesGlob,
}
