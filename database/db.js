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

// import mysql from 'mysql2/promise';
// import dotenv from 'dotenv';

// dotenv.config();

// // Detailed database connection function
// async function connectDB() {
//     // Validate required environment variables
//     const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];
//     const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

//     if (missingVars.length > 0) {
//         console.error(`Missing required database environment variables: ${missingVars.join(', ')}`);
//         throw new Error(`Missing database configuration: ${missingVars.join(', ')}`);
//     }

//     try {
//         const connectionConfig = {
//             host: process.env.DB_HOST,
//             user: process.env.DB_USER,
//             password: process.env.DB_PASSWORD,
//             database: process.env.DB_NAME,
            
//             // Advanced connection pool settings
//             waitForConnections: true,
//             connectionLimit: 10,  // Recommended: limit concurrent connections
//             queueLimit: 0,        // Unlimited queueing
            
//             // Timeout and retry settings
//             connectTimeout: 10000,  // 10 seconds
//             acquireTimeout: 10000,  // 10 seconds to acquire a connection
//         };

//         // Use connection pool for better performance and connection management
//         const pool = mysql.createPool(connectionConfig);

//         // Test the connection
//         const connection = await pool.getConnection();
//         console.log('Successfully connected to the database');
        
//         // Release the test connection back to the pool
//         connection.release();

//         return pool;
//     } catch (error) {
//         console.error('Database connection failed:', {
//             errorCode: error.code,
//             errorMessage: error.message,
//             errorNo: error.errno
//         });

//         // Enhanced error handling
//         switch (error.code) {
//             case 'PROTOCOL_CONNECTION_LOST':
//                 console.error('Database connection was closed.');
//                 break;
//             case 'ER_CON_COUNT_ERROR':
//                 console.error('Database has too many connections.');
//                 break;
//             case 'ECONNREFUSED':
//                 console.error('Database connection was refused. Check:');
//                 console.error('1. Host is correct');
//                 console.error('2. Database is running');
//                 console.error('3. Firewall/network settings');
//                 console.error('4. Credentials are valid');
//                 break;
//             default:
//                 console.error('Unexpected database connection error');
//         }

//         throw error;
//     }
// }

const db = await connectDB();

export default db;
