/*
  Warnings:

  - A unique constraint covering the columns `[gameName,tagLine,Region]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Player_gameName_tagLine_key";

-- CreateIndex
CREATE UNIQUE INDEX "Player_gameName_tagLine_Region_key" ON "Player"("gameName", "tagLine", "Region");
