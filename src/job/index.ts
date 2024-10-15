import 'dotenv/config';
import Database from '../db/pg';
import DatabaseWPP from '../db/wpp';
import './app';

async function startJob() {
  try {
    Database.connect();
    console.log('Database connected successfully.');

    DatabaseWPP.connect();
    console.log('DatabaseWPP connected successfully.');
  } catch (error) {
    console.error('Failed to connect to the database', error);
    process.exit(1);
  }
}

startJob();
