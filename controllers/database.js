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

let conState = "";

con.connect(function (err) {
    conState = con.state;
    if (err) {
        console.log('DATABASE ' + process.env.DB_NAME + ' NOT AVAILABLE!');
        console.log("CON : ", conState);
        // //TRY TO LAUNCH THE DATABASE  SERVER FIRST
        // console.log("TRYING TO LAUNCH DB AND RECONNECT : ", conState);
        // var exec = require('child_process').execFile;
        // var response = exec('./db_server/UwAmp.exe', function (err, data) {
        //     if (err) {
        //         //console.error(`exec error: ${err}`);

        //     }

        // });
        con.connect();
    } else {
        console.log('Connected to ' + process.env.DB_NAME + '!');
        console.log("CON SUCCESS: ", conState);
    }
});
// let dbConfig = {
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     port: process.env.PORT,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     dateStrings: 'date',
//     charset: 'latin1_swedish_ci' //PRISE EN COMPTE DES CARACTERES SPECIAUX
// };
// var connection;
// function handleDisconnect() {
//     connection = mysql.createConnection(dbConfig);  // Recreate the connection, since the old one cannot be reused.
//     connection.connect(function onConnect(err) {   // The server is either down
//         if (err) {
//             // or restarting (takes a while sometimes).
//             console.log('error when connecting to db:', err);
//             setTimeout(handleDisconnect, 10000);    // We introduce a delay before attempting to reconnect,
//         }                                           // to avoid a hot loop, and to allow our node script to
//     });                                             // process asynchronous requests in the meantime.
//     // If you're also serving http, display a 503 error.
//     connection.on('error', function onError(err) {
//         console.log('db error', err);
//         if (err.code == 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//             handleDisconnect();                         // lost due to either server restart, or a
//         } else {                                        // connnection idle timeout (the wait_timeout
//             throw err;                                  // server variable configures this)
//         }
//     });
// }

// // handleDisconnect();
// setTimeout(handleDisconnect, 10000);

module.exports = con;
