import { MigrationInterface, QueryRunner } from "typeorm"

export class createTables1609971406422 implements MigrationInterface {
  name = "createTables1609971406422"

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "group" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_8a45300fd825918f3b40195fbd" ON "group" ("name") `,
    )
    await queryRunner.query(
      `CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "timestamp" character varying NOT NULL, "filename" character varying NOT NULL, "entryId" uuid, CONSTRAINT "PK_c755a71673aa21eeea1f254be4b" PRIMARY KEY ("id", "timestamp"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_2d65e0d685e4054217df603bfb" ON "image" ("entryId") `,
    )
    await queryRunner.query(
      `CREATE TABLE "entry" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "hash" character varying NOT NULL, "episode" integer NOT NULL, "source" character varying NOT NULL, "sourceUri" character varying NOT NULL, "fileName" character varying NOT NULL, "accepted" boolean NOT NULL DEFAULT false, "animeId" integer NOT NULL, "groupId" uuid, CONSTRAINT "PK_a58c675c4c129a8e0f63d3676d6" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_ff7987ebb00ed6baaae99d82cc" ON "entry" ("hash") `,
    )
    await queryRunner.query(
      `CREATE TABLE "name" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "animeId" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_aadad26cf6c6baf1a8d446ef8c1" PRIMARY KEY ("id", "name"))`,
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7a3ed7dc473c4edd10b37236db" ON "name" ("name") `,
    )
    await queryRunner.query(
      `CREATE TABLE "worker" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, "host" character varying NOT NULL, "token" character varying NOT NULL, "confirmed" boolean NOT NULL, CONSTRAINT "PK_dc8175fa0e34ce7a39e4ec73b94" PRIMARY KEY ("id"))`,
    )
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_2d65e0d685e4054217df603bfb0" FOREIGN KEY ("entryId") REFERENCES "entry"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
    await queryRunner.query(
      `ALTER TABLE "entry" ADD CONSTRAINT "FK_a4ea205ad2ac48b4c748883149a" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "entry" DROP CONSTRAINT "FK_a4ea205ad2ac48b4c748883149a"`,
    )
    await queryRunner.query(
      `ALTER TABLE "image" DROP CONSTRAINT "FK_2d65e0d685e4054217df603bfb0"`,
    )
    await queryRunner.query(`DROP TABLE "worker"`)
    await queryRunner.query(`DROP INDEX "IDX_7a3ed7dc473c4edd10b37236db"`)
    await queryRunner.query(`DROP TABLE "name"`)
    await queryRunner.query(`DROP INDEX "IDX_ff7987ebb00ed6baaae99d82cc"`)
    await queryRunner.query(`DROP TABLE "entry"`)
    await queryRunner.query(`DROP INDEX "IDX_2d65e0d685e4054217df603bfb"`)
    await queryRunner.query(`DROP TABLE "image"`)
    await queryRunner.query(`DROP INDEX "IDX_8a45300fd825918f3b40195fbd"`)
    await queryRunner.query(`DROP TABLE "group"`)
  }
}
