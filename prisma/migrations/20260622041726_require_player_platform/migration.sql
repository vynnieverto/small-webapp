/*
  Warnings:

  - Made the column `Region` on table `Player` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "puuid" TEXT NOT NULL PRIMARY KEY,
    "gameName" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,
    "Region" TEXT NOT NULL,
    "userId" TEXT,
    CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Player" ("Region", "gameName", "puuid", "tagLine", "userId") SELECT "Region", "gameName", "puuid", "tagLine", "userId" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_gameName_tagLine_Region_key" ON "Player"("gameName", "tagLine", "Region");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
