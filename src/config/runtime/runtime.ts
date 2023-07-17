import { env } from '../utils'
import { NodeEnvironments, NodeStages } from './constants'

export const NodeEnv = env('NODE_ENV')
export const IsDevelopment = NodeEnv === NodeEnvironments.Development
export const IsProduction = NodeEnv === NodeEnvironments.Production

export const NodeStage = env('NODE_STAGE')
export const IsCiStage = NodeStage === NodeStages.Ci
