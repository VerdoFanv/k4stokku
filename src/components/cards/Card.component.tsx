import { formatDate } from "@utils/date"
import Link from "next/link"
import { createClient } from "@supabase/supabase-js"
import { useEffect, useState } from "react"

const supabase = createClient(`https://krvwaunslytdcftkfhim.supabase.co`, `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydndhdW5zbHl0ZGNmdGtmaGltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MzQ2Mzg0NiwiZXhwIjoxOTc5MDM5ODQ2fQ.Ml8n7EveOG7wTDbwABaa6oaDQ_i0tPMKlsj5TCRrF-k`)

interface BarangAttribute {
  gambar: string
  product_name: string
  stock: number
  product_id: string
  harga_jual: string
  expired: string
}

interface Props {
  barang: BarangAttribute
}

export default function Cards({ barang }: Props) {
	const formatCurrency = Intl.NumberFormat(`ID`)
	const [ imageUrl, setImageUrl ] = useState(``)

	const getImageUrl = async () => {
		const imageUrl = await supabase.storage.from(`uploads`).getPublicUrl(barang.gambar)
		setImageUrl(imageUrl.data.publicURL)
	}

	useEffect(() => {
		getImageUrl()
	}, [])

	return (
		<section className="card">
			<div className="card-inner">
				<div className="card-header">
					<div className="card-header-image">
						<img src={!barang.gambar ? `images/product.webp` : barang.gambar.includes(`https`) ? barang.gambar : imageUrl} alt="Product" />
					</div>
				</div>
				<div className="card-body">
					<div className="row">
						<Link className="product-name" href={{ pathname: `/barang`, query: { id: barang.product_id } }}>{barang.product_name}</Link>
					</div>
					<div className="row">
						<p className={`text-bold ${barang.stock <= 5 ? `text-danger` : `text-primary`}`}>{barang.stock}</p>
					</div>
					<div className="row flex-grow">
						<p className="text-muted text-bold">Rp {formatCurrency.format(Number(barang.harga_jual))}</p>
					</div>
					<div className="row highlight-expired">
						<p className="text-muted text-bold">{!barang.expired ? `Non Expired` : formatDate(barang.expired, `DD MMMM YYYY`)}</p>
					</div>
				</div>
			</div>
		</section>
	)
}