import { Client } from 'pg';
import Pool from 'pg-pool';

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
