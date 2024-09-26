import { IBookingData } from '../interfaces/booking.js';
import { IChat } from '../interfaces/chat.js';
import { IClient } from '../interfaces/client.js';

class Chat {
  constructor(
    private id: string,
    private name: string,
    private isGroup: boolean,
    private client?: IClient,
    private booking?: IBookingData,
  ) {}

  public getData(): IChat {
    return {
      id: this.id,
      name: this.name,
      isGroup: this.isGroup,
    };
  }

  public getClient(): IClient | undefined {
    return this.client;
  }

  public getBooking(): IBookingData | undefined {
    return this.booking;
  }
}

export default Chat;
