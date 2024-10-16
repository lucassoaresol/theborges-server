import { IChat } from '../interfaces/chat';
import { IClientWithBooking } from '../interfaces/client';

import Chat from './chat';
import ModelWPP from './modelWPP';

class ChatManager extends ModelWPP {
  private chats: Map<string, Chat> = new Map();

  public async add(data: IChat): Promise<Chat> {
    let chat = this.chats.get(data.id);
    let client = undefined;
    let booking = undefined;

    if (!chat) {
      const clientWithBooking = await this.getClientWithBooking(data.id);
      if (clientWithBooking) {
        client = clientWithBooking;
        if (clientWithBooking.booking_id) {
          booking = {
            id: clientWithBooking.booking_id,
            date: clientWithBooking.date,
            startTime: clientWithBooking.startTime,
            clientId: clientWithBooking.id,
            publicId: clientWithBooking.booking_public_id,
          };
        }
      }
      chat = new Chat(data.id, data.name, data.isGroup, client, booking);
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

  private async getClientWithBooking(
    id: string,
  ): Promise<IClientWithBooking | null> {
    const result = await this.pool.query(
      `WITH next_booking AS (SELECT b1.*,
      ROW_NUMBER() OVER (PARTITION BY b1."clientId"
      ORDER BY b1."date" ASC, b1."startTime" ASC) AS rn
      FROM bookings b1 WHERE b1.status = 'CONFIRMED')
      SELECT c.id, c."name", c."publicId", b.id AS booking_id,
      b."date", b."startTime", b."publicId" AS booking_public_id
      FROM clients c LEFT JOIN next_booking b ON b."clientId" = c.id AND b.rn = 1
      WHERE c.email = $1;`,
      [id],
    );
    if (result.rows.length > 0) {
      return result.rows[0] as IClientWithBooking;
    } else {
      return null;
    }
  }
}

export default ChatManager;
