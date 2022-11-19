import Card from "@components/cards/Card.component"
import { PrismaClient } from "@prisma/client"
import { GetServerSideProps } from "next"
import { useForm } from "react-hook-form"
import Link from "next/link"
import { useEffect, useState } from "react"
import { fetcherGet } from "@utils/fetcher"
import Header from "@components/header/Header"
import IconSearch from "public/icons/icon-search.svg"

const prisma = new PrismaClient()

export default function MainPage({ barangs }) {
	const setForm = useForm()
	const { register, getValues } = setForm
	const [ data, setData ] = useState([])
	const [ loading, setLoading ] = useState(true)

	const onSearchPress = async () => {
		setLoading(true)
		const response = await fetcherGet(`/api/barang?s=${getValues(`searchProductName`)}`)
		setData(response.data)
		setLoading(false)
	}

	useEffect(() => {
		setData(barangs)
		setLoading(false)
	}, [ barangs ])

	return (
		<form>
			<Header
				link={<p className="active">Home</p>}
				navigation={
					<ul>
						<li><Link href="/barang/new" passHref>Tambah Barang</Link></li>
						<span className="separator"></span>
						<li><Link href="/master-product-type" passHref>Master Jenis barang</Link></li>
					</ul>
				}
			/>
			<section className="search-product">
				<div className="row">
					<div className="form-input">
						<input type="text" className="input" name="searchProductName" placeholder="Cari barang" { ...register(`searchProductName`) } />
						<button type="button" onClick={onSearchPress} className="button button-primary no-shadow">Cari <IconSearch className="icon" /></button>
					</div>
				</div>
			</section>
			<div className={`barang ${loading ? `loading` : ``}`}>
				<div className="barang-inner">
					{data.length > 0 && (
						data.map((barang, i) => <Card key={i} barang={barang} />)
					)}
				</div>
			</div>
		</form>
	)
}

MainPage.getLayout = function getLayout(page) {
	return page
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
			barangs
		},
	}
}
