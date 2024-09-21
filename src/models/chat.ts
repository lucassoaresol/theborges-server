import { IChat } from '../interfaces/chat.js';
import { IClient } from '../interfaces/client.js';

class Chat {
  constructor(
    private id: string,
    private name: string,
    private is_group: boolean,
    private is_send = false,
    private client: IClient | null,
  ) { }

  public getData(): IChat {
    return {
      id: this.id,
      is_group: this.is_group,
      name: this.name,
      is_send: this.is_send,
    };
  }

  public setIsSend(isSend: boolean): void {
    this.is_send = isSend;
  }

  public getClient(): IClient | null {
    return this.client;
  }
}

export default Chat;
