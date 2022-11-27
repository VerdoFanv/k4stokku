import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { BarangAttribute, JenisBarangAttribute, Supplier } from "src/types/barang"
import FormInput from "@components/form/FormInput.component"
import FormTextarea from "@components/form/FormTextarea.component"
import FormDatepicker from "@components/form/FormDatepicker.component"
import FormSelect from "@components/form/FormSelect.component"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { fetcherDelete, fetcherPut } from "@utils/fetcher"
import { useRouter } from "next/router"
import { AnimatePresence, motion } from "framer-motion"
import Toast from "@components/toast/Toast.component"
import { createClient } from "@supabase/supabase-js"
import FormFile from "@components/form/FormFile.component"
import Header from "@components/header/Header"
import { RootAppContext } from "@contexts/RootAppContext"

const supabase = createClient(`https://krvwaunslytdcftkfhim.supabase.co`, `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydndhdW5zbHl0ZGNmdGtmaGltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MzQ2Mzg0NiwiZXhwIjoxOTc5MDM5ODQ2fQ.Ml8n7EveOG7wTDbwABaa6oaDQ_i0tPMKlsj5TCRrF-k`)

const prisma = new PrismaClient()
const schema = yup.object({
	product_name: yup.string().required(`Nama is required`),
	code: yup.string().required(`Kode is required`),
	deskripsi: yup.string(),
	stock: yup.number().integer().required(`Stok is required`),
	price: yup.number().integer().required(`Harga Beli is required`),
	harga_jual: yup.number().integer().required(`Harga jual is required`),
	asal: yup.string(),
	jenis: yup.string().required(`Jenis is required`),
	tanggal_beli: yup.string().required(`Tanggal Beli is required`)
})

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const barang = await prisma.barang.findUnique({
		where: {
			product_id: Number(query.barangId),
		}
	})
	const jenisBarang = await prisma.jenisBarang.findMany()
	const suppliers = await prisma.supplier.findMany()
	const supplier = await prisma.supplier.findUnique({
		where: {
			id: Number(query.supplierId),
		}
	})

	return {
		props: {
			barang,
			jenisBarang,
			suppliers,
			supplier
		},
	}
}

export default function BarangDetail({ barang, jenisBarang, suppliers, supplier }: { barang: BarangAttribute, jenisBarang?: JenisBarangAttribute[], suppliers: Supplier[], supplier: Supplier }) {
	const { dispatch } = useContext(RootAppContext)
	const setForm = useForm<any>({
		resolver: yupResolver(schema)
	})
	const { reset, handleSubmit, formState: { errors } } = setForm
	const [ modal, setModal ] = useState(false)
	const router = useRouter()
	const [ toast, setToast ] = useState({
		visible: false,
		message: ``,
		type: `success`
	})
	const [ loading, setLoading ] = useState(false)

	const submit = async (data) => {
		setLoading(true)
		delete data.product_id

		if (data.gambar !== barang.gambar && !data.gambar.includes(barang.gambar)) {
			const filename = `image-${+new Date()}`
			await supabase.storage.from(`uploads`).remove([ barang.gambar ])
			await supabase.storage.from(`uploads`).upload(filename, data.gambar)
			const body = {
				...data,
				gambar: filename
			}
			await fetcherPut(`/api/barang?id=${barang.product_id}`, JSON.stringify(body))
			setToast({
				...toast,
				visible: true,
				message: `Berhasil mengubah barang!`
			})
			router.reload()
		} else {
			try {
				await fetcherPut(`/api/barang?id=${barang.product_id}`, JSON.stringify(data))
				setToast({
					...toast,
					visible: true,
					message: `Berhasil mengubah barang!`
				})
			} catch (e) {
				setToast({
					...toast,
					visible: true,
					message: `Gagal mengubah barang!`,
					type: `failed`
				})
			}
		}
		setLoading(false)
	}

	const deleteBarang = async () => {
		setLoading(true)
		try {
			await fetcherDelete(`/api/barang?id=${barang.product_id}`)
			setModal(!modal)
		} catch (e) {
			console.log(e)
			setModal(!modal)
		}
		setLoading(false)
		router.push(`/`)
	}

	const getImageUrl = async () => {
		const imageUrl = supabase.storage.from(`uploads`).getPublicUrl(barang.gambar)
		reset({
			...barang,
			gambar: barang.gambar.includes(`https`) ? barang.gambar : imageUrl.data.publicURL
		})
	}

	useEffect(() => {
		getImageUrl()
	}, [ barang ])

	return (
		<form id="formDetailProduct" className={loading ? `loading` : ``} onSubmit={handleSubmit(submit)}>
			<Header
				link={
					<>
						<Link href={`/supplier`} onClick={() => dispatch({ type: `set_loading`, payload: true })} passHref>Master Supplier</Link> / <Link href={`/supplier/${supplier?.id}`} onClick={() => dispatch({ type: `set_loading`, payload: true })} passHref>{supplier?.nama}</Link> / <p className="active">{barang?.product_name}</p>
					</>}
				action={
					<>
						<button className="button button-delete" onClick={() => setModal(!modal)} id="btnDelete" type="button">Hapus</button>
						<button type="submit" name="save" className="button button-primary">Simpan</button>
					</>
				}
			/>
			<div className="form-field">
				<p className="text-muted">note: please fill required form (*)</p>
				<div className="form-field-body divided-2">
					<div className="product-image">
						<div className="row">
							<div className="row">
								<FormFile setForm={setForm} name="gambar" type="image" />
							</div>
						</div>
					</div>
					<div className="product-info">
						<div className="row">
							<FormInput setForm={setForm} name="code" placeholder="Masukkan kode produk ..." label="Kode*" error={errors?.code} />
						</div>
						<div className="row">
							<FormInput setForm={setForm} name="product_name" placeholder="Masukkan nama produk ..." label="Nama" error={errors?.product_name} />
						</div>
						<div className="row">
							<FormTextarea setForm={setForm} name="deskripsi" placeholder="Masukkan deskripsi ..." label="Deskripsi" error={errors?.deskripsi} />
						</div>
						<div className="row">
							<FormInput setForm={setForm} name="price" placeholder="Masukkan Harga beli ..." label="Harga Beli*" type="number" error={errors?.price} />
						</div>
						<div className="row">
							<FormInput setForm={setForm} name="harga_jual" placeholder="Masukkan Harga jual ..." label="Harga Jual*" type="number" error={errors?.harga_jual} />
						</div>
						<div className="row">
							<FormSelect setForm={setForm} name="supplier_id" placeholder="Masukkan asal ..." label="Asal" error={errors?.supplier_id} options={suppliers?.map((item => ({ value: item.id, label: item.nama })))} />
						</div>
						<div className="row">
							<FormSelect setForm={setForm} options={jenisBarang.map((item => ({ value: String(item.id), label: item.nama })))} name="jenis" label="Jenis*" error={errors?.jenis} />
						</div>
						<div className="row">
							<FormDatepicker setForm={setForm} name="expired" valueType="string" label="Tanggal expired" />
						</div>
						<div className="row">
							<FormDatepicker setForm={setForm} name="tanggal_beli" valueType="string" label="Tanggal beli*" error={errors?.tanggal_beli} />
						</div>
					</div>
				</div>
			</div>
			<AnimatePresence>
				{modal && (
					<motion.div
						className="modal-dialog"
						initial={{ opacity: 0, scale: 0 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 1, scale: 0, transition: { ease: `backIn` } }}
						transition={{
							x: { duration: 0.2 },
							ease: `backOut`
						}}
					>
						<p>Apakah anda yakin ingin menghapusnya ?</p>
						<div className="action-dialog">
							<button className="agree" type="button" name="delete" onClick={deleteBarang}>Ya</button>
							<button className="cancel" onClick={() => setModal(!modal)} type="button">Tidak</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<Toast setClose={() => setToast({ ...toast, visible: false })} visible={toast.visible} message={toast.message} type={toast.type} />
		</form>
	)
}
