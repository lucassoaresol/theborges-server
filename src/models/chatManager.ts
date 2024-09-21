import { IChat } from '../interfaces/chat.js';

import Chat from './chat.js';
import ModelWPP from './modelWPP.js';

class ChatManager extends ModelWPP {
  private chats: Map<string, Chat> = new Map();

  public add(data: IChat): Chat {
    let chat = this.chats.get(data.id);

    if (!chat) {
      chat = new Chat(data.id, data.name, data.is_group, data.is_send);
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
}

export default ChatManager;
