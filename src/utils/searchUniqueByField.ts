import { Client } from 'pg';
import Pool from 'pg-pool';

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
