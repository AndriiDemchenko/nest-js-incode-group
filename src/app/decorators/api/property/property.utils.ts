// libs
import { ColumnOptions } from 'typeorm'
import { ApiPropertyOptions } from '@nestjs/swagger'

// interfaces
import { PropertyOptions, PropertyTo } from './property.interface'

const defaultTranslator = (value: any) => value
const propertyToColumnMap: PropertyTo = {}
const propertyToApiMap: PropertyTo = {
	unique: {
		name: 'uniqueItems',
	},
	matches: {
		name: 'format',
		translator: (value: RegExp) => value.toString(),
	},
	max: {
		name: 'maximum',
	},
}

function propertyTo(options: PropertyOptions, map: PropertyTo) {
	const newOptions = {}

	for (const key in options) {
		const value = options[key]
		const mappedValue = map[key]
		if (mappedValue === undefined) {
			newOptions[key] = value
			continue
		}
		// Skip same keys. Work only with diff
		const { name: columnKey, translator = defaultTranslator } = mappedValue
		newOptions[columnKey] = translator(value)
	}

	return newOptions
}

export function propertyToColumn(options: PropertyOptions): ColumnOptions {
	return propertyTo(options, propertyToColumnMap)
}

export function propertyToApi(options: PropertyOptions): ApiPropertyOptions {
	return propertyTo(options, propertyToApiMap)
}
