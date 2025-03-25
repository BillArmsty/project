/*
  Warnings:

  - You are about to drop the column `tags` on the `JournalEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "tags";

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_EntryTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_EntryTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_EntryTags_B_index" ON "_EntryTags"("B");

-- AddForeignKey
ALTER TABLE "_EntryTags" ADD CONSTRAINT "_EntryTags_A_fkey" FOREIGN KEY ("A") REFERENCES "JournalEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_EntryTags" ADD CONSTRAINT "_EntryTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
