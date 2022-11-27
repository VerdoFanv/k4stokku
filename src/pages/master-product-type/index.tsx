import Header from "@components/header/Header"
import useCurrentPath from "@hooks/useCurrentPath"
import { PrismaClient } from "@prisma/client"
import { fetcherGet } from "@utils/fetcher"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useContext, useState } from "react"
import { useForm } from "react-hook-form"
import { JenisBarangAttribute } from "src/types/barang"

// icon
// import IconArrowDownMenu from "public/icons/icon-arrow-down-menu.svg"
import { SlMagnifier } from "react-icons/sl"
import { FaPlus } from "react-icons/fa"
import BottomMenuNavigation from "@components/navigation/BottomMenuNavigation.component"
import Site from "@components/Site.component"
import { RootAppContext } from "@contexts/RootAppContext"
import { useRouter } from "next/router"

const sortNama = (value1, value2) => {
	if (value1.nama < value2.nama) {
		return -1
	}

	if (value1.nama > value2.nama) {
		return 1
	}

	return 0
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
	const prisma = new PrismaClient()
	const jenisBarang = await prisma.jenisBarang.findMany({
		where: {
			nama: {
				contains: query?.s ? String(query?.s) : ``,
				mode: `insensitive`
			}
		}
	})

	return {
		props: {
			jenisBarang: jenisBarang.sort(sortNama)
		},
	}
}

export default function MasterProductType({ jenisBarang }: { jenisBarang: JenisBarangAttribute[] }) {
	const setForm = useForm()
	const router = useRouter()
	const { dispatch } = useContext(RootAppContext)
	const { register, getValues } = setForm
	const { currentPath } = useCurrentPath()
	const [ data, setData ] = useState(jenisBarang)

	const onSearchPress = async () => {
		dispatch({ type: `set_loading`, payload: true })
		const response = await fetcherGet(`/api/jenisBarang?s=${getValues(`searchProductName`)}`)
		setData(response.data.sort(sortNama))
		dispatch({ type: `set_loading`, payload: false })
	}

	return (
		<form method="POST">
			<Header
				link={
					<>
						<p className="active">Master Jenis Barang</p>
					</>
				}
				action={
					<ul>
						<li
							style={{ cursor: `pointer`, transition: `.3s ease` }}
							className="flex items-center bg-amber-400 p-2 rounded-sm font-semibold hover:bg-amber-500 hover:text-white"
							onClick={() => {
								dispatch({ type: `set_loading`, payload: true })
								router.push(`/master-product-type/new`)
							}}
						><FaPlus className="mr-2" />Tambah</li>
					</ul>
				}
			/>
			<section className="search-product">
				<div className="row">
					<div className="form-input">
						<input type="text" className="input" name="searchProductName" placeholder="Cari jenis barang" { ...register(`searchProductName`) } />
						<button type="button" onClick={onSearchPress} className="button button-primary no-shadow">Cari <SlMagnifier className="icon" /></button>
					</div>
				</div>
			</section>
			<section className="flex justify-center mt-10">
				<table>
					{/* <thead>
						<tr>
							<th style={{ textAlign: `center` }}>JENIS</th>
						</tr>
					</thead> */}
					<tbody>
						{data.map((item, i) => (
							<tr key={i} className="bg-gray-300 border-black">
								<td style={{ textAlign: `center` }} className="px-72 py-2"><Link href={`${currentPath}/${item.id}`} onClick={() => dispatch({ type: `set_loading`, payload: true })} className="text-black font-medium">{item.nama}</Link></td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
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
		</form>
	)
}

MasterProductType.getLayout = function getLayout(page) {
	return <Site>{page}</Site>
}
