import { createPool } from  'mysql2/promise';
import { config } from 'dotenv';

config()

export async function connect() {

    const connection = await createPool({
        host: process.env.HOST,
        user: process.env.USER,
        password: process.env.PASSWORD,
        database: process.env.DATABASE

    })

    return connection;

}