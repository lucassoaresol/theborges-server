export interface INotificationQueue {
  id: number;
  attempt_count: number;
  scheduled_time: string;
  message: string;
  client_id: string;
  chat_id: string;
}
