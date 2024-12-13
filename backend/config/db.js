const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,  // Added port specification
    user: 'root', // Default MySQL user is root
    password: 'salian', // Enter your MySQL password here
    database: 'diabetes_management',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const promisePool = pool.promise();

module.exports = promisePool;