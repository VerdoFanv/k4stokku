import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { JenisBarangAttribute, Supplier } from "src/types/barang"
import FormInput from "@components/form/FormInput.component"
import FormTextarea from "@components/form/FormTextarea.component"
import FormDatepicker from "@components/form/FormDatepicker.component"
import FormSelect from "@components/form/FormSelect.component"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { fetcherPost } from "@utils/fetcher"
import FormFile from "@components/form/FormFile.component"
import Toast from "@components/toast/Toast.component"
import { useContext, useState } from "react"
import { createClient } from "@supabase/supabase-js"
import Header from "@components/header/Header"
import { RootAppContext } from "@contexts/RootAppContext"

const supabase = createClient(`https://krvwaunslytdcftkfhim.supabase.co`, `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtydndhdW5zbHl0ZGNmdGtmaGltIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY2MzQ2Mzg0NiwiZXhwIjoxOTc5MDM5ODQ2fQ.Ml8n7EveOG7wTDbwABaa6oaDQ_i0tPMKlsj5TCRrF-k`)

const prisma = new PrismaClient()
const schema = yup.object({
	code: yup.string().required(`Kode is required`),
	product_name: yup.string().required(`Nama is required`),
	deskripsi: yup.string(),
	price: yup.number().integer().required(`Harga Beli is required`),
	harga_jual: yup.number().integer().required(`Harga jual is required`),
	supplier_id: yup.string(),
	jenis: yup.string().required(`Jenis is required`),
	tanggal_beli: yup.date().required(`Tanggal Beli is required`),
})

export const getServerSideProps: GetServerSideProps = async () => {
	const jenisBarang = await prisma.jenisBarang.findMany()
	const supplier = await prisma.supplier.findMany()

	return {
		props: {
			jenisBarang,
			supplier
		},
	}
}

export default function BarangDetail({ jenisBarang, supplier }: { jenisBarang?: JenisBarangAttribute[], supplier: Supplier[] }) {
	const { dispatch } = useContext(RootAppContext)
	const setForm = useForm<any>({
		defaultValues: {
			product_name: ``,
			deskripsi: ``,
			price: ``,
			harga_jual: ``,
			asal: ``,
			supplier_id: null,
			jenis: ``,
			expired: null,
			tanggal_beli: null,
			gambar: ``
		},
		resolver: yupResolver(schema),
		mode: `onChange`
	})
	const { handleSubmit, reset, formState: { errors } } = setForm
	const [ toast, setToast ] = useState({
		visible: false,
		message: ``,
		type: `success`
	})

	async function submit(data) {
		dispatch({ type: `set_loading`, payload: true })
		if (data.gambar) {
			const filename = `image-${+new Date()}`
			await supabase.storage.from(`uploads`).upload(filename, data.gambar)
			await fetcherPost(`/api/barang`, JSON.stringify({
				...data,
				gambar: filename
			}))
			setToast({
				...toast,
				visible: true,
				message: `Berhasil menambahkan barang!`
			})
			reset()
		} else {
			await fetcherPost(`/api/barang`, JSON.stringify(data))
			setToast({
				...toast,
				visible: true,
				message: `Berhasil menambahkan barang!`
			})
			reset()
		}

		dispatch({ type: `set_loading`, payload: false })
	}

	return (
		<form onSubmit={handleSubmit(submit)}>
			<Header
				link={
					<>
						<Link href={`/`} onClick={() => dispatch({ type: `set_loading`, payload: true })} passHref>Home</Link> / <p className="active">Add Barang</p>
					</>
				}
				action={
					<button type="submit" className="button button-primary" name="add">tambah</button>
				}
			/>
			<div className="form-field">
				<p className="text-muted">note: please fill required form (*)</p>
				<div className="form-field-body divided-2">
					<div className="product-image">
						<div className="row">
							<FormFile setForm={setForm} name="gambar" type="image" />
						</div>
					</div>
					<div className="product-info">
						<div className="row">
							<FormInput setForm={setForm} name="code" placeholder="Masukkan kode produk ..." label="Kode*" error={errors?.code} />
						</div>
						<div className="row">
							<FormInput setForm={setForm} name="product_name" placeholder="Masukkan nama produk ..." label="Nama*" error={errors?.product_name} />
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
							<FormSelect setForm={setForm} name="supplier_id" placeholder="Masukkan asal ..." label="Asal" error={errors?.supplier_id} options={supplier?.map((item => ({ value: item.id, label: item.nama })))} />
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
			<Toast setClose={() => setToast({ ...toast, visible: false })} visible={toast.visible} message={toast.message} type={toast.type} />
		</form>
	)
}

BarangDetail.getLayout = function getLayout(page) {
	return page
}
