import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, Min } from 'class-validator'

export class ChangeBossDto {
	@ApiProperty()
	@IsNumber()
	@Min(0)
	newBossId: number

	@ApiProperty()
	@IsNumber()
	@Min(0)
	subordinateId: number
}
