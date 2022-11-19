import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export default async function handler({ query, method, body }, res) {
	if (method === `POST`) {
		await prisma.jenisBarang.create({
			data: body
		})

		return res.status(201).json({
			status: `success`
		})
	}

	if (method === `GET`) {
		const jenisBarang = await prisma.jenisBarang.findMany({
			where: {
				nama: {
					contains: query.s ? String(query.s) : ``,
					mode: `insensitive`,
				},
			},
		})

		return res.status(200).json({ data: jenisBarang })
	}

	if (method === `PUT`) {
		await prisma.jenisBarang.update({
			where: {
				id: Number(query.id)
			},
			data: body
		})

		return res.status(200).json({
			status: `success`,
		})
	}

	if (method === `DELETE`) {
		await prisma.jenisBarang.delete({
			where: {
				id: Number(query.id)
			}
		})

		return res.status(200).json({
			status: `success`
		})
	}
}