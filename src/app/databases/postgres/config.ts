// config
import { PostgreSqlConfig, MigrationConfig } from '@config/databases'
import { IsDevelopment } from '@config/runtime/runtime'

// types
import { TypeOrmTypeEnum } from '../typeorm/types'

// constants
const { Host, Port, Username, Password, Database } = PostgreSqlConfig
const { MigrationsDistGlob, MigrationsTableName, EntitiesGlob } =
	MigrationConfig

export default {
	type: TypeOrmTypeEnum.Postgres,
	host: Host,
	port: Port,
	username: Username,
	password: Password,
	database: Database,
	synchronize: IsDevelopment,
	entities: [EntitiesGlob],
	migrationsTableName: MigrationsTableName,
	migrations: [MigrationsDistGlob],
}
