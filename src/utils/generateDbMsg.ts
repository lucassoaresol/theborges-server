import { Client } from 'pg';
import Pool from 'pg-pool';

import { IDataDict } from '../interfaces/dataDict';

import { searchUniqueByField } from './searchUniqueByField';

export async function generateDbMsg(
  client: Pool<Client>,
  key: string,
  objFormat?: IDataDict,
): Promise<string> {
  let template = '';
  const resultTemplate = await searchUniqueByField<{ body: string }>(
    client,
    'message_templates',
    'name',
    key,
    ['body'],
  );
  if (resultTemplate) {
    if (objFormat) {
      template = resultTemplate.body.replace(/{(\w+)}/g, (_, match) => {
        return objFormat[match] || '';
      });
    } else {
      template = resultTemplate.body;
    }
  }

  return template.replace(/\\n/g, '\n');
}
