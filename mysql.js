const mysql = require('mysql2');

let pool = mysql.createPool({

    "host": process.env.MYSQL_HOST,
    "user": process.env.MYSQL_ROOT,
    "password": process.env.MYSQL_PASSWORD,
    "database": process.env.MYSQL_DATABASE,
    "port": process.env.PORT

});


module.exports = { pool }