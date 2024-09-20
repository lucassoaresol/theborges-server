import { CronJob } from 'cron';

import Database from '../db/pg.js';
import { IBooking } from '../interfaces/booking.js';
import { searchAll, verifyBooking } from '../utils/helperFunctions.js';

CronJob.from({
  cronTime: '* */10 * * * *',
  onTick: async () => {
    const pool = Database.getPool();
    const bookings = await searchAll<IBooking>(pool, 'bookings');

    await Promise.all(
      bookings.map(async (data) => {
        await verifyBooking(data);
      }),
    );
  },
  start: true,
});
