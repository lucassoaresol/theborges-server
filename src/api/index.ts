import 'dotenv/config';

import Database from '../db/pg';
import './server';

async function startServer() {
  try {
    Database.connect();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
}

startServer();
