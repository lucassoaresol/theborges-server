import { CronJob } from 'cron';

import Database from '../db/pg';
import { verifyNotificationQueue } from '../utils/verifyNotificationQueue';

let isRunningVerifyNotificationQueue = false;
CronJob.from({
  cronTime: '*/3 * * * * *',
  onTick: async () => {
    if (isRunningVerifyNotificationQueue) {
      console.log('Job já está em execução, ignorando a nova execução.');
      return;
    }
    isRunningVerifyNotificationQueue = true;
    try {
      const pool = Database.getPool();
      await verifyNotificationQueue(pool);
    } catch (error) {
      console.error('Erro durante a execução do job:', error);
    } finally {
      isRunningVerifyNotificationQueue = false;
    }
  },
  start: true,
});
