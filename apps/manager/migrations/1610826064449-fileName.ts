import { MigrationInterface, QueryRunner } from "typeorm"

export class fileName1610826064449 implements MigrationInterface {
  name = "fileName1610826064449"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" RENAME COLUMN "filename" TO "fileName"`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "image" RENAME COLUMN "fileName" TO "filename"`,
    )
  }
}
