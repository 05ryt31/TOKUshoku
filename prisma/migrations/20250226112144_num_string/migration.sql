-- AlterTable
ALTER TABLE "Item" ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Item_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Item_id_key";
