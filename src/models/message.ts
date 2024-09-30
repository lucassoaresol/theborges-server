import { createMessage } from '../libs/axiosWPP.js';
import dayLib from '../libs/dayjs.js';
import { capitalizeFirstName } from '../utils/capitalizeFirstName.js';
import { generateDbMsg } from '../utils/generateDbMsg.js';
import { getFormattedDate } from '../utils/getFormattedDate.js';
import { saudacao, validatePhoneNumber } from '../utils/helperFunctions.js';
import { updateIntoTable } from '../utils/updateIntoTable.js';

import Chat from './chat.js';
import ModelWPP from './modelWPP.js';

class Message extends ModelWPP {
  constructor(
    private id: string,
    private fromMe: boolean,
    private chatId: string,
    private clientId: string,
    private chat: Chat,
  ) {
    super();
  }

  private async read() {
    await updateIntoTable(this.poolWPP, 'messages', {
      id: this.id,
      is_new: false,
    });
  }

  private async sendAndGenerateMSG() {
    let message = '';
    const chat = this.chat.getData();
    const client = this.chat.getClient();
    const salute = saudacao(dayLib().toDate());
    const link = 'https://agendar.barbearia.theborges.nom.br';
    const baseDict = { salute, link_site: link };

    if (!chat.isGroup) {
      if (client) {
        const booking = this.chat.getBooking();
        if (booking) {
          const startDateTime = dayLib(booking.date)
            .startOf('day')
            .add(booking.startTime, 'm');
          message = await generateDbMsg(this.pool, 'WPP_INBOX_BOOKING', {
            ...baseDict,
            nome_cliente: capitalizeFirstName(client.name),
            data: getFormattedDate(startDateTime),
            link_site: `${link}/${booking.publicId}`,
          });
        } else {
          message = await generateDbMsg(this.pool, 'WPP_INBOX_NAME', {
            ...baseDict,
            nome_cliente: capitalizeFirstName(client.name),
            link_site: `${link}/c/${client.publicId}`,
          });
        }
      } else if (chat.name.length > 2 && !validatePhoneNumber(chat.name)) {
        message = await generateDbMsg(this.pool, 'WPP_INBOX_NAME', {
          ...baseDict,
          nome_cliente: chat.name,
        });
      } else {
        message = await generateDbMsg(this.pool, 'WPP_INBOX', baseDict);
      }
      await createMessage(String(process.env.CLIENT_ID), {
        message,
        number: chat.id,
      });
    }
  }

  public async salute() {
    if (!this.fromMe) {
      const resultOldMessage = await this.poolWPP.query(
        `SELECT created_at FROM messages WHERE is_new = false
        AND chat_id = $1 AND client_id = $2
        ORDER BY created_at DESC;`,
        [this.chatId, this.clientId],
      );

      if (resultOldMessage.rowCount) {
        const oldMessage = resultOldMessage.rows[0] as { created_at: Date };
        if (dayLib().diff(oldMessage.created_at, 'h') >= 24)
          await this.sendAndGenerateMSG();
      } else {
        await this.sendAndGenerateMSG();
      }
    }
    await this.read();
  }
}

export default Message;
