const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'salian',
    database: 'diabetes_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

// Add transaction helper methods
const getConnection = async () => {
    return await promisePool.getConnection();
};

module.exports = {
    query: (...args) => promisePool.query(...args),
    getConnection,
    promisePool
};