import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Initialize database connection from MySQL
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect and output the result of the database
db.connect((error) => {
    if (error) {
        console.error('error connecting:', err.message);
        process.exit(1);
    }
});

export default db;