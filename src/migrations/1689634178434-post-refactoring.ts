import { MigrationInterface, QueryRunner } from 'typeorm'

export class PostRefactoring1689634178434 implements MigrationInterface {
	name = 'PostRefactoring1689634178434'

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "role" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'active', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "bossId" integer, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
		)
		await queryRunner.query(
			`CREATE UNIQUE INDEX "IDX_78a916df40e02a9deb1c4b75ed" ON "user" ("username") `,
		)
		await queryRunner.query(
			`ALTER TABLE "user" ADD CONSTRAINT "FK_f92b3d839b53b5c4ff75bec5945" FOREIGN KEY ("bossId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
		)
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "user" DROP CONSTRAINT "FK_f92b3d839b53b5c4ff75bec5945"`,
		)
		await queryRunner.query(
			`DROP INDEX "public"."IDX_78a916df40e02a9deb1c4b75ed"`,
		)
		await queryRunner.query(`DROP TABLE "user"`)
	}
}
