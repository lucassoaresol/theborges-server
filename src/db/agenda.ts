import mysql, { Pool } from 'mysql2/promise';

class DatabaseAgenda {
  private static pool: Pool;

  public static connect(): void {
    if (!DatabaseAgenda.pool) {
      DatabaseAgenda.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_MYSQL_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_MYSQL_NAME,
        port: Number(process.env.DB_MYSQL_PORT),
        waitForConnections: true,
      });
    }
  }

  public static getPool(): Pool {
    if (!DatabaseAgenda.pool) {
      throw new Error('Database not connected. Please call connect() first.');
    }
    return DatabaseAgenda.pool;
  }
}

export default DatabaseAgenda;
