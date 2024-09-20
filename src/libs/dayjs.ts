import dayjs from 'dayjs';
import 'dayjs/locale/pt-br';
import isBetween from 'dayjs/plugin/isBetween.js';
import localizedFormat from 'dayjs/plugin/localizedFormat.js';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime.js';
import weekday from 'dayjs/plugin/weekday.js';

const dayLib = dayjs;

dayLib.locale('pt-br');
dayLib.extend(isBetween);
dayLib.extend(localizedFormat);
dayLib.extend(minMax);
dayLib.extend(relativeTime);
dayLib.extend(weekday);

export default dayLib;
