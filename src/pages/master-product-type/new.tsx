import FormInput from "@components/form/FormInput.component"
import useCurrentPath from "@hooks/useCurrentPath"
import { fetcherGet, fetcherPost } from "@utils/fetcher"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useState } from "react"
import Toast from "@components/toast/Toast.component"
import Header from "@components/header/Header"

const schema = yup.object({
	nama: yup.string().required(`Nama is required`),
})
export default function MasterProductTypeNew() {
	const { breadcrumb } = useCurrentPath()
	const setForm = useForm<any>({
		defaultValues: {
			nama: ``
		},
		resolver: yupResolver(schema)
	})
	const { handleSubmit, reset, formState: { errors } } = setForm
	const [ toast, setToast ] = useState({
		visible: false,
		message: ``,
		type: `success`
	})

	const submit = async (data) => {
		delete data.id

		const jenisBarangs = await fetcherGet(`/api/jenisBarang`)
		const isJenisBarangExists = jenisBarangs.data.filter((jb) => jb.nama.toLowerCase() === data.nama.toLowerCase())

		try {
			if (isJenisBarangExists.length > 0) {
				setToast({
					type: `failed`,
					visible: true,
					message: `Gagal menambahkan jenis barang, Jenis barang sudah ada!`,
				})
			} else {
				await fetcherPost(`/api/jenisBarang`, JSON.stringify(data))
				setToast({
					...toast,
					visible: true,
					message: `Berhasil menambahkan jenis barang!`
				})
			}
			reset()
		} catch (error) {
			setToast({
				...toast,
				visible: true,
				message: `Gagal menambahkan jenis barang, Jenis barang sudah ada!`,
				type: `failed`
			})
		}
	}

	return (
		<form method="POST" onSubmit={handleSubmit(submit)} id="formDetailProduct" encType="multipart/form-data">
			<Header
				link={
					<>
						<Link href={`/`} passHref>Home</Link> / <Link href={`${breadcrumb[0]}`} passHref>Master Jenis Barang</Link> / <p className="active">Add</p>
					</>
				}
				action={
					<button type="submit" className="button button-primary">Tambah</button>
				}
			/>
			<div className="form-field">
				<p className="text-muted">note: please fill required form (*)</p>
				<div className="form-field-body">
					<div className="product-info">
						<div className="row">
							<FormInput setForm={setForm} name="nama" label="Nama*" error={errors?.nama} />
						</div>
					</div>
				</div>
			</div>

			<Toast setClose={() => setToast({ ...toast, visible: false })} visible={toast.visible} message={toast.message} type={toast.type} />
		</form>
	)
}

MasterProductTypeNew.getLayout = function getLayout(page) {
	return page
}
