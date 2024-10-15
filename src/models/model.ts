import Database from '../db/pg';

class Model {
  protected pool = Database.getPool();
}

export default Model;
