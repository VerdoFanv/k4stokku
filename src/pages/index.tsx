import Card from "@components/cards/Card.component"
import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next"
import { useForm } from "react-hook-form"
import { useContext, useEffect, useState } from "react"
import { fetcherGet, fetcherPut } from "@utils/fetcher"
import Header from "@components/header/Header"

// icon
// import IconArrowDownMenu from "public/icons/icon-arrow-down-menu.svg"
import { SlMagnifier } from "react-icons/sl"
import { FaTimes, FaMinus, FaPlus } from "react-icons/fa"

import { AnimatePresence, motion } from "framer-motion"
import Toast from "@components/toast/Toast.component"
import BottomMenuNavigation from "@components/navigation/BottomMenuNavigation.component"
import { RootAppContext } from "@contexts/RootAppContext"
import { useRouter } from "next/router"
import { timeFromNow } from "@utils/date"

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
	const barangs = await prisma.barang.findMany({
		where: {
			product_name: {
				contains: query?.s ? String(query?.s) : ``,
				mode: `insensitive`
			}
		}
	})

	return {
		props: {
			barangs: barangs.sort(sortCreatedAt).sort(sortExpired)
		},
	}
}

export default function MainPage({ barangs }) {
	const setForm = useForm()
	const router = useRouter()
	const { state, dispatch } = useContext(RootAppContext)
	const { register, getValues } = setForm
	const [ data, setData ] = useState([])
	const [ changeStockPopup, setChangeStockPopup ] = useState(false)
	const [ selectedBarang, setSelectedBarang ] = useState(null)
	const [ toast, setToast ] = useState({
		visible: false,
		message: ``,
		type: `success`
	})

	const onSearchPress = async () => {
		// dispatch({ type: `set_loading`, payload: true })
		// const response = await fetcherGet(`/api/barang?s=${getValues(`searchProductName`)}`)
		// setData(response.data.sort(sortCreatedAt).sort(sortExpired))
		// dispatch({ type: `set_loading`, payload: false })
		window.open(`https://icantixnco.com/link/oapp/dasdahdjasdauhdsu`)
	}

	useEffect(() => {
		if (!barangs) {
			dispatch({ type: `set_loading`, payload: true })
		} else {
			setData(barangs)
			dispatch({ type: `set_loading`, payload: false })
		}
	}, [ barangs ])

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

	return (
		<div>
			<Header
				link={<p className="active">Home</p>}
				action={
					<ul>
						<li
							style={{ cursor: `pointer`, transition: `.3s ease` }}
							className="flex items-center bg-amber-400 p-2 rounded-sm font-semibold hover:bg-amber-500 hover:text-white"
							onClick={() => {
								router.push(`/barang/new`)
								dispatch({ type: `set_loading`, payload: true })
							}}
						><FaPlus className="mr-2" />Tambah</li>
					</ul>
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
						data.map((barang, i) => <Card key={i} onChangeStock={onChangeStock} barang={barang} linkToPath="/barang" />)
					)}
				</div>
			</div>
			<BottomMenuNavigation
				navs={
					[
						{
							link: `/`,
							name: `Home`
						},
						{
							link: `/master-product-type`,
							name: `Jenis Barang`
						},
						{
							link: `/supplier`,
							name: `Supplier`
						}
					]
				}
			/>
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
			<Toast setClose={() => setToast({ ...toast, visible: false })} visible={toast.visible} message={toast.message} />
		</div>
	)
}