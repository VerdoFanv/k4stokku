import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function handler({ method, query, body }, res) {
	if (method === `GET`) {
		const barangs = await prisma.barang.findMany({
			where: {
				product_name: {
					contains: query.s ? String(query.s) : ``,
					mode: `insensitive`,
				},
			},
			// orderBy: {
			// 	updated_date: `asc`
			// }
		})

		return res.status(200).json({ data: barangs })
	}

	if (method === `POST`) {
		const dateNow = new Date().toISOString()
		const barang = await prisma.barang.create({
			data: {
				...body,
				created_date: dateNow,
				updated_date: dateNow
			}
		})

		return res.status(200).json({
			status: `Success`,
			data: { barang }
		})
	}

	if (method === `DELETE`) {
		await prisma.barang.delete({
			where: {
				product_id: Number(query.id),
			}
		})

		return res.status(200).json({
			status: `Success`,
		})
	}

	if (method === `PUT`) {
		const barang = await prisma.barang.update({
			where: {
				product_id: Number(query.id)
			},
			data: body
		})

		return res.status(200).json({
			status: `Success`,
			data: { barang }
		})
	}
}