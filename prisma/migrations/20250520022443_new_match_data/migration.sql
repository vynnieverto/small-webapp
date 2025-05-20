/*
  Warnings:

  - You are about to drop the `_MatchToPlayer` table. If the table is not empty, all the data it contains will be lost.
  - The primary key for the `Match` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `Result` on the `Match` table. All the data in the column will be lost.
  - Added the required column `MatchId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_MatchToPlayer_B_index";

-- DropIndex
DROP INDEX "_MatchToPlayer_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_MatchToPlayer";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Participant" (
    "MatchId" TEXT NOT NULL,
    "puuid" TEXT NOT NULL,
    "participantId" INTEGER NOT NULL,
    "championId" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,
    "role" TEXT NOT NULL,
    "lane" TEXT NOT NULL,
    "kills" INTEGER NOT NULL,
    "deaths" INTEGER NOT NULL,
    "assists" INTEGER NOT NULL,
    "goldEarned" INTEGER NOT NULL,
    "goldSpent" INTEGER NOT NULL,
    "totalDamageDealt" INTEGER NOT NULL,
    "totalDamageTaken" INTEGER NOT NULL,
    "wardsPlaced" INTEGER NOT NULL,
    "wardsKilled" INTEGER NOT NULL,

    PRIMARY KEY ("MatchId", "puuid"),
    CONSTRAINT "Participant_puuid_fkey" FOREIGN KEY ("puuid") REFERENCES "Player" ("puuid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participant_MatchId_fkey" FOREIGN KEY ("MatchId") REFERENCES "Match" ("MatchId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Participant_MatchId_teamId_fkey" FOREIGN KEY ("MatchId", "teamId") REFERENCES "Team" ("MatchId", "teamId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Team" (
    "teamId" INTEGER NOT NULL,
    "MatchId" TEXT NOT NULL,
    "teamPosition" TEXT NOT NULL,
    "win" BOOLEAN NOT NULL,
    "firstBlood" BOOLEAN NOT NULL,
    "firstTower" BOOLEAN NOT NULL,
    "firstInhibitor" BOOLEAN NOT NULL,
    "firstBaron" BOOLEAN NOT NULL,

    PRIMARY KEY ("MatchId", "teamId"),
    CONSTRAINT "Team_MatchId_fkey" FOREIGN KEY ("MatchId") REFERENCES "Match" ("MatchId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Objective" (
    "MatchId" TEXT NOT NULL,
    "teamId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "kills" INTEGER NOT NULL,
    "timeAlive" INTEGER NOT NULL,
    "timeAlivePercent" REAL NOT NULL,

    PRIMARY KEY ("MatchId", "teamId", "type"),
    CONSTRAINT "Objective_MatchId_teamId_fkey" FOREIGN KEY ("MatchId", "teamId") REFERENCES "Team" ("MatchId", "teamId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Match" (
    "MatchId" TEXT NOT NULL PRIMARY KEY,
    "StartTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Duration" INTEGER NOT NULL,
    "GameMode" TEXT NOT NULL,
    "MapID" INTEGER NOT NULL,
    "GameType" TEXT NOT NULL
);
INSERT INTO "new_Match" ("Duration", "GameMode", "GameType", "MapID", "StartTime") SELECT "Duration", "GameMode", "GameType", "MapID", "StartTime" FROM "Match";
DROP TABLE "Match";
ALTER TABLE "new_Match" RENAME TO "Match";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
