/* eslint-disable no-undef */
import mysql from "mysql2/promise";
import { DatabaseName, DatabaseUsername, DatabasePassword,  DatabaseHost, DB_DIALECT, NODE_ENV} from '../config/env.js';

const connectToDatabase = async () => {
  try {
    const connection = await mysql.createConnection({
      host: DatabaseHost,
      user: DatabaseUsername,
      password: DatabasePassword,
      database: DatabaseName
    });

    console.log(`Connected to database in ${NODE_ENV} mode`);
    return connection;
  } catch (error) {
    console.error(`Error connecting to database in ${NODE_ENV} mode:`, error);
    process.exit(1);
  }
};

export default connectToDatabase;
