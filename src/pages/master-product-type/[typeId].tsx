import FormInput from "@components/form/FormInput.component"
import useCurrentPath from "@hooks/useCurrentPath"
import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"
import { AnimatePresence, motion } from "framer-motion"
import Toast from "@components/toast/Toast.component"
import { useContext, useEffect, useState } from "react"
import { fetcherDelete, fetcherPut } from "@utils/fetcher"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import Header from "@components/header/Header"
import { RootAppContext } from "@contexts/RootAppContext"

const prisma = new PrismaClient()
const schema = yup.object({
	nama: yup.string().required(`Nama is required`),
})

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
	const jenisBarang = await prisma.jenisBarang.findUnique({
		where: {
			id: Number(params.typeId),
		}
	})

	return {
		props: {
			jenisBarang
		},
	}
}

export default function MasterProductTypeNew({ jenisBarang }) {
	const setForm = useForm({
		resolver: yupResolver(schema)
	})
	const router = useRouter()
	const { dispatch } = useContext(RootAppContext)
	const { reset, handleSubmit, formState: { errors } } = setForm
	const [ modal, setModal ] = useState(false)
	const { breadcrumb } = useCurrentPath()
	const [ toast, setToast ] = useState({
		visible: false,
		message: ``,
		type: `success`
	})

	const submit = async (data) => {
		dispatch({ type: `set_loading`, payload: true })
		delete data.id
		await fetcherPut(`/api/jenisBarang?id=${jenisBarang.id}`, JSON.stringify(data))
		setToast({
			...toast,
			visible: true,
			message: `Berhasil mengubah jenis barang!`
		})
		dispatch({ type: `set_loading`, payload: false })
	}

	const deleteBarang = async () => {
		dispatch({ type: `set_loading`, payload: true })
		try {
			await fetcherDelete(`/api/jenisBarang?id=${jenisBarang.id}`)
			setModal(!modal)
			setToast({
				...toast,
				visible: true,
				message: `Berhasil menghapus jenis barang!`
			})
		} catch (e) {
			console.log(e)
			setModal(!modal)
		}
		dispatch({ type: `set_loading`, payload: false })
		router.push(breadcrumb[0])
	}

	useEffect(() => {
		reset(jenisBarang)
	}, [ jenisBarang ])

	return (
		<form method="POST" onSubmit={handleSubmit(submit)} id="formDetailProduct" encType="multipart/form-data">
			<Header
				link={
					<>
						<Link
							href={`${breadcrumb[0]}`}
							onClick={() => {
								dispatch({ type: `set_loading`, payload: true })
								router.push(`/master-product-type`)
							}}
							passHref
						>Master Jenis Barang</Link> / <p className="active">{jenisBarang.nama}</p>
					</>
				}
				action={
					<>
						<button className="button button-delete" onClick={() => setModal(!modal)} id="btnDelete" type="button">Delete</button>
						<button type="submit" name="save" className="button button-primary">Save</button>
					</>
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
