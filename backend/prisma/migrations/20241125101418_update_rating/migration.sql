/*
  Warnings:

  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `rating` on table `Driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `minKm` on table `Driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ratePerKm` on table `Driver` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_driverId_fkey";

-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_rideId_fkey";

-- AlterTable
ALTER TABLE "Driver" ALTER COLUMN "rating" SET NOT NULL,
ALTER COLUMN "rating" DROP DEFAULT,
ALTER COLUMN "rating" SET DATA TYPE TEXT,
ALTER COLUMN "minKm" SET NOT NULL,
ALTER COLUMN "ratePerKm" SET NOT NULL;

-- DropTable
DROP TABLE "Rating";
