-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Cart_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cartId" TEXT NOT NULL,
    "eventSlug" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "totalAmount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentId" TEXT,
    "passType" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "eventSlug" TEXT NOT NULL,
    "eventName" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "gender" TEXT,
    "phone" TEXT,
    "college" TEXT,
    "year" TEXT,
    "accommodation" TEXT,
    "paymentId" TEXT,
    "paymentScreenshot" TEXT,
    "totalPaid" INTEGER NOT NULL DEFAULT 0,
    "paymentVerified" BOOLEAN NOT NULL DEFAULT false,
    "profileCompleted" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "referralCode" TEXT,
    "referredBy" TEXT,
    "caCoins" INTEGER NOT NULL DEFAULT 0,
    "taskInsta" BOOLEAN NOT NULL DEFAULT false,
    "taskLinkedIn" BOOLEAN NOT NULL DEFAULT false,
    "taskX" BOOLEAN NOT NULL DEFAULT false,
    "taskFacebook" BOOLEAN NOT NULL DEFAULT false,
    "taskCart" BOOLEAN NOT NULL DEFAULT false,
    "taskCart5" BOOLEAN NOT NULL DEFAULT false,
    "taskCart10" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_User" ("accommodation", "caCoins", "college", "createdAt", "email", "id", "name", "paymentId", "paymentVerified", "phone", "profileCompleted", "referralCode", "referredBy", "role", "taskInsta", "taskLinkedIn", "year") SELECT "accommodation", "caCoins", "college", "createdAt", "email", "id", "name", "paymentId", "paymentVerified", "phone", "profileCompleted", "referralCode", "referredBy", "role", "taskInsta", "taskLinkedIn", "year" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "Cart_userId_key" ON "Cart"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_eventSlug_key" ON "CartItem"("cartId", "eventSlug");
