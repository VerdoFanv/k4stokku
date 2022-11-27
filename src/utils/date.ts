import dayjs from 'dayjs'
import LocalizeFormat from 'dayjs/plugin/localizedFormat'
import Id from 'dayjs/locale/id'
import relativeTime from "dayjs/plugin/relativeTime"

dayjs.extend(relativeTime)
dayjs.locale(Id)
dayjs.extend(LocalizeFormat)

export function formatDate(date, token = `yyyy-mm-dd`) {
	return dayjs(date).format(token)
}

export function parseDate(date) {
	return dayjs(date).toDate()
}

export function timeFromNow(date) {
	return dayjs(date).fromNow()
}