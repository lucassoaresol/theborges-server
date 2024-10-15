import { IMessageWithChat } from '../interfaces/message';

import ChatManager from './chatManager';
import Message from './message';
import ModelWPP from './modelWPP';

class MessageManager extends ModelWPP {
  private messages: Map<string, Message> = new Map();

  constructor(private chats: ChatManager) {
    super();
  }

  private async addMessage(data: IMessageWithChat) {
    const chat = await this.chats.add({
      id: data.chat_id,
      name: data.chat_name,
      isGroup: data.chat_is_group,
    });

    let message = this.messages.get(data.id);

    if (!message) {
      message = new Message(
        data.id,
        data.from_me,
        data.chat_id,
        data.client_id,
        chat,
      );
      this.messages.set(data.id, message);
    }

    await message.salute();
  }

  private async addMessageArray(messages: IMessageWithChat[]) {
    await Promise.all(
      messages.map(async (data) => {
        await this.addMessage(data);
        console.log(`Message with ID ${data.id} has been added and started.`);
      }),
    );
  }

  public async read() {
    try {
      const resultMessages = (
        await this.poolWPP.query<IMessageWithChat>(
          `SELECT DISTINCT ON (m.chat_id)
          m.chat_id, m.id, m.from_me,
          m.client_id, c.name AS chat_name,
          c.is_group AS chat_is_group
          FROM messages m
          JOIN chats c ON c.id = m.chat_id
          WHERE m.is_new = true
          AND m.client_id = $1
          ORDER BY m.chat_id, m.created_at;`,
          [process.env.CLIENT_ID],
        )
      ).rows;

      await this.addMessageArray(resultMessages);
    } catch (error) {
      console.error('Error loading processes from database:', error);
    }
  }
}

export default MessageManager;
