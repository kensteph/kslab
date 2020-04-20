//jshint esversion:6
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helpers = require('./helpers/helpers');
const stats = require('./controllers/stats');
const path = require('path');
//Uses
//app.use(express.static('public')); // All our static files
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs'); // Templating
app.use(bodyParser.urlencoded({ extended: true })); // Allow to submit forms

// External routes
app.use(require('./routes/patient'));
app.use(require('./routes/examen'));
app.use(require('./routes/stock'));
app.use(require('./routes/setting'));
app.use(require('./routes/print'));

// Global variables
global.appName = 'KSlab ';
global.entName = 'KSlab ';
global.entAddress = '42,Rue Charlemagne Péralte ';
global.entCity = 'Pétion-Ville,Haiti ';
global.TEST_STATUS = ['En attente','Enregistré','Validé','Livré']
//Entry Point
app.get('/', async (req, res) => {
   res.render('login');
});


app.get('/home', async (req, res) => {
    let pageTitle = "Tableau de bord";
    //Nmbre de patient actif
    let nb_patient = await stats.patientcountByStatus(1);
    let all_test  = await stats.testcountByStatus("All");
    let nb_test_a_valider = await stats.testcountByStatus(1);
    let test_a_enregistrer = await stats.testcountByStatus(0);
    let test_a_livrer = await stats.testcountByStatus(2);
    params = {
        pageTitle: pageTitle,
        stats : {NbPatientsActif : nb_patient ,nb_test_a_valider : nb_test_a_valider,all_test  : all_test, test_a_enregistrer : test_a_enregistrer,test_a_livrer : test_a_livrer},
        page: 'Home'
    };
    //Logo
    global.LOGO = helpers.base64("public/assets/img/logo-dark.png");
    //console.log("LOGO : "+LOGO);
    res.render('index',params);
 });
 
const port = 8788;
app.listen(port, () => {
    console.log('KSlab server is started at port: ' + port);
});