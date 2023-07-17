import { SetMetadata } from '@nestjs/common'
import { PublicEndpointKey } from './public.constants'

export const Public = () => SetMetadata(PublicEndpointKey, true)
