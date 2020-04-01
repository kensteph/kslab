//LOCAL DATABASE

var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'kslab',
    dateStrings: 'date'
});

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
});

module.exports = con;
