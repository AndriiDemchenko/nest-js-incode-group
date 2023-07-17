// TEMPLATE_NOTE: All TEMPLATE_NOTEs will be removed
import { MigrationInterface, QueryRunner } from 'typeorm'

// TEMPLATE_NOTE: $Name will be replaced
export class $Name implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`SELECT * FROM public.USERS`)
	}

	// eslint-disable-next-line @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars
	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`SELECT * FROM public.USERS`)
	}
}
