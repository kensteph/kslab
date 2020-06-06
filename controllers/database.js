//LOCAL DATABASE

var mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: 'date',
    charset : 'latin1_swedish_ci' //PRISE EN COMPTE DES CARACTERES SPECIAUX
});

con.connect(function(err) {
    if (err) throw err;
    console.log('Connected!');
});

module.exports = con;
