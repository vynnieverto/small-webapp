/*
  Warnings:

  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `PUIID` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `Tag` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `Username` on the `Player` table. All the data in the column will be lost.
  - Added the required column `gameName` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `puuid` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tagLine` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mastery" (
    "championId" INTEGER NOT NULL,
    "playerId" TEXT NOT NULL,
    "championLevel" INTEGER NOT NULL,
    "championPoints" INTEGER NOT NULL,
    "totalLevelPoints" INTEGER NOT NULL,
    "pointsUntilNextLevel" INTEGER NOT NULL,

    PRIMARY KEY ("championId", "playerId"),
    CONSTRAINT "Mastery_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Mastery" ("championId", "championLevel", "championPoints", "playerId", "pointsUntilNextLevel", "totalLevelPoints") SELECT "championId", "championLevel", "championPoints", "playerId", "pointsUntilNextLevel", "totalLevelPoints" FROM "Mastery";
DROP TABLE "Mastery";
ALTER TABLE "new_Mastery" RENAME TO "Mastery";
CREATE TABLE "new_Player" (
    "puuid" TEXT NOT NULL PRIMARY KEY,
    "gameName" TEXT NOT NULL,
    "tagLine" TEXT NOT NULL,
    "Region" TEXT
);
INSERT INTO "new_Player" ("Region") SELECT "Region" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
CREATE UNIQUE INDEX "Player_gameName_tagLine_key" ON "Player"("gameName", "tagLine");
CREATE TABLE "new__MatchToPlayer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MatchToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Match" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MatchToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player" ("puuid") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__MatchToPlayer" ("A", "B") SELECT "A", "B" FROM "_MatchToPlayer";
DROP TABLE "_MatchToPlayer";
ALTER TABLE "new__MatchToPlayer" RENAME TO "_MatchToPlayer";
CREATE UNIQUE INDEX "_MatchToPlayer_AB_unique" ON "_MatchToPlayer"("A", "B");
CREATE INDEX "_MatchToPlayer_B_index" ON "_MatchToPlayer"("B");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
