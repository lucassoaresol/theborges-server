import { CronJob } from 'cron';

import { prismaClient } from '../libs/prismaClient.js';
import { VerifyBookingUseCase } from '../utils/VerifyBookingUseCase.js';

CronJob.from({
  cronTime: '* */10 * * * *',
  onTick: async () => {
    const bookings = await prismaClient.booking.findMany({
      where: { wasReminded: true },
      include: {
        client: true,
        services: { select: { service: true, price: true, order: true } },
      },
    });

    await Promise.all(
      bookings.map(async (data) => {
        const verify = new VerifyBookingUseCase();
        await verify.execute(data);
      }),
    );
  },
  start: true,
});
