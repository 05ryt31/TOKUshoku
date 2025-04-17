/*
  Warnings:

  - You are about to drop the column `status` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Product_id_key";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "status",
DROP COLUMN "stock",
ADD COLUMN     "discounted_price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
