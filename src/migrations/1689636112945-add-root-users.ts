import * as bcrypt from 'bcrypt'
import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddRootUsers1689636112945 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const salt = await bcrypt.genSalt(12)
		const admin = await bcrypt.hash('administrator', salt)
		const rootBoss1 = await bcrypt.hash('rootBoss1', salt)
		const rootBoss2 = await bcrypt.hash('rootBoss2', salt)

		await queryRunner.query(`
			-- Insert the admin user
			INSERT INTO public.user(
				username,
				password,
				role
			)
			VALUES ('admin', '${admin}', 'administrator');

			-- Insert the boss users
			INSERT INTO public.user(
				username,
				password,
				role
			)
			VALUES 	('rootBoss1', '${rootBoss1}', 'boss'),
							('rootBoss2', '${rootBoss2}', 'boss');

			-- Link bosses to bosses
			UPDATE public.user SET "bossId" = 2 WHERE id = 3;
			UPDATE public.user SET "bossId" = 3 WHERE id = 2;
		`)
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	public async down(queryRunner: QueryRunner): Promise<void> {}
}
