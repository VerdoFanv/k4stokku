import Header from "@components/header/Header"
import useCurrentPath from "@hooks/useCurrentPath"
import { PrismaClient } from "@prisma/client"
import { fetcherGet } from "@utils/fetcher"
import { GetServerSideProps } from "next"
import Link from "next/link"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { JenisBarangAttribute } from "src/types/barang"
import IconSearch from "public/icons/icon-search.svg"

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
	const { register, getValues } = setForm
	const { currentPath } = useCurrentPath()
	const [ data, setData ] = useState(jenisBarang)

	const onSearchPress = async () => {
		const response = await fetcherGet(`/api/jenisBarang?s=${getValues(`searchProductName`)}`)
		setData(response.data.sort(sortNama))
	}

	return (
		<form method="POST">
			<Header
				link={
					<>
						<Link href={`/`} passHref>Home</Link> / <p className="active">Master Jenis Barang</p>
					</>
				}
				navigation={
					<ul>
						<li>
							<Link href="/master-product-type/new" passHref>Tambah Master Jenis Barang</Link>
						</li>
					</ul>
				}
			/>
			<section className="search-product">
				<div className="row">
					<div className="form-input">
						<input type="text" className="input" name="searchProductName" placeholder="Cari jenis barang" { ...register(`searchProductName`) } />
						<button type="button" onClick={onSearchPress} className="button button-primary no-shadow">Cari <IconSearch className="icon" /></button>
					</div>
				</div>
			</section>
			<section className="master-data__section">
				<table className="master-data__table">
					<thead>
						<tr>
							<th style={{ textAlign: `center` }}>JENIS</th>
						</tr>
					</thead>
					<tbody>
						{data.map((item, i) => (
							<tr key={i}>
								<td style={{ textAlign: `center` }}><Link href={`${currentPath}/${item.id}`}>{item.nama}</Link></td>
							</tr>
						))}
					</tbody>
				</table>
			</section>
		</form>
	)
}
