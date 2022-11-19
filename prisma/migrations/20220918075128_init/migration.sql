-- CreateTable
CREATE TABLE "barang" (
    "product_id" SERIAL NOT NULL,
    "product_name" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "asal" TEXT,
    "jenis" TEXT NOT NULL,
    "expired" TEXT,
    "tanggal_beli" TEXT NOT NULL,
    "deskripsi" TEXT,
    "harga_jual" INTEGER NOT NULL,
    "created_date" TEXT NOT NULL,
    "updated_date" TEXT NOT NULL,
    "gambar" TEXT,

    CONSTRAINT "barang_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "jenis_barang" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,

    CONSTRAINT "jenis_barang_pkey" PRIMARY KEY ("id")
);
