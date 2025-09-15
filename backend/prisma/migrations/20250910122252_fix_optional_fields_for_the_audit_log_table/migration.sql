/*
  Warnings:

  - Made the column `entity_type` on table `audit_logs` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ip` on table `audit_logs` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."audit_logs" ALTER COLUMN "entity_type" SET NOT NULL,
ALTER COLUMN "ip" SET NOT NULL;
