-- AlterTable
ALTER TABLE "barang" ADD COLUMN     "supplier_id" INTEGER;

-- CreateTable
CREATE TABLE "supplier" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "supplier_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "barang" ADD CONSTRAINT "barang_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "supplier"("id") ON DELETE CASCADE ON UPDATE CASCADE;
