export interface IMessageWithChat {
  id: string;
  from_me: boolean;
  chat_id: string;
  client_id: string;
  chat_name: string;
  chat_is_group: boolean;
}

export interface IMessage {
  id: string;
  fromMe: boolean;
  chatId: string;
  clientId: string;
}
