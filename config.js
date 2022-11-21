const mysql = require('mysql')

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_movie'
});

conn.connect((err) => {
    if (err) throw err;
    console.log('connect to database');
});

module.exports = conn;
