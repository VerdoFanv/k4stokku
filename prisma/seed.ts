import { PrismaClient } from '@prisma/client'
import { formatDate } from '../src/utils/date'

const prisma = new PrismaClient()
const barangs = [
	{
		product_name: `Good Time Cookie Dus`,
		code: `GTCD2123083123`,
		stock: 100,
		price: 1200,
		asal: `Indo Grosir`,
		jenis: `1`,
		expired: `2022-12-12 15:01`,
		tanggal_beli: `2022-05-18 18:36`,
		deskripsi: `Merk : Good Times Cookies\r\n1 Box isi 12 pcs @15gr\r\n`,
		harga_jual: 14000,
		created_date: formatDate(new Date(), `yyyy-mm-dd HH:mm`),
		updated_date: formatDate(new Date(), `yyyy-mm-dd HH:mm`),
		gambar: `https://cf.shopee.co.id/file/a6ca3cb7c6947cb965b47df717e50844`
	},
	{
		product_name: `Indomie Goreng 1 Dus`,
		stock: 100,
		code: `IGD2123083123`,
		price: 118000,
		asal: `Indo Grosir`,
		jenis: `2`,
		expired: `2022-11-14 15:01`,
		tanggal_beli: `2022-05-11 16:01`,
		deskripsi: `Merk : Indomie Goreng 1 dus 1 box isi 40 pcs`,
		harga_jual: 12500,
		created_date: formatDate(new Date(), `yyyy-mm-dd HH:mm`),
		updated_date: formatDate(new Date(), `yyyy-mm-dd HH:mm`),
		gambar: `https://cf.shopee.co.id/file/159e7d81de24e32f07ede8aa4cb275cd`
	}
]

const jenisBarang = [
	{
		nama: `Snack`,
	},
	{
		nama: `Makanan`,
	},
	{
		nama: `Minuman`,
	}
]

async function main() {
	await prisma.barang.createMany({
		data: barangs
	})
	await prisma.jenisBarang.createMany({
		data: jenisBarang
	})
}

main()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
	.finally(async () => await prisma.$disconnect)