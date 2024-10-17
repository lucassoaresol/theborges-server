import { Client } from 'pg';
import Pool from 'pg-pool';

import { INotificationQueue } from '../interfaces/notificationQueue';
import { createMessage } from '../libs/axiosWPP';
import dayLib from '../libs/dayjs';
import { prismaClient } from '../libs/prismaClient';

import { searchByField } from './searchByField';
import { updateIntoTable } from './updateIntoTable';

export async function verifyNotificationQueueFailed(pool: Pool<Client>) {
  const notificationQueue = await searchByField<INotificationQueue>(
    pool,
    'notification_queue',
    'status',
    'FAILED',
    null,
    'scheduled_time',
  );

  const today = dayLib();

  const promises = notificationQueue.map(async (el) => {
    const seconds = dayLib(el.scheduled_time).diff(today, 'seconds');
    if (seconds <= 0) {
      try {
        await createMessage(el.client_id, {
          message: el.message,
          number: el.chat_id,
        });
        await updateIntoTable(pool, 'notification_queue', {
          id: el.id,
          status: 'SENT',
          sent_at: today.format('YYYY-MM-DD HH:mm:ss.SSS'),
        });
      } catch (error: any) {
        await prismaClient.notificationQueue.update({
          where: { id: el.id },
          data: { attemptCount: el.attempt_count + 1, error },
        });
      }
    }
  });

  await Promise.all(promises);
}
