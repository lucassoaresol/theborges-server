import dayLib from '../libs/dayjs';
import { prismaClient } from '../libs/prismaClient';

export async function verifyBooking() {
  const bookings = await prismaClient.booking.findMany({
    where: { status: 'CONFIRMED' },
  });

  const promises = bookings.map(async (el) => {
    const endTimeDay = dayLib(el.date)
      .startOf('day')
      .add(el.endTime, 'minutes');
    if (dayLib().diff(endTimeDay, 'h') >= 36) {
      await prismaClient.booking.update({
        where: { id: el.id },
        data: { status: 'COMPLETED' },
      });
    }
  });

  await Promise.all(promises);
}
