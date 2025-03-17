/*
  Warnings:

  - The `category` column on the `JournalEntry` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('PERSONAL', 'WORK', 'TRAVEL', 'HEALTH', 'FINANCE', 'EDUCATION', 'OTHER');

-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "category",
ADD COLUMN     "category" "Category" NOT NULL DEFAULT 'OTHER';
