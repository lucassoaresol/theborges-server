import { CronJob } from 'cron';

import MessageManager from '../models/messageManager.js';

let isRunningReadMessages = false;
CronJob.from({
  cronTime: '*/10 * * * * *',
  onTick: async () => {
    if (isRunningReadMessages) {
      console.log('Job já está em execução, ignorando a nova execução.');
      return;
    }
    isRunningReadMessages = true;
    try {
      const messageManager = new MessageManager();
      await messageManager.read();
    } catch (error) {
      console.error('Erro durante a execução do job:', error);
    } finally {
      isRunningReadMessages = false;
    }
  },
  start: true,
});
