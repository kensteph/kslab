//LOCAL DATABASE

var mysql = require('mysql');

// var con = mysql.createConnection({
//     host: 'sql189.main-hosting.eu',
//     user: 'u813596094_kai',
//     port: process.env.PORT,
//     // connectionLimit: 100,
//     password: 'K@i14969',
//     database: 'u813596094_kslab',
//     dateStrings: 'date',
//     charset: 'latin1_swedish_ci' //PRISE EN COMPTE DES CARACTERES SPECIAUX
// });

// con.connect(function (err) {
//     //if (err) throw err;
//     console.log('REMOTE DATABASE Connected!');
// });

var con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    dateStrings: 'date',
    charset: 'latin1_swedish_ci' //PRISE EN COMPTE DES CARACTERES SPECIAUX
});
con.connect(function (err) {
    if (err) {
        console.log('DATABASE ' + process.env.DB_NAME + ' NOT AVAILABLE!');
    } else {
        console.log('Connected to ' + process.env.DB_NAME + '!');
    }
});

module.exports = con;
