/*
  Warnings:

  - You are about to drop the column `car` on the `Driver` table. All the data in the column will be lost.
  - You are about to drop the column `minDistance` on the `Driver` table. All the data in the column will be lost.
  - You are about to alter the column `rating` on the `Driver` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the column `destLat` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `destLng` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `originLat` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `originLng` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `routeResponse` on the `Ride` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Ride` table. All the data in the column will be lost.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `description` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minKm` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ratePerKm` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vehicle` to the `Driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerId` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `value` to the `Ride` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Ride" DROP CONSTRAINT "Ride_userId_fkey";

-- AlterTable
ALTER TABLE "Driver" DROP COLUMN "car",
DROP COLUMN "minDistance",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "minKm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "ratePerKm" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vehicle" TEXT NOT NULL,
ALTER COLUMN "rating" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Ride" DROP COLUMN "destLat",
DROP COLUMN "destLng",
DROP COLUMN "originLat",
DROP COLUMN "originLng",
DROP COLUMN "price",
DROP COLUMN "routeResponse",
DROP COLUMN "userId",
ADD COLUMN     "customerId" TEXT NOT NULL,
ADD COLUMN     "value" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "driverId" DROP NOT NULL,
ALTER COLUMN "duration" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ride" ADD CONSTRAINT "Ride_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "Driver"("id") ON DELETE SET NULL ON UPDATE CASCADE;
