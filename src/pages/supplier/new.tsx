import FormInput from "@components/form/FormInput.component"
import useCurrentPath from "@hooks/useCurrentPath"
import { fetcherGet, fetcherPost } from "@utils/fetcher"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useContext, useState } from "react"
import Toast from "@components/toast/Toast.component"
import Header from "@components/header/Header"
import { RootAppContext } from "@contexts/RootAppContext"

const schema = yup.object({
	nama: yup.string().required(`Nama is required`),
})
export default function ProductSupplierNew() {
	const { breadcrumb } = useCurrentPath()
	const { dispatch } = useContext(RootAppContext)
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
		dispatch({ type: `set_loading`, payload: true })
		delete data.id

		const suppliers = await fetcherGet(`/api/supplier`)
		const isSupplierExists = suppliers.data.filter((sp) => sp.nama.toLowerCase() === data.nama.toLowerCase())

		try {
			if (isSupplierExists.length > 0) {
				setToast({
					type: `failed`,
					visible: true,
					message: `Gagal menambahkan supplier, Supplier sudah ada!`,
				})
			} else {
				await fetcherPost(`/api/supplier`, JSON.stringify(data))
				setToast({
					...toast,
					visible: true,
					message: `Berhasil menambahkan supplier!`
				})
			}
			reset()
		} catch (error) {
			setToast({
				...toast,
				visible: true,
				message: `Gagal menambahkan supplier, Supplier sudah ada!`,
				type: `failed`
			})
		}
		dispatch({ type: `set_loading`, payload: false })
	}

	return (
		<form method="POST" onSubmit={handleSubmit(submit)} encType="multipart/form-data">
			<Header
				link={
					<>
						<Link
							href={`${breadcrumb[0]}`}
							onClick={() => dispatch({ type: `set_loading`, payload
							: true })}
							passHref
						>Master Supplier</Link> / <p className="active">Add</p>
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

ProductSupplierNew.getLayout = function getLayout(page) {
	return page
}
