import { createPool } from  'mysql2/promise';
import { config } from 'dotenv';

config()

export async function connect() {

    const connection = await createPool({
        host: process.env.HOST_DB,
        user: process.env.USER_DB,
        password: process.env.PASSWORD_DB,
        database: process.env.DATABASE

    })

    return connection;

}