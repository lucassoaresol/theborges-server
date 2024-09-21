import { IChat } from '../interfaces/chat.js';
import { IClient } from '../interfaces/client.js';
import { searchUniqueByField } from '../utils/searchUniqueByField.js';

import Chat from './chat.js';
import ModelWPP from './modelWPP.js';

class ChatManager extends ModelWPP {
  private chats: Map<string, Chat> = new Map();

  public async add(data: IChat): Promise<Chat> {
    let chat = this.chats.get(data.id);

    if (!chat) {
      const client = await this.getClient(data.id);
      chat = new Chat(data.id, data.name, data.is_group, data.is_send, client);
      this.chats.set(data.id, chat);
    }
    return chat;
  }

  public get(id: string): Chat | undefined {
    const chat = this.chats.get(id);
    if (chat) {
      return chat;
    }
  }

  private async getClient(id: string): Promise<IClient | null> {
    const client = await searchUniqueByField<IClient>(
      this.pool,
      'clients',
      'email',
      id,
    );
    return client;
  }
}

export default ChatManager;
