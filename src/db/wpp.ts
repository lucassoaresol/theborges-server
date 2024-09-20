import { Client } from 'pg';
import Pool from 'pg-pool';

class DatabaseWPP {
  private static pool: Pool<Client>;

  public static connect() {
    if (!DatabaseWPP.pool) {
      DatabaseWPP.pool = new Pool({
        user: process.env.DB_PG_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_PG_NAME_WPP,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PG_PORT),
      });
    }
  }

  public static getPool(): Pool<Client> {
    return DatabaseWPP.pool;
  }
}

export default DatabaseWPP;
