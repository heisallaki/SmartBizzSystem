-- AlterEnum
ALTER TYPE "SupplierStatus" ADD VALUE 'On Hold';

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "category" VARCHAR(100),
ADD COLUMN     "total_orders" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "total_spend" DECIMAL(12,2) NOT NULL DEFAULT 0.00;
