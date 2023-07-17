import { env } from './utils'

export const Host = env('HOST')
export const Port = env.number('PORT')
