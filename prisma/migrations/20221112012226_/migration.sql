/*
  Warnings:

  - A unique constraint covering the columns `[nama]` on the table `jenis_barang` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "jenis_barang_nama_key" ON "jenis_barang"("nama");
