import { formatDate, timeFromNow	 } from "@utils/date"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { useContext, useEffect, useState } from "react"
import { RootAppContext } from "@contexts/RootAppContext"

const supabase = createClient(`https://krvwaunslytdcftkfhim.supabase.co`, `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydndhdW5zbHl0ZGNmdGtmaGltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MzQ2Mzg0NiwiZXhwIjoxOTc5MDM5ODQ2fQ.Ml8n7EveOG7wTDbwABaa6oaDQ_i0tPMKlsj5TCRrF-k`)

interface BarangAttribute {
  gambar: string
	code: string
  product_name: string
  stock: number
  product_id: string
  harga_jual: string
  expired: string
}

interface Props {
  barang: BarangAttribute
	onChangeStock: (barang: any) => void
	linkToPath: string
}

export default function Cards({ barang, onChangeStock, linkToPath }: Props) {
	const formatCurrency = Intl.NumberFormat(`ID`)
	const [ imageUrl, setImageUrl ] = useState(``)
	const { dispatch } = useContext(RootAppContext)

	const getImageUrl = async () => {
		const imageUrl = await supabase.storage.from(`uploads`).getPublicUrl(barang.gambar)
		setImageUrl(imageUrl.data.publicURL)
	}

	useEffect(() => {
		getImageUrl()
	}, [])

	return (
		<section className="card">
			<div className="text-center bg-amber-400">
				<p className="text-gray-600">{barang.code}</p>
			</div>
			<div className="card-inner">
				<div className="card-header">
					<div className="card-header-image h-48">
						<img className="object-cover object-center h-48" src={!barang.gambar ? `images/product.webp` : barang.gambar.includes(`https`) ? barang.gambar : imageUrl} alt="Product" />
					</div>
				</div>
				<div className="card-body">
					<div className="row">
						<Link className="product-name" onClick={() => dispatch({ type: `set_loading`, payload: true })} href={`${linkToPath}/${barang.product_id}`}>{barang.product_name}</Link>
					</div>
					<div className="row">
						<p className={`text-bold ${barang.stock <= 5 ? `text-danger` : `text-primary`}`}>{barang.stock}</p>
					</div>
					<div className="row flex-grow">
						<p className="text-gray-600 text-bold">Rp {formatCurrency.format(Number(barang.harga_jual))}</p>
					</div>
					{(timeFromNow(barang.expired) === `dalam 7 hari` || timeFromNow(barang.expired).includes(`yang lalu`)) ? (
						<div className="flex justify-end mb-3">
							<p className="text-white order-last text-bold bg-rose-400 px-4">Expired {timeFromNow(barang.expired)}</p>
						</div>
					) : (
						<div className="flex justify-end mb-3">
							<p className="text-muted order-last text-bold bg-amber-400 px-4">{formatDate(barang.expired, `DD MMMM YYYY`)}</p>
						</div>
					)}
					<div className="flex row justify-end">
						<button className="bg-cyan-700 btn text-white rounded px-5 py-1" onClick={() => onChangeStock(barang)}>Ubah Stok</button>
					</div>
				</div>
			</div>
		</section>
	)
}