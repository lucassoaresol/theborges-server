import { Client } from 'pg';
import Pool from 'pg-pool';

import { IDataDict } from '../interfaces/dataDict';

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
