import { CronJob } from 'cron';

import Database from '../db/pg';
import { verifyNotificationQueue } from '../utils/verifyNotificationQueue';

let isRunningVerifyNotificationQueue = false;
CronJob.from({
  cronTime: '*/3 * * * * *',
  onTick: async () => {
    console.log(
      `[${new Date().toISOString()}] Iniciando verificação da fila de notificações...`,
    );

    if (isRunningVerifyNotificationQueue) {
      console.warn(
        `[${new Date().toISOString()}] O job de verificação da fila de notificações já está em execução. Ignorando nova execução.`,
      );
      return;
    }

    isRunningVerifyNotificationQueue = true;

    try {
      console.log(
        `[${new Date().toISOString()}] Obtendo conexão com o pool de banco de dados...`,
      );
      const pool = Database.getPool();

      console.log(
        `[${new Date().toISOString()}] Verificando a fila de notificações...`,
      );
      await verifyNotificationQueue(pool);

      console.log(
        `[${new Date().toISOString()}] Verificação da fila de notificações concluída com sucesso.`,
      );
    } catch (error) {
      console.error(
        `[${new Date().toISOString()}] Erro durante a execução do job de verificação da fila de notificações:`,
        error,
      );
    } finally {
      isRunningVerifyNotificationQueue = false;
      console.log(
        `[${new Date().toISOString()}] Finalizando o job de verificação da fila de notificações.`,
      );
    }
  },
  start: true,
});
