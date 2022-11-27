import Card from "@components/cards/Card.component"
import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next"
import { useForm } from "react-hook-form"
import { useContext, useEffect, useState } from "react"
import { fetcherDelete, fetcherGet, fetcherPut } from "@utils/fetcher"
import Header from "@components/header/Header"

// icon
// import IconArrowDownMenu from "public/icons/icon-arrow-down-menu.svg"
import { SlMagnifier } from "react-icons/sl"
import { FaTimes, FaMinus, FaPlus } from "react-icons/fa"
import { HiPencil } from "react-icons/hi"

import { AnimatePresence, motion } from "framer-motion"
import Toast from "@components/toast/Toast.component"
import { RootAppContext } from "@contexts/RootAppContext"
import { useRouter } from "next/router"
import Link from "next/link"

const prisma = new PrismaClient()

const sortCreatedAt = (value1, value2) => {
	if (value1.created_date < value2.created_date) {
		return -1
	}

	if (value1.created_date > value2.created_date) {
		return 1
	}

	return 0
}

const sortExpired = (value1, value2) => {
	if (value1.expired < value2.expired) {
		return -1
	}

	if (value1.expired > value2.expired) {
		return 1
	}

	return 0
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const supplier = await prisma.supplier.findUnique({
		where: {
			id: Number(query.supplierId),
		}
	})
	const barangs = await prisma.barang.findMany({
		where: {
			product_name: {
				contains: query?.s ? String(query?.s) : ``,
				mode: `insensitive`
			},
			supplier_id: Number(query.supplierId)
		}
	})

	return {
		props: {
			supplier,
			barangs: barangs.sort(sortCreatedAt).sort(sortExpired)
		},
	}
}

