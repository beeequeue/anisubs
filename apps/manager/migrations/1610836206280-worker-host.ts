import { MigrationInterface, QueryRunner } from "typeorm"

export class workerHost1610836206280 implements MigrationInterface {
  name = "workerHost1610836206280"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "worker" DROP COLUMN "host"`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "worker" ADD "host" character varying NOT NULL`,
    )
  }
}
