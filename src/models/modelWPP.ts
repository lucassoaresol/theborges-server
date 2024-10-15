import DatabaseWPP from '../db/wpp';

import Model from './model';

class ModelWPP extends Model {
  protected poolWPP = DatabaseWPP.getPool();
}

export default ModelWPP;
