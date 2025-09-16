/*
  Warnings:

  - You are about to alter the column `frameworks` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `languages` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.
  - You are about to alter the column `tools` on the `Profile` table. The data in that column could be lost. The data in that column will be cast from `String` to `Json`.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "country" TEXT,
    "city" TEXT,
    "bio" TEXT NOT NULL,
    "avatar" TEXT,
    "languages" JSONB NOT NULL DEFAULT [],
    "frameworks" JSONB NOT NULL DEFAULT [],
    "tools" JSONB NOT NULL DEFAULT [],
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("userId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("avatar", "bio", "city", "country", "createdAt", "frameworks", "id", "languages", "lastName", "name", "tools", "updatedAt", "userId") SELECT "avatar", "bio", "city", "country", "createdAt", "frameworks", "id", "languages", "lastName", "name", "tools", "updatedAt", "userId" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
