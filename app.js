//jshint esversion:6
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//Uses
app.use(express.static('public')); // All our static files
app.set('view engine', 'ejs'); // Templating
app.use(bodyParser.urlencoded({ extended: true })); // Allow to submit forms

// External routes
app.use(require('./routes/patient'));

// Global variables
global.appName = 'KSlab ';

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