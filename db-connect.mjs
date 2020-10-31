import postgres from 'postgres';
import dotenv from 'dotenv';

// configures the variables specified in the .env file

dotenv.config();

const sql = postgres();

// one can also use the connection string for testing, i.e.
// const sql =  postgres('postgres://username:password@localhost:5432/database
//where username, password and database are the respective names for the database to connect)

process.exit(0);
