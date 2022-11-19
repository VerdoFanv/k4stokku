import dayjs from 'dayjs'
import LocalizeFormat from 'dayjs/plugin/localizedFormat'
import Id from 'dayjs/locale/id'

dayjs.locale(Id)
dayjs.extend(LocalizeFormat)

export function formatDate(date, token = `yyyy-mm-dd`) {
	return dayjs(date).format(token)
}

export function parseDate(date) {
	return dayjs(date).toDate()
}
