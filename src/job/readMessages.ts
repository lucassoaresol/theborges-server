import { CronJob } from 'cron';

import ChatManager from '../models/chatManager';
import MessageManager from '../models/messageManager';

let isRunningReadMessages = false;
CronJob.from({
  cronTime: '*/5 * * * * *',
  onTick: async () => {
    console.log(
      `[${new Date().toISOString()}] Iniciando o job de leitura de mensagens...`,
    );

    if (isRunningReadMessages) {
      console.warn(
        `[${new Date().toISOString()}] O job de leitura de mensagens já está em execução. Ignorando nova execução.`,
      );
      return;
    }

    isRunningReadMessages = true;

    try {
      const chatManager = new ChatManager();
      const messageManager = new MessageManager(chatManager);

      console.log(
        `[${new Date().toISOString()}] Executando leitura de mensagens...`,
      );
      await messageManager.read();

      console.log(
        `[${new Date().toISOString()}] Leitura de mensagens concluída com sucesso.`,
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Erro ao executar o job de leitura de mensagens:`,
        error,
      );
    } finally {
      isRunningReadMessages = false;
    }
  },
  start: true,
});
