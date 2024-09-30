import { CronJob } from 'cron';

import Database from '../db/pg';
import { verifyNotificationQueueFailed } from '../utils/verifyNotificationQueueFailed';

let isRunningVerifyNotificationQueueFailed = false;
CronJob.from({
  cronTime: '*/20 * * * * *',
  onTick: async () => {
    if (isRunningVerifyNotificationQueueFailed) {
      console.log('Job já está em execução, ignorando a nova execução.');
      return;
    }
    isRunningVerifyNotificationQueueFailed = true;
    try {
      const pool = Database.getPool();
      await verifyNotificationQueueFailed(pool);
    } catch (error) {
      console.error('Erro durante a execução do job:', error);
    } finally {
      isRunningVerifyNotificationQueueFailed = false;
    }
  },
  start: true,
});
