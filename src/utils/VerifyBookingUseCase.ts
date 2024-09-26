import { IBooking } from '../interfaces/booking';
import { createMessage } from '../libs/axiosWPP';
import dayLib from '../libs/dayjs';
import { prismaClient } from '../libs/prismaClient';

import { capitalizeFirstName } from './capitalizeFirstName';

export class VerifyBookingUseCase {
  async execute(booking: IBooking) {
    const startDateTime = dayLib(booking.date)
      .startOf('day')
      .add(booking.startTime, 'm');

    const minutes = startDateTime.diff(dayLib(), 'minutes');

    if (minutes <= 30) {
      const customerName = capitalizeFirstName(booking.client.name.trim());
      const hour = startDateTime.format('HH:mm');

      let totalPrice = 0;

      booking.services.forEach((service) => {
        totalPrice += service.price;
      });

      const value = totalPrice.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      });

      const message = await this.generateDbMsg(
        customerName,
        String(minutes),
        hour,
        value,
      );

      const data = {
        number: booking.client.email,
        message,
      };

      await Promise.all([
        createMessage(data),
        prismaClient.booking.update({
          data: { wasReminded: false },
          where: { id: booking.id },
        }),
      ]);

      await createMessage({ ...data, message: '⬇️ PIX ⬇️' });
      await createMessage({ ...data, message: '32.665.968/0001-23' });
    }
  }

  private async generateDbMsg(
    customerName: string,
    minutes: string,
    hour: string,
    value: string,
  ): Promise<string> {
    const objFormat = {
      nome_cliente: customerName,
      minutes,
      hour,
      value,
    };

    let template = '';

    const resultTemplate = await prismaClient.messageTemplate.findUnique({
      where: { name: 'REMEMBER_BOOKING' },
    });

    if (resultTemplate) {
      template = resultTemplate.body.replace(
        /{(\w+)}/g,
        (_, match: keyof typeof objFormat) => {
          return objFormat[match] || '';
        },
      );
    }

    return template.replace(/\\n/g, '\n');
  }
}
