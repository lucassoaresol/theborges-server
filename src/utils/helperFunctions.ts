/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from 'pg';
import Pool from 'pg-pool';

import Database from '../db/pg';
import { IBooking } from '../interfaces/booking';
import { createMessage } from '../libs/axiosWPP';
import dayLib from '../libs/dayjs';

interface IDataDict {
  [key: string]: any;
}

export async function insertIntoTable(
  client: Pool<Client>,
  tableName: string,
  dataDict: IDataDict,
): Promise<number | string> {
  const columns = Object.keys(dataDict);
  const values = columns.map((col) => dataDict[col]);

  const placeholders = columns.map((_, index) => `$${index + 1}`).join(', ');

  const query = `
    INSERT INTO ${tableName} (${columns.join(', ')})
    VALUES (${placeholders})
    RETURNING id;
  `;

  const result = await client.query(query, values);

  return result.rows[0].id;
}

export async function updateIntoTable(
  client: Pool<Client>,
  tableName: string,
  dataDict: IDataDict,
): Promise<void> {
  const columns = Object.keys(dataDict).filter((key) => key !== 'id');
  const values = columns.map((col) => dataDict[col]);

  const setClause = columns
    .map((col, index) => `${col} = $${index + 1}`)
    .join(', ');

  const query = `
    UPDATE ${tableName}
    SET ${setClause}
    WHERE id = $${columns.length + 1};
  `;

  await client.query(query, [...values, dataDict.id]);
}

export async function searchAll<T>(
  client: Pool<Client>,
  table: string,
  fields: string[] | null = null,
): Promise<T[]> {
  let query: string;

  if (fields && fields.length > 0) {
    if (fields.length === 1) {
      query = `
        SELECT ${fields[0]}
        FROM ${table};
      `;
    } else {
      const selectedFields = fields.join(', ');
      query = `
        SELECT ${selectedFields}
        FROM ${table};
      `;
    }
  } else {
    query = `
      SELECT *
      FROM ${table};
    `;
  }

  const result = await client.query(query);
  return result.rows as T[];
}

export async function searchByField<T>(
  client: Pool<Client>,
  table: string,
  field: string,
  value: any,
  fields: string[] | null = null,
): Promise<T[]> {
  let query: string;

  if (fields && fields.length > 0) {
    if (fields.length === 1) {
      query = `
        SELECT ${fields[0]}
        FROM ${table}
        WHERE ${field} = $1;
      `;
    } else {
      const selectedFields = fields.join(', ');
      query = `
        SELECT ${selectedFields}
        FROM ${table}
        WHERE ${field} = $1;
      `;
    }
  } else {
    query = `
      SELECT *
      FROM ${table}
      WHERE ${field} = $1;
    `;
  }

  const result = await client.query(query, [value]);
  return result.rows as T[];
}

export async function searchUniqueByField<T>(
  client: Pool<Client>,
  table: string,
  field: string,
  value: any,
  fields: string[] | null = null,
): Promise<T | null> {
  let query: string;

  if (fields && fields.length > 0) {
    if (fields.length === 1) {
      query = `
        SELECT ${fields[0]}
        FROM ${table}
        WHERE ${field} = $1
        LIMIT 1;
      `;
    } else {
      const selectedFields = fields.join(', ');
      query = `
        SELECT ${selectedFields}
        FROM ${table}
        WHERE ${field} = $1
        LIMIT 1;
      `;
    }
  } else {
    query = `
      SELECT *
      FROM ${table}
      WHERE ${field} = $1
      LIMIT 1;
    `;
  }

  const result = await client.query(query, [value]);

  if (result.rows.length > 0) {
    return result.rows[0] as T;
  } else {
    return null;
  }
}

export function saudacao(dt: Date): string {
  const horaAtual = dt.getHours();
  if (horaAtual >= 5 && horaAtual < 12) {
    return 'Bom dia';
  } else if (horaAtual >= 12 && horaAtual < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
}

export function validatePhoneNumber(phoneNumber: string): boolean {
  const phoneRegex =
    /\+?\d{1,3}?[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}|\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/;
  return phoneRegex.test(phoneNumber);
}

export async function generateDbMsg(
  client: Pool<Client>,
  key: string,
  objFormat?: IDataDict,
): Promise<string> {
  let template = '';
  const resultTemplate = await searchUniqueByField<{ value: string }>(
    client,
    'generic_storages_value',
    'key',
    key,
    ['value'],
  );
  if (resultTemplate) {
    if (objFormat) {
      template = resultTemplate.value.replace(/{(\w+)}/g, (_, match) => {
        return objFormat[match] || '';
      });
    } else {
      template = resultTemplate.value;
    }
  }

  return template.replace(/\\n/g, '\n');
}

export async function verifyBooking({
  id,
  chat_id,
  client,
  time,
  value,
}: IBooking) {
  const pool = Database.getPool();

  const dayTime = dayLib(time);

  if (dayTime.diff(dayLib(), 'minutes') <= 30) {
    const minutes = dayTime.fromNow().match(/\d+/);
    const hour = dayTime.format('HH:mm');

    const message = await generateDbMsg(pool, 'REMEMBER_BOOKING', {
      nome_cliente: client,
      minutes,
      hour,
      value: Number(value).toFixed(2).replace('.', ','),
    });

    const postData = {
      number: chat_id,
      message,
    };

    await Promise.all([
      createMessage(postData),
      pool.query('DELETE FROM bookings WHERE id = $1;', [id]),
    ]);
    await createMessage({ number: chat_id, message: '⬇️ PIX ⬇️' });
    await createMessage({ number: chat_id, message: '32.665.968/0001-23' });
  }
}
