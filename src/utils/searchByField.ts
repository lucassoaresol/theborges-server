import { Client } from 'pg';
import Pool from 'pg-pool';

export async function searchByField<T>(
  client: Pool<Client>,
  table: string,
  field: string,
  value: any,
  fields: string[] | null = null,
  orderBy: string | null = null,
  orderDirection: 'ASC' | 'DESC' | null = 'ASC',
): Promise<T[]> {
  let query: string;

  if (fields && fields.length > 0) {
    if (fields.length === 1) {
      query = `
        SELECT ${fields[0]}
        FROM ${table}
        WHERE ${field} = $1
      `;
    } else {
      const selectedFields = fields.join(', ');
      query = `
        SELECT ${selectedFields}
        FROM ${table}
        WHERE ${field} = $1
      `;
    }
  } else {
    query = `
      SELECT *
      FROM ${table}
      WHERE ${field} = $1
    `;
  }

  if (orderBy) {
    query += ` ORDER BY ${orderBy} ${orderDirection}`;
  }

  const result = await client.query(query, [value]);
  return result.rows as T[];
}
