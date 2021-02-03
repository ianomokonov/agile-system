const mysql = require('mysql2/promise');

module.exports = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'agile',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})