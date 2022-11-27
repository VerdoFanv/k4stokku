export interface BarangAttribute {
	product_id: number
  product_name: string
	stock: number
	price: number
	asal: string
	jenis: string
	expired: string
	tanggal_beli: string
	deskripsi: string
	harga_jual: number
	created_date: string
	updated_date: string
	gambar: string
}

export interface JenisBarangAttribute {
	id: number
	nama: string
}

export interface Supplier extends JenisBarangAttribute {}