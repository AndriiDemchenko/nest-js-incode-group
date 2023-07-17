// libs
import { Controller as NestController } from '@nestjs/common'
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger'
import { PublicEndpointKey } from '@api/auth/decorators'

/**
 * Applies next decorators:
 *
 * @Controller nestjs/common (to class)
 * @ApiTags nestjs/swagger (to class)
 * @ApiBearerAuth nestjs/swagger (to class methods)
 */
export function ApiController(name: string): ClassDecorator {
	return (target: any) => {
		// Apply auth to every non public method
		for (const key of Reflect.ownKeys(target.prototype)) {
			const method = target.prototype[key]

			const isMethod = typeof method === 'function'
			if (!isMethod) continue

			const isConstructor = target.prototype[key] === target
			if (isConstructor) continue

			const descriptor = Object.getOwnPropertyDescriptor(target.prototype, key)

			const isPublic = Reflect.getMetadata(PublicEndpointKey, descriptor.value)
			if (isPublic) continue

			ApiBearerAuth()(descriptor.value)
		}

		ApiTags(name)(target)
		NestController(name)(target)

		return target
	}
}
