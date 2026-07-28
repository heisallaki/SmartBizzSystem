-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "invoice_id" INTEGER,
ALTER COLUMN "sale_id" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "payments_invoice_id_idx" ON "payments"("invoice_id");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;
