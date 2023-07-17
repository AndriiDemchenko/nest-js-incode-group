import { ColumnType as TypeOrmColumnType } from 'typeorm'

// https://orkhan.gitbook.io/typeorm/docs/entities#column-types-for-postgres
export const ColumnType: { [key: string]: TypeOrmColumnType } = {
	Float: 'float',
	Integer: 'integer',
}

export enum ColumnTypeEnum {
	Integer = 'integer',
}
