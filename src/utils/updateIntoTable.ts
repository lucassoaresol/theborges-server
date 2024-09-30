import { Client } from 'pg';
import Pool from 'pg-pool';

import { IDataDict } from '../interfaces/dataDict';

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
