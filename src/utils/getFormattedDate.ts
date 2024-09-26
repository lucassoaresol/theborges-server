import { Dayjs } from 'dayjs';

import dayLib from '../libs/dayjs';

export function getFormattedDate(startDateTime: Dayjs): string {
  const now = dayLib();

  if (startDateTime.isSame(now, 'day')) {
    return `hoje às ${startDateTime.format('HH:mm')}`;
  } else if (startDateTime.isSame(now.add(1, 'day'), 'day')) {
    return `amanhã às ${startDateTime.format('HH:mm')}`;
  } else if (startDateTime.diff(now, 'day') <= 6) {
    return `${startDateTime.format('dddd')} às ${startDateTime.format('HH:mm')}`;
  } else {
    return `${startDateTime.format('llll')}`;
  }
}
