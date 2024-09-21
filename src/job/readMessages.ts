import { CronJob } from 'cron';

import ChatManager from '../models/chatManager.js';
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
      const chatManager = new ChatManager();
      const messageManager = new MessageManager(chatManager);
      await messageManager.read();
    } catch (error) {
      console.error('Erro durante a execução do job:', error);
    } finally {
      isRunningReadMessages = false;
    }
  },
  start: true,
});
