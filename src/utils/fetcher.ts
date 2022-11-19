const initHeadersWithJSON = () => {
	const headers = new Headers()
	headers.append(`Accept`, `application/json`)
	headers.append(`Content-Type`, `application/json`)

	return headers
}

const initHeaders = () => {
	const headers = new Headers()
	headers.append(`Accept`, `application/json`)

	return headers
}

type FetchAPIProp = {
	url: string
	body?: any
	method?: string
	headers?: Headers
}

export const fetchAPI = async ({ url, body, method = `GET`, headers }: FetchAPIProp) => {
	return fetch(url, {
		method,
		headers,
		body
	})
}

export const fetcherPost = async (path: string, body?: any) => {
	const response = await fetchAPI({
		url: `${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
		method: `POST`,
		headers: initHeadersWithJSON(),
		body
	})

	try {
		const responseJSON = await response.json()
		return responseJSON
	} catch (error) {
		throw new Error(error.message)
	}
}

export const fetcherDelete = async (path: string, body?: any) => {
	const response = await fetchAPI({
		url: `${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
		method: `DELETE`,
		headers: initHeadersWithJSON(),
		body
	})

	try {
		const responseJSON = await response.json()
		return responseJSON
	} catch (error) {
		throw new Error(error.message)
	}
}

export const fetcherPostWithFormData = async (path: string, body?: any) => {
	const response = await fetchAPI({
		url: `${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
		method: `POST`,
		headers: initHeaders(),
		body
	})

	try {
		const responseJSON = await response.json()
		return responseJSON
	} catch (error) {
		throw new Error(error.message)
	}
}

export const fetcherPut = async (path: string, body?: any) => {
	const response = await fetchAPI({
		url: `${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
		method: `PUT`,
		headers: initHeadersWithJSON(),
		body
	})

	try {
		const responseJSON = await response.json()
		return responseJSON
	} catch (error) {
		throw new Error(error.message)
	}
}

export const fetcherGet = async (path) => {
	const response = await fetchAPI({
		url: `${process.env.NEXT_PUBLIC_BASE_URL}${path}`,
		headers: initHeadersWithJSON()
	})

	try {
		const responseJSON = await response.json()
		return responseJSON
	} catch (error) {
		throw new Error(error.message)
	}
}

export function buildFormData(formData: FormData, data: any, parentKey?: string) {
	if (data && typeof data === `object` && !(data instanceof Date) && !(data instanceof File)) {
		Object.keys(data).forEach(key => {
			buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key)
		})
	} else {
		const value = data == null ? `` : data
		formData.append(parentKey, value)
	}
}

export async function postFormData(path: string, data: any) {
	const formData = new FormData()
	if (data !== ``) {
		buildFormData(formData, data)
		const response = await fetcherPostWithFormData(path, formData)

		if (response.status === false) {
			throw new Error(response.message)
		}

		return response
	} else {
		throw new Error(`No data being submitted.`)
	}
}