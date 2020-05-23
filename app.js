//jshint esversion:6
require('dotenv').config()
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
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const Service = require('node-windows').Service;
//Uses
app.use(express.static('public')); // All our static files
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs'); // Templating
app.use(bodyParser.urlencoded({ extended: true })); // Allow to submit forms
// enable files upload
app.use(fileupload({ createParentPath: true }));
//Use Session
app.use(session({ secret: 'St&phani&1987', resave: false, saveUninitialized: false }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
// External routes
app.use(require('./routes/patient'));
app.use(require('./routes/examen'));
app.use(require('./routes/stock'));
app.use(require('./routes/setting'));
app.use(require('./routes/print'));

//Entry Point
app.get('/', async (req, res) => {
    // Global variables
    let settings = await stats.getSettings();
    //console.log(settings);
    global.appName = 'KSlab ';
    global.line1 = settings.line1;
    global.line2 = settings.line2;
    global.line3 = settings.line3;
    global.line4 = settings.line4;
    global.line5 = settings.line5;
    global.line6 = settings.line6;
    global.backupPath = settings.back_db_path;
    global.LOGO = helpers.base64("public/logo/" + settings.logo);
    global.LOGO_MENU = helpers.base64("public/logo/" + settings.logo_menu);
    global.EMAIL_ENT = settings.email_ent;
    global.ENT_NAME = settings.entreprise_name;
    global.TEST_STATUS = ['En attente', 'Enregistré', 'Validé', 'Livré'];
    global.STOCK_STATUS = ['Invalide', 'Valide'];
    global.PERISSABLE = ['Non', 'Oui'];
    global.TYPE_RESULTAT = ['', 'Valeurs normales', 'Positif/Négatif', 'Commentaires'];
    global.NBJOUR_STOCK_ALERT = 90;
    global.USER_HOME_PAGE = '/test-laboratoire';//Default for sample User
    //MENU ACCESS
    global.MENU_ITEM = ['Tableau de bord', 'Test Patient', 'Test Laboratoire', 'Patients', 'Examens', 'Gestion de stock', 'Paramètres', 'Administration'];
    global.SUBMENU_ITEM = ['Ajouter Patient', 'Liste des Patients', 'Modifier Patients', 'Rechercher Patient', 'Liste des demandes de Tests', 'Ajouter examens', 'Voir la liste des examens', 'Modifier examens'];
    res.render('login');
});
//Exit Point
app.get('/logout', async (req, res) => {
    console.log("Go to Login page");
    res.redirect('/');
    console.log("Destroy Session");
    req.session.destroy(function (err) {
        // cannot access session here
        console.log("Session destroyed....");
    });
});

//CHANGE PASSWORD
app.get('/change-pwd', async (req, res) => {
    if (typeof req.session.UserData != "undefined") {
        res.render('users/change-pwd', { UserData: req.session.UserData });
    } else {
        res.redirect('/');
    }
});
app.post('/change-pwd', async (req, res) => {
    console.log(req.body);
    let user = req.body.user_id;
    let Opass = req.body.Opass;
    let Npass = req.body.Npass;
    let Cpass = req.body.Cpass;
    let notifications = await stats.changePassword(user, Npass);
    res.json(notifications);
});


app.post('/login', async (req, res) => {
    let user_name = req.body.username;
    let pass_word = req.body.password;
    // const hashPass = await bcrypt.hash(pass_word, 10);
    // console.log(hashPass);
    let auth = await stats.userAuthentication(user_name, pass_word);
    let found = auth.length;
    console.log("LOGIN : " + found);
    if (found > 0) { //Auth successfull
        let InfoUser = auth[0];
        //TEST EMAIL
        // helpers.sendEmail(EMAIL_ENT, pass = "Kender1988",
        //     recipient_email="saudeez2019@gmail.com",
        //     attach_file ="kender.txt",
        //     subject="Test",
        //     body="This is a test message");
        //SUBMENU ACCESS OR ACTIONS
        let sub_menu = "Test Patient";//Default
        if (InfoUser.sub_menu_access != null) { sub_menu = InfoUser.sub_menu_access; }
        //global.SUBMENU_ITEM_ACCESS = sub_menu.split("|");
        //USER ACCESS
        let menu = "Test Patient";//Default
        if (InfoUser.menu_access != null) { menu = InfoUser.menu_access; }
        //global.USER_MENU_ACCES = menu.split("|");
        //console.log("USER_MENU_ACCES : " + USER_MENU_ACCES);
        //console.log("SUBMENU_ITEM_ACCESS : " + SUBMENU_ITEM_ACCESS);
        //USERNAME
        //global.USER_NAME = user_name;
        //USER_ID
        //global.USER_ID = InfoUser.id_personne;

        let UserData = {
            isauthenticated: true,
            user_name: user_name,
            user_id: InfoUser.id_personne,
            user_menu_access: menu.split("|"),
            user_sub_menu_access: sub_menu.split("|"),
        }
        req.session.UserData = UserData;
        req.session.username = user_name;
        //console.log("SESSION ID " + req.session.UserData.user_sub_menu_access);

        if (InfoUser.change_pass) {  // Force the User to change his password
            res.render("users/change-pwd", { page: "Home", UserData: req.session.UserData, }); // Change Password
        } else {
            let page = "/test-laboratoire";
            if (UserData.user_menu_access.includes("Tableau de bord") || UserData.user_menu_access[0] == "All") { page = "/home" }
            res.redirect(page); // Panel Admin
        }

    } else {
        res.render("login", { ERROR: "Nous n'arrivons pas à vous identifier. S'il vous plait contactez votre administrateur." });
    }
});

app.get('/home', async (req, res) => {
    if (typeof req.session.UserData != "undefined") {
        if (req.session.UserData.user_menu_access.includes("Tableau de bord") || req.session.UserData.user_menu_access[0] == "All") {

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
            let stockAlertCount = await stats.StockAlertCount(global.NBJOUR_STOCK_ALERT);//
            //NOMBRE DE PATIENT SUR 1 AN
            let currentYear = helpers.getCurrentYear();
            let pastYear = helpers.getPastYear();
            let currentMonth = helpers.getCurrentMonth();
            let pastMonth = helpers.getPastMonth(currentMonth);
            let nb_test_past_month = 0;
            let nb_test_curr_month = 0;

            //console.log("PM : "+ pastMonth+"  CM : "+currentMonth);
            let countPatientCurrentYear = [];
            for (i = 1; i < 13; i++) { //Month
                let nbPatientCY = await stats.patientcountByYearMonth(currentYear, i);
                countPatientCurrentYear.push(nbPatientCY);
            }
            let countPatientPastYear = [];
            for (i = 1; i < 13; i++) { //Month
                let nbPatientCY = await stats.patientcountByYearMonth(pastYear, i);
                countPatientPastYear.push(nbPatientCY);
            }

            //NOMBRE DE TEST SUR 1 AN
            let countTestRequestCurrentYear = [];
            for (i = 1; i < 13; i++) { //Month
                let nbPatientCY = await stats.testRequestCountByYearMonth(currentYear, i);
                if (pastMonth == i) { nb_test_past_month = nbPatientCY; }
                if (currentMonth == i) { nb_test_curr_month = nbPatientCY; }
                countTestRequestCurrentYear.push(nbPatientCY);
            }
            let diff = nb_test_curr_month - nb_test_past_month;
            let text_c = " en moins ";
            let classVal = "fa fa-caret-down";
            if (diff > 0) { text_c = " en plus "; classVal = "fa fa-caret-up"; }
            let comment = Math.abs(diff) + " " + text_c + "du mois précédent";
            if (diff == 0) { comment = ""; classVal = ""; }
            let countTestRequestPastYear = [];
            for (i = 1; i < 13; i++) { //Month
                let nbPatientCY = await stats.testRequestCountByYearMonth(pastYear, i);
                countTestRequestPastYear.push(nbPatientCY);
            }
            //console.log(countTestRequestPastYear + ""+ countTestRequestCurrentYear);
            params = {
                pageTitle: pageTitle,
                stats: {
                    NbPatientsActif: nb_patient,
                    nb_test_a_valider: nb_test_a_valider,
                    all_test: all_test,
                    test_a_enregistrer: test_a_enregistrer,
                    test_a_livrer: test_a_livrer,
                    TotProduct: total_materiaux_in_stock,
                    StockExpiredCount: stockExpiredCount,
                    StockAlertCount: stockAlertCount,
                    countPatientPastYear: countPatientPastYear,
                    countPatientCurrentYear: countPatientCurrentYear,
                    countTestRequestPastYear: countTestRequestPastYear,
                    countTestRequestCurrentYear: countTestRequestCurrentYear,
                    comment: comment,
                    classVal: classVal,
                },
                UserData: req.session.UserData,
                page: 'Home'
            };
            res.render('index', params);
        } else {
            res.redirect(global.USER_HOME_PAGE);
        }

    } else {
        res.redirect("/");
    }

});

//CRON JOB
//schedule tasks to be run on the server "* * * * *"
cron.schedule("0 17 * * 1-6", async function () {
    console.log("---------------------");
    console.log("Running Cron Job");
    // let fileDir = "./tmp";
    // let nb_files =  helpers.countDir(fileDir);
    // console.log("Count Items : "+nb_files);
    // if(nb_files >0){
    //     fsExtra.emptyDir(fileDir);
    //     console.log(nb_files+" removed from the directory empty...");
    // }else{
    //     console.log("The directory is already empty...");
    // }
        let settings = await stats.getSettings();
        let path_back_up = settings.back_db_path;
        let rep = helpers.DatatbaseBackup(path_back_up);
        if (rep) {
            msg = { success: true, msg: "<font color='green'>Sauvegarde effectuée avec succès.</font> Chemin : " + path_back_up };
            console.log(msg);
        } else {
            msg = { success: false, msg: "<font color='red'>Une erreur s'est produite. Veuillez réessayer.</font>" };
            console.log(msg);
        }
    console.log("---------------------");
});

//GET NOTIFICATIONS
app.get('/notifications', async (req, res) => {
    let stockCritic = await stockDB.listOfAllExpiredStock("All");
    res.json(stockCritic);
});


//MY APP AS A WINDOWS SERVICE
// Create a new service object
var svc = new Service({
    name:process.env.APP_NAME,
    description: process.env.APP_DESC,
    script: process.env.APP_PATH,
    nodeOptions: [
      '--harmony',
      '--max_old_space_size=4096'
    ]
  });
   
  // Listen for the "install" event, which indicates the
  // process is available as a service.
  svc.on('install',function(){
    svc.start();
  });
   
  svc.install();

const port = 8788;
server = app.listen(port, () => {
    console.log('KSlab server is started at port: ' + port);
});

