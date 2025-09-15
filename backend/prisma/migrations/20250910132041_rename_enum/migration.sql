/*
  Warnings:

  - The values [FAIL] on the enum `AuditResult` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."AuditResult_new" AS ENUM ('SUCCESS', 'FAILED');
ALTER TABLE "public"."audit_logs" ALTER COLUMN "result" TYPE "public"."AuditResult_new" USING ("result"::text::"public"."AuditResult_new");
ALTER TYPE "public"."AuditResult" RENAME TO "AuditResult_old";
ALTER TYPE "public"."AuditResult_new" RENAME TO "AuditResult";
DROP TYPE "public"."AuditResult_old";
COMMIT;
