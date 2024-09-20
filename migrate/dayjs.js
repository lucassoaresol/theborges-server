import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
import localizedFormat from 'dayjs/plugin/localizedFormat.js'
import relativeTime from 'dayjs/plugin/relativeTime.js'
import weekday from 'dayjs/plugin/weekday.js'
import 'dayjs/locale/pt-br.js'

const dayLib = dayjs

dayLib.locale('pt-br')
dayLib.extend(isBetween)
dayLib.extend(localizedFormat)
dayLib.extend(relativeTime)
dayLib.extend(weekday)

export default dayLib
