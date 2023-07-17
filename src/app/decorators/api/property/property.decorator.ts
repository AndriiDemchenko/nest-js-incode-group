// libs
import { Column, ColumnOptions, PrimaryGeneratedColumn } from 'typeorm'
import { Exclude } from 'class-transformer'
import {
	IsPositive,
	IsString,
	Matches,
	Max,
	MinLength,
	IsNotEmpty,
	IsEmail,
	IsEnum,
} from 'class-validator'
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger'

// utils
import { propertyToApi, propertyToColumn } from './property.utils'

// interfaces
import {
	IntegerPropertyOptions,
	PropertyOptions,
	StringPropertyOptions,
} from './property.interface'
import { ColumnType } from '@app/databases/postgres/constants'

// HACK: This decorators need to fix enum extending
export function IdProperty(
	options: ApiPropertyOptions = {},
): PropertyDecorator {
	Object.assign(options, { type: ColumnType.Integer })

	return function (target: any, propertyKey: string | symbol) {
		PrimaryGeneratedColumn()(target, propertyKey)
		ApiProperty()(target, propertyKey)
	}
}

/**
 * Applies next decorators:
 *
 * @Column typeorm
 * @ApiProperty nestjs/swagger
 */
export function Property(options: PropertyOptions = {}): PropertyDecorator {
	return function (target: any, propertyKey: string | symbol) {
		const columnOptions: ColumnOptions = propertyToColumn(options)
		const apiPropertyOptions: ApiPropertyOptions = propertyToApi(options)

		Column(columnOptions)(target, propertyKey)
		ApiProperty(apiPropertyOptions)(target, propertyKey)
	}
}

export function RefProperty(options: PropertyOptions = {}): PropertyDecorator {
	return function (target: any, propertyKey: string | symbol) {
		const apiPropertyOptions: ApiPropertyOptions = propertyToApi(options)
		ApiProperty(apiPropertyOptions)(target, propertyKey)
	}
}

/**
 * Applies next decorators:
 *
 * @Column typeorm
 * @IsString class-validator
 * @IsNotEmpty class-validator (if not specified other validations)
 */
export function StringProperty(
	options: StringPropertyOptions = {},
): PropertyDecorator {
	return function (target: any, propertyKey: string | symbol) {
		IsString()(target, propertyKey)

		if (!options.minLength && !options.matches) {
			IsNotEmpty()
		}

		if (options.minLength) {
			MinLength(options.minLength)(target, propertyKey)
		}

		if (options.matches) {
			Matches(options.matches)(target, propertyKey)
		}

		if (options.enum) {
			IsEnum(options.enum)(target, propertyKey)
		}

		Property(options)(target, propertyKey)
	}
}

/**
 * Applies next decorators:
 *
 * @Property custom
 * @IsEmail class-validator
 */
export function EmailProperty(
	options: StringPropertyOptions = {},
): PropertyDecorator {
	return function (target: any, propertyKey: string | symbol) {
		IsEmail()(target, propertyKey)
		Property(options)(target, propertyKey)
	}
}

export function IntegerProperty(
	options: IntegerPropertyOptions = {},
): PropertyDecorator {
	return function (target: any, propertyKey: string | symbol) {
		options.type = ColumnType.Integer

		if (options.isPositive) {
			IsPositive()(target, propertyKey)
			delete options.isPositive
		}

		if (options.max) {
			Max(options.max)(target, propertyKey)
		}

		Property(options)(target, propertyKey)
	}
}

export function PositiveIntegerProperty(
	options: IntegerPropertyOptions = {},
): PropertyDecorator {
	return IntegerProperty({ ...options, isPositive: true })
}

export function Hidden(): PropertyDecorator {
	return function (target: any, propertyKey: string | symbol) {
		Exclude({ toPlainOnly: true })(target, propertyKey)
		ApiProperty({ writeOnly: true })(target, propertyKey)
	}
}
