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
const session = require('express-session');
const passport = require('passport');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
// const initializePassport = require('./controllers/passport-config')
//initializePassport = initializePassport(passport);
//Uses
//app.use(express.static('public')); // All our static files
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
    res.render('login');
});
//Exit Point
app.get('/logout', async (req, res) => {
    res.render('login');
});

//CHANGE PASSWORD
app.get('/change-pwd', async (req, res) => {
    res.render('users/change-pwd');
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
    const hashPass = await bcrypt.hash(pass_word,10);
    console.log(hashPass);
    let auth = await stats.userAuthentication(user_name, pass_word);
    let found = auth.length;
    console.log("LOGIN : " + found);
    if (found > 0) { //Auth successfull
        let InfoUser = auth[0];
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
        global.EMAIL_ENT = settings.email_ent;
        global.TEST_STATUS = ['En attente', 'Enregistré', 'Validé', 'Livré'];
        global.STOCK_STATUS = ['Invalide','Valide'];
        global.PERISSABLE = ['Non','Oui'];
        //MENU ACCESS
        global.MENU_ITEM = ['Tableau de bord', 'Test Patient', 'Test Laboratoire', 'Patients', 'Examens', 'Gestion de stock', 'Paramètres', 'Administration'];
        global.SUBMENU_ITEM = ['Ajouter Patient', 'Liste des Patients', 'Liste des Tests'];
        //TEST EMAIL
        // helpers.sendEmail(EMAIL_ENT, pass = "Kender1988",
        //     recipient_email="saudeez2019@gmail.com",
        //     attach_file ="kender.txt",
        //     subject="Test",
        //     body="This is a test message");
        //SUBMENU ACCESS OR ACTIONS
        let sub_menu = "Test Patient";//Default
        if (InfoUser.sub_menu_access != null) { sub_menu = InfoUser.sub_menu_access; }
        global.SUBMENU_ITEM_ACCESS = sub_menu.split("|");
        //USER ACCESS
        let menu = "Test Patient";//Default
        if (InfoUser.menu_access != null) { menu = InfoUser.menu_access; }
        global.USER_MENU_ACCES = menu.split("|");
        console.log("USER_MENU_ACCES : " + USER_MENU_ACCES);
        console.log("SUBMENU_ITEM_ACCESS : " + SUBMENU_ITEM_ACCESS);
        //USERNAME
        global.USER_NAME = user_name;
        //USER_ID
        global.USER_ID = InfoUser.id_personne;
        // req.session.user = user_name;
        // req.session.authenticated = true;
        if (InfoUser.change_pass) {  // Force the User to change his password
            res.render("users/change-pwd", { page: "Home" }); // Change Password
        } else {
            let page = "/test-laboratoire";
            if (USER_MENU_ACCES.includes("Tableau de bord") || USER_MENU_ACCES[0] == "All") { page = "/home" }
            res.redirect(page); // Panel Admin
        }

    } else {
        res.render("login", { ERROR: "Nous n'arrivons pas à vous identifier. S'il vous plait contactez votre administrateur." });
    }
});

app.get('/home', async (req, res) => {
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
            StockExpiredCount: stockExpiredCount,
            StockAlertCount: stockAlertCount,
        },
        page: 'Home'
    };
    res.render('index', params);
});
app.post('/home', async (req, res) => {

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

