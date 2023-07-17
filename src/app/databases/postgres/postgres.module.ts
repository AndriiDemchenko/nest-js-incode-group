// libs
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import PgConfig from './config'

@Module({
	imports: [
		TypeOrmModule.forRoot({
			...PgConfig,
			autoLoadEntities: false,
		}),
	],
})
export class PostgreSqlDatabaseModule {}
