import sql from 'mssql';
import { configDotenv } from 'dotenv';

configDotenv()

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, 
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // Use encryption if required (Azure, etc.)
        trustServerCertificate: true, // Trust the self-signed certificate
        enableArithAbort: true // Required for recent SQL Server versions
    }
};

// Create a pool instance
const pool = new sql.ConnectionPool(config)

// Initialize poolConnect as a promise
const poolConnect = pool.connect()
    .then(poolInstance => {
        console.log('Connected to MSSQL')
        return poolInstance
    })
    .catch(err => {
        console.error('Database connection error:', err)
        throw err
    }
)


export { sql, poolConnect };