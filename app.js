//jshint esversion:6
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helpers = require('./helpers/helpers');
const stats = require('./controllers/stats');
const path = require('path');
const cron = require("node-cron");
const fsExtra = require('fs-extra');
const stockDB = require('./controllers/stockController');
const fileupload = require('express-fileupload');
//Uses
//app.use(express.static('public')); // All our static files
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs'); // Templating
app.use(bodyParser.urlencoded({ extended: true })); // Allow to submit forms
// enable files upload
app.use(fileupload({ createParentPath: true }));

// External routes
app.use(require('./routes/patient'));
app.use(require('./routes/examen'));
app.use(require('./routes/stock'));
app.use(require('./routes/setting'));
app.use(require('./routes/print'));

//Entry Point
app.get('/', async (req, res) => {
    res.render('login');
});


app.get('/home', async (req, res) => {
    // Global variables
    let settings = await stats.getSettings();
    console.log(settings);
    global.appName = 'KSlab ';
    global.line1 = settings.line1;
    global.line2 = settings.line2;
    global.line3 = settings.line3;
    global.line4 = settings.line4;
    global.line5 = settings.line5;
    global.line6 = settings.line6;
    global.LOGO = helpers.base64("public/logo/" + settings.logo);
    global.TEST_STATUS = ['En attente', 'Enregistré', 'Validé', 'Livré'];

    let pageTitle = "Tableau de bord";
    //Nmbre de patient actif
    let nb_patient = await stats.patientcountByStatus(1);
    let all_test = await stats.testcountByStatus("All");
    let nb_test_a_valider = await stats.testcountByStatus(1);
    let test_a_enregistrer = await stats.testcountByStatus(0);
    let test_a_livrer = await stats.testcountByStatus(2);
    //Stock
    let total_materiaux_in_stock = await stats.StockCount();
    let stockExpiredCount = await stats.StockExpiredCount();
    let stockAlertCount = await stats.StockAlertCount(30);//
    params = {
        pageTitle: pageTitle,
        stats: { 
            NbPatientsActif: nb_patient, 
            nb_test_a_valider: nb_test_a_valider, 
            all_test: all_test, 
            test_a_enregistrer: test_a_enregistrer, 
            test_a_livrer: test_a_livrer, 
            TotProduct: total_materiaux_in_stock,
            StockExpiredCount : stockExpiredCount,
            StockAlertCount : stockAlertCount,
         },
        page: 'Home'
    };
    //console.log("LOGO : "+LOGO);
    res.render('index', params);
});

//CRON JOB
// schedule tasks to be run on the server
//    cron.schedule("* * * * *", async function() {
//     console.log("---------------------");
//     console.log("Running Cron Job");
//     let fileDir = "./tmp";
//     let nb_files =  helpers.countDir(fileDir);
//     console.log("Count Items : "+nb_files);
//     if(nb_files >0){
//         fsExtra.emptyDir(fileDir);
//         console.log(nb_files+" removed from the directory empty...");
//     }else{
//         console.log("The directory is already empty...");
//     }
//     let stockCritic = await stockDB.listOfAllExpiredStock();
//     console.log(stockCritic);
//   });

//GET NOTIFICATIONS
app.get('/notifications', async (req, res) => {
    let stockCritic = await stockDB.listOfAllExpiredStock();
    res.json(stockCritic);
});


const port = 8788;
server = app.listen(port, () => {
    console.log('KSlab server is started at port: ' + port);
});

const io = require("socket.io")(server);
io.on("connection", function (socket) {
    console.log("User " + socket.id);
    socket.on("messageSent", function (message) {
        io.sockets.emit("messageSent", message);
    });
});