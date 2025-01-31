import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewSyncStatusToServerless1738233783889
  implements MigrationInterface
{
  name = 'AddNewSyncStatusToServerless1738233783889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TYPE "metadata"."serverlessFunction_syncstatus_enum" RENAME TO "serverlessFunction_syncstatus_enum_old"`,
    );
    await queryRunner.query(
      `CREATE TYPE "metadata"."serverlessFunction_syncstatus_enum" AS ENUM('NOT_READY', 'BUILDING', 'READY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata"."serverlessFunction" ALTER COLUMN "syncStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata"."serverlessFunction" ALTER COLUMN "syncStatus" TYPE "metadata"."serverlessFunction_syncstatus_enum" USING "syncStatus"::"text"::"metadata"."serverlessFunction_syncstatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata"."serverlessFunction" ALTER COLUMN "syncStatus" SET DEFAULT 'NOT_READY'`,
    );
    await queryRunner.query(
      `DROP TYPE "metadata"."serverlessFunction_syncstatus_enum_old"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "metadata"."serverlessFunction_syncstatus_enum_old" AS ENUM('NOT_READY', 'READY')`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata"."serverlessFunction" ALTER COLUMN "syncStatus" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata"."serverlessFunction" ALTER COLUMN "syncStatus" TYPE "metadata"."serverlessFunction_syncstatus_enum_old" USING "syncStatus"::"text"::"metadata"."serverlessFunction_syncstatus_enum_old"`,
    );
    await queryRunner.query(
      `ALTER TABLE "metadata"."serverlessFunction" ALTER COLUMN "syncStatus" SET DEFAULT 'NOT_READY'`,
    );
    await queryRunner.query(
      `DROP TYPE "metadata"."serverlessFunction_syncstatus_enum"`,
    );
    await queryRunner.query(
      `ALTER TYPE "metadata"."serverlessFunction_syncstatus_enum_old" RENAME TO "serverlessFunction_syncstatus_enum"`,
    );
  }
}
