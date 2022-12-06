export default async function handler({}, res) {
	const myHeaders = new Headers()
	myHeaders.append(`X-Session-ID`, `22f7af2e-1016-4c26-911f-91dd48b69c3b`)
	myHeaders.append(`Authorization`, `Bearer 8b9f1e47-3f48-47bc-87f0-ab9f3aecd515`)

	const requestOptions = {
		method: `GET`,
		headers: myHeaders,
	}

	try {
		const result = await fetch(`https://public.accurate.id/accurate/api/tax/list.do`, requestOptions)
		return res.status(200).json({
			status: `Success`,
			data: result
		})
	} catch (e) {
		return res.status(400).json({
			status: `Success`,
			data: e
		})
	}
}