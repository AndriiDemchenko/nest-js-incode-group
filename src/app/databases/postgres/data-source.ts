// NOTE: It will only be called from scripts
import * as dotenv from 'dotenv'

const EnvFile = process.env.ENV_FILE
dotenv.config({ path: `environments/${EnvFile}` })

import { DataSource } from 'typeorm'
import PgConfig from './config'

export default new DataSource(PgConfig)