export default function SupplierBarangsDetail({ supplier, barangs }) {
	const [ supplierData, setSupplierData ] = useState(supplier)
	const setForm = useForm()
	const router = useRouter()
	const { state, dispatch } = useContext(RootAppContext)
	const { register, getValues, setValue } = setForm
	const [ data, setData ] = useState([])
	const [ modal, setModal ] = useState(false)
	const [ changeStockPopup, setChangeStockPopup ] = useState(false)
	const [ editSupplier, setEditSupplier ] = useState(false)
	const [ selectedBarang, setSelectedBarang ] = useState(null)
	const [ toast, setToast ] = useState({
		visible: false,
		message: ``,
		type: `success`
	})

	const onSearchPress = async () => {
		dispatch({ type: `set_loading`, payload: true })
		const response = await fetcherGet(`/api/barang?s=${getValues(`searchProductName`)}`)
		setData(response.data.filter((item) => item.supplier_id === supplier.id).sort(sortCreatedAt).sort(sortExpired))
		dispatch({ type: `set_loading`, payload: false })
	}

	useEffect(() => {
		if (!barangs) {
			dispatch({ type: `set_loading`, payload: true })
		} else {
			setData(barangs)
			setValue(`supplier_name`, supplier.nama)
			dispatch({ type: `set_loading`, payload: false })
		}
	}, [ barangs ])

	const deleteSupplier = async () => {
		dispatch({ type: `set_loading`, payload: true })
		try {
			await fetcherDelete(`/api/supplier?id=${supplier.id}`)
			setModal(!modal)
		} catch (e) {
			console.log(e)
			setModal(!modal)
		}
		dispatch({ type: `set_loading`, payload: false })
		router.push(`/supplier`)
	}

	const onChangeStock = (barang: any) => {
		setChangeStockPopup(!changeStockPopup)
		setSelectedBarang(barang)
	}

	const handleChangeMinusStock = () => {
		if (selectedBarang.stock > 0) {
			setSelectedBarang({
				...selectedBarang,
				stock: selectedBarang.stock - 1
			})
		}
	}

	const handleChangePlusStock = () => {
		setSelectedBarang({
			...selectedBarang,
			stock: selectedBarang.stock + 1
		})
	}

	const handleChangeStock = async () => {
		try {
			await fetcherPut(`/api/barang?id=${selectedBarang.product_id}`, JSON.stringify(selectedBarang))
			await onSearchPress()
			setToast({
				...toast,
				visible: true,
				message: `Berhasil mengubah stock barang!`,
				type: `success`
			})
		} catch (e) {
			setToast({
				...toast,
				visible: true,
				message: `Gagal mengubah stock barang!`,
				type: `failed`
			})
		}
		setChangeStockPopup(!changeStockPopup)
		setSelectedBarang(null)
	}

	const handleSave = async () => {
		dispatch({ type: `set_loading`, payload: true })
		setEditSupplier(!editSupplier)
		try {
			await fetcherPut(`/api/supplier?id=${supplier.id}`, JSON.stringify({
				nama: getValues(`supplier_name`)
			}))
			setSupplierData({
				...supplierData,
				nama: getValues(`supplier_name`)
			})
			setToast({
				...toast,
				visible: true,
				message: `Berhasil mengubah nama supplier!`,
				type: `failed`
			})
		} catch (e) {
			setToast({
				...toast,
				visible: true,
				message: `Gagal mengubah nama supplier!`,
				type: `failed`
			})
		}
		dispatch({ type: `set_loading`, payload: false })
	}

	return (
		<div>
			<Header
				link={
					<>
						<Link href={`/supplier`} onClick={() => dispatch({ type: `set_loading`, payload: true })} passHref>Master Supplier</Link> / <p className="active">{supplierData?.nama}</p>
					</>}
				action={
					<>
						<button className="flex items-center rounded-sm justify-center font-semibold py-2 px-3 bg-amber-400" onClick={() => setEditSupplier(!editSupplier)} id="btnDelete">Ubah <HiPencil className="pl-1 text-2xl" /></button>
						<button className="button button-delete" onClick={() => setModal(!modal)} id="btnDelete" type="button">Hapus</button>
					</>
				}
			/>
			<section className="search-product">
				<div className="row">
					<div className="form-input">
						<input type="text" className="input" name="searchProductName" placeholder="Cari barang" { ...register(`searchProductName`) } />
						<button type="button" onClick={onSearchPress} className="button button-primary no-shadow">Cari <SlMagnifier className="icon" /></button>
					</div>
				</div>
			</section>
			<div className={`px-6 mx-auto ${state.loading ? `loading` : ``}`}>
				<div className="grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-1">
					{data.length > 0 && (
						data.map((barang, i) => <Card key={i} onChangeStock={onChangeStock} barang={barang} linkToPath={`/supplier/${supplier.id}`} />)
					)}
				</div>
			</div>

			{/* change stock modal */}
			<AnimatePresence>
				{changeStockPopup && (
					<motion.div
						className="fixed flex inset-0 items-center justify-center"
						style={{ backgroundColor: `rgba(200, 200, 200, 0.5)`, zIndex: 12 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { ease: `easeIn` } }}
						transition={{
							x: { duration: 0.2 },
							ease: `easeOut`
						}}
					>
						<div className="flex flex-col bg-white p-4 rounded-md">
							<div className="flex mb-5 items-center">
								<FaTimes className="text-xl" style={{ cursor: `pointer` }} onClick={() => setChangeStockPopup(!changeStockPopup)} />
								<p className="ml-8 text-xl font-bold">Atur Stok</p>
							</div>
							<div className="flex items-center">
								<p className="mr-20">Jumlah Stok</p>
								<div className="flex border items-center rounded-md disable-user-select">
									<div className="p-2 border-r pointer active:bg-amber-100" onClick={handleChangeMinusStock}>
										<FaMinus />
									</div>
									<p className="mx-7 font-medium disable-user-select">{selectedBarang && selectedBarang.stock}</p>
									<div className="p-2 border-l pointer active:bg-amber-100" onClick={handleChangePlusStock}>
										<FaPlus />
									</div>
								</div>
							</div>
							<div className="flex justify-center mt-10 mb-4 disable-user-select">
								<button className="text-white bg-cyan-700 w-9/12 font-medium p-1 rounded-sm" style={{ cursor: `pointer` }} onClick={handleChangeStock}>Simpan</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* edit supplier name modal */}
			<AnimatePresence>
				{editSupplier && (
					<motion.div
						className="fixed flex inset-0 items-center justify-center"
						style={{ backgroundColor: `rgba(200, 200, 200, 0.5)`, zIndex: 12 }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, transition: { ease: `easeIn` } }}
						transition={{
							x: { duration: 0.2 },
							ease: `easeOut`
						}}
					>
						<div className="flex flex-col bg-white p-4 rounded-md">
							<div className="flex mb-5 items-center">
								<FaTimes className="text-xl" style={{ cursor: `pointer` }} onClick={() => setEditSupplier(!editSupplier)} />
								<p className="ml-8 text-xl font-bold">Ubah Nama</p>
							</div>
							<div className="flex items-center">
								<p className="mr-4">Nama Supplier</p>
								<div className="flex items-center rounded-md disable-user-select w-96">
									<input type="text" className="w-full font-medium disable-user-select" {...register(`supplier_name`)} />
								</div>
							</div>
							<div className="flex justify-center mt-10 mb-4 disable-user-select">
								<button className="text-white bg-cyan-700 w-9/12 font-medium p-1 rounded-sm" style={{ cursor: `pointer` }} onClick={handleSave}>Simpan</button>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* delete supplier modal */}
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
							<button className="agree" type="button" name="delete" onClick={deleteSupplier}>Ya</button>
							<button className="cancel" onClick={() => setModal(!modal)} type="button">Tidak</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
			<Toast setClose={() => setToast({ ...toast, visible: false })} visible={toast.visible} message={toast.message} />
		</div>
	)
}