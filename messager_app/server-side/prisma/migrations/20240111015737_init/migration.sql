/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Post";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Messages" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sendBy" TEXT NOT NULL,
    "ReceiveBy" TEXT NOT NULL,
    "MessageBody" TEXT NOT NULL
);
