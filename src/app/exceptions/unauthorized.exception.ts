import { HttpExceptionOptions, UnauthorizedException } from '@nestjs/common'
import { ObjectOrError } from './interface.exception'

export function throwUnauthorizedException(
	objectOrError?: ObjectOrError,
	descriptionOrOptions?: string | HttpExceptionOptions,
): UnauthorizedException {
	throw new UnauthorizedException(objectOrError, descriptionOrOptions)
}
