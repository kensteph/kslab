//jshint esversion:6
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helpers = require('./helpers/helpers');
//Uses
app.use(express.static('public')); // All our static files
app.set('view engine', 'ejs'); // Templating
app.use(bodyParser.urlencoded({ extended: true })); // Allow to submit forms

// External routes
app.use(require('./routes/patient'));
app.use(require('./routes/examen'));
app.use(require('./routes/stock'));

// Global variables
global.appName = 'KSlab ';
global.TEST_STATUS = ['En attente','Validé','Livré']
//Entry Point
app.get('/', async (req, res) => {
   res.render('login');
});

app.get('/home', async (req, res) => {
    let pageTitle = "Tableau de bord";
    params = {
        pageTitle: pageTitle,
        page: 'home'
    };
    res.render('index',params);
 });
 
const port = 8788;
app.listen(port, () => {
    console.log('KSlab server is started at port: ' + port);
});