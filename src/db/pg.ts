import { Client } from 'pg';
import Pool from 'pg-pool';

class Database {
  private static pool: Pool<Client>;

  public static connect() {
    if (!Database.pool) {
      Database.pool = new Pool({
        user: process.env.DB_PG_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_PG_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PG_PORT),
      });
    }
  }

  public static getPool(): Pool<Client> {
    return Database.pool;
  }
}

export default Database;
