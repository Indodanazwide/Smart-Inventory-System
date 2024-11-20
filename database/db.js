import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// database connection
async function connectDB() {
    try {
        const db = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            waitForConnections: true,
            queueLimit: 0
        });

        console.log('Connected to the database');
        return db;
    } catch (error) {
        console.log(`Database connection failed: ${error}`);
        throw error;
    }
}

const db = await connectDB();

export default db;