-- CreateTable
CREATE TABLE "Player" (
    "PUIID" TEXT NOT NULL PRIMARY KEY,
    "Username" TEXT NOT NULL,
    "Tag" TEXT NOT NULL,
    "Region" TEXT
);

-- CreateTable
CREATE TABLE "Match" (
    "ID" TEXT NOT NULL PRIMARY KEY,
    "Result" TEXT NOT NULL,
    "StartTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "Duration" INTEGER NOT NULL,
    "GameMode" TEXT NOT NULL,
    "MapID" INTEGER NOT NULL,
    "GameType" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Mastery" (
    "championId" INTEGER NOT NULL,
    "playerId" TEXT NOT NULL,
    "championLevel" INTEGER NOT NULL,
    "championPoints" INTEGER NOT NULL,
    "totalLevelPoints" INTEGER NOT NULL,
    "pointsUntilNextLevel" INTEGER NOT NULL,

    PRIMARY KEY ("championId", "playerId"),
    CONSTRAINT "Mastery_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player" ("PUIID") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_MatchToPlayer" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_MatchToPlayer_A_fkey" FOREIGN KEY ("A") REFERENCES "Match" ("ID") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_MatchToPlayer_B_fkey" FOREIGN KEY ("B") REFERENCES "Player" ("PUIID") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Player_Username_Tag_key" ON "Player"("Username", "Tag");

-- CreateIndex
CREATE UNIQUE INDEX "_MatchToPlayer_AB_unique" ON "_MatchToPlayer"("A", "B");

-- CreateIndex
CREATE INDEX "_MatchToPlayer_B_index" ON "_MatchToPlayer"("B");
