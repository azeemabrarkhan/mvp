/*
  Warnings:

  - The `entity_type` column on the `audit_logs` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `action` on the `audit_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `result` on the `audit_logs` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "public"."AuditAction" AS ENUM ('LOGIN', 'VIEW', 'BLOCK', 'UNBLOCK');

-- CreateEnum
CREATE TYPE "public"."EntityType" AS ENUM ('USER', 'PROJECT', 'TASK');

-- CreateEnum
CREATE TYPE "public"."AuditResult" AS ENUM ('SUCCESS', 'FAIL');

-- AlterTable
ALTER TABLE "public"."audit_logs" DROP COLUMN "action",
ADD COLUMN     "action" "public"."AuditAction" NOT NULL,
DROP COLUMN "entity_type",
ADD COLUMN     "entity_type" "public"."EntityType",
DROP COLUMN "result",
ADD COLUMN     "result" "public"."AuditResult" NOT NULL;
