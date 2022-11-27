/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `barang` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "barang" ADD COLUMN     "code" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "barang_code_key" ON "barang"("code");
