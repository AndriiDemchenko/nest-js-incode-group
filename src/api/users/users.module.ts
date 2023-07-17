// libs
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

// main
import { User } from './user.entity'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'

@Module({
	imports: [TypeOrmModule.forFeature([User])],
	providers: [UsersService],
	controllers: [UsersController],
	exports: [UsersService],
})
export class UsersModule {}
