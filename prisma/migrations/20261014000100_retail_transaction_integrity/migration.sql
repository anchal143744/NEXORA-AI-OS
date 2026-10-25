BEGIN;
-- AlterTable
ALTER TABLE "FinanceExpense" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,4);

-- AlterTable
ALTER TABLE "FinanceRevenue" ALTER COLUMN "amount" SET DATA TYPE DECIMAL(18,4);

-- AlterTable
ALTER TABLE "invoice_payments" ADD COLUMN     "entryType" TEXT NOT NULL DEFAULT 'PAYMENT',
ADD COLUMN     "idempotencyKey" TEXT,
ADD COLUMN     "parentPaymentId" UUID;

-- AlterTable
ALTER TABLE "stock_balances" ADD COLUMN     "costingCurrency" VARCHAR(3),
ADD COLUMN     "inventoryValue" DECIMAL(18,4) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "inventory_movement_history" ADD COLUMN     "stockId" UUID;

-- CreateTable
CREATE TABLE "RetailSale" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,
    "workspaceId" UUID NOT NULL,
    "saleKey" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "currency" VARCHAR(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "total" DECIMAL(18,4) NOT NULL,
    "costOfGoods" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "invoiceId" UUID NOT NULL,
    "createdBy" UUID NOT NULL,
    "completedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RetailSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetailSaleLine" (
    "id" UUID NOT NULL,
    "saleId" UUID NOT NULL,
    "stockId" UUID NOT NULL,
    "quantity" DECIMAL(18,4) NOT NULL,
    "returnedQuantity" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "unitPrice" DECIMAL(18,4) NOT NULL,
    "lineTotal" DECIMAL(18,4) NOT NULL,
    "costOfGoods" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "returnedCost" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "returnedAmount" DECIMAL(18,4) NOT NULL DEFAULT 0,

    CONSTRAINT "RetailSaleLine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RetailReturn" (
    "id" UUID NOT NULL,
    "tenantId" UUID NOT NULL,
    "saleId" UUID NOT NULL,
    "returnKey" TEXT NOT NULL,
    "requestHash" TEXT NOT NULL,
    "amount" DECIMAL(18,4) NOT NULL,
    "costOfGoods" DECIMAL(18,4) NOT NULL,
    "reason" TEXT NOT NULL,
    "actorUserId" UUID NOT NULL,
    "lines" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RetailReturn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RetailSale_invoiceId_key" ON "RetailSale"("invoiceId");

-- CreateIndex
CREATE INDEX "RetailSale_tenantId_workspaceId_completedAt_idx" ON "RetailSale"("tenantId", "workspaceId", "completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RetailSale_tenantId_saleKey_key" ON "RetailSale"("tenantId", "saleKey");

-- CreateIndex
CREATE UNIQUE INDEX "RetailSaleLine_saleId_stockId_key" ON "RetailSaleLine"("saleId", "stockId");

-- CreateIndex
CREATE UNIQUE INDEX "RetailReturn_tenantId_returnKey_key" ON "RetailReturn"("tenantId", "returnKey");

-- CreateIndex
CREATE UNIQUE INDEX "invoice_payments_tenantId_idempotencyKey_key" ON "invoice_payments"("tenantId", "idempotencyKey");

-- AddForeignKey
ALTER TABLE "invoice_payments" ADD CONSTRAINT "invoice_payments_parentPaymentId_fkey" FOREIGN KEY ("parentPaymentId") REFERENCES "invoice_payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_balances" ADD CONSTRAINT "stock_balances_costingCurrency_fkey" FOREIGN KEY ("costingCurrency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_movement_history" ADD CONSTRAINT "inventory_movement_history_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stock_balances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailSale" ADD CONSTRAINT "RetailSale_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailSale" ADD CONSTRAINT "RetailSale_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailSale" ADD CONSTRAINT "RetailSale_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailSale" ADD CONSTRAINT "RetailSale_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailSale" ADD CONSTRAINT "RetailSale_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailSale" ADD CONSTRAINT "RetailSale_currency_fkey" FOREIGN KEY ("currency") REFERENCES "currencies"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailSaleLine" ADD CONSTRAINT "RetailSaleLine_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "RetailSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailSaleLine" ADD CONSTRAINT "RetailSaleLine_stockId_fkey" FOREIGN KEY ("stockId") REFERENCES "stock_balances"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RetailReturn" ADD CONSTRAINT "RetailReturn_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "RetailSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- NOT VALID preserves historical rows for a reviewed reconciliation while enforcing future writes.
ALTER TABLE "stock_balances" ADD CONSTRAINT "retail_stock_nonnegative" CHECK (
  "quantityOnHand" >= 0 AND "quantityAvailable" >= 0 AND "quantityReserved" >= 0 AND "quantityDamaged" >= 0 AND "inventoryValue" >= 0
  AND "quantityOnHand" = "quantityAvailable" + "quantityReserved" + "quantityDamaged"
) NOT VALID;
ALTER TABLE "invoice_payments" ADD CONSTRAINT "retail_payment_entry_valid" CHECK (
  "amount" > 0 AND "entryType" IN ('PAYMENT', 'REFUND', 'REVERSAL')
  AND (("entryType" = 'PAYMENT' AND "parentPaymentId" IS NULL) OR ("entryType" <> 'PAYMENT' AND "parentPaymentId" IS NOT NULL))
) NOT VALID;
ALTER TABLE "RetailSale" ADD CONSTRAINT "retail_sale_amounts_valid" CHECK ("total" >= 0 AND "costOfGoods" >= 0);
ALTER TABLE "RetailSaleLine" ADD CONSTRAINT "retail_sale_line_valid" CHECK (
  "quantity" > 0 AND "returnedQuantity" >= 0 AND "returnedQuantity" <= "quantity" AND "unitPrice" >= 0
  AND "lineTotal" >= 0 AND "returnedAmount" >= 0 AND "returnedAmount" <= "lineTotal"
  AND "costOfGoods" >= 0 AND "returnedCost" >= 0 AND "returnedCost" <= "costOfGoods"
);
ALTER TABLE "RetailReturn" ADD CONSTRAINT "retail_return_amounts_valid" CHECK ("amount" >= 0 AND "costOfGoods" >= 0);
COMMIT;
