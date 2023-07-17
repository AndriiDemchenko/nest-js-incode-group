import { ColumnOptions, ColumnType } from 'typeorm'

export interface PropertyOptions {
	type?: ColumnType
	nullable?: boolean
	unique?: boolean
	enum?: ColumnOptions['enum']
	default?: any
}
export interface StringPropertyOptions extends PropertyOptions {
	minLength?: number
	matches?: RegExp
}
export interface IntegerPropertyOptions extends PropertyOptions {
	isPositive?: boolean
	max?: number
}

export type Translator = (value: any) => any
export type PropertyTo = {
	[key: string]: {
		name: string
		translator?: Translator
	}
}
