//jshint esversion:6

require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const helpers = require('./helpers/helpers');
const stats = require('./controllers/stats');
const path = require('path');
const cron = require("node-cron");
const fileupload = require('express-fileupload');
const session = require('express-session');
const auth = require('./middleware/auth');

//LIVE COMMUNICATION
const http = require('http').Server(app);
const io = require('socket.io')(http);
//Uses
app.use(express.static('public')); // All our static files
app.use(express.static(path.join(__dirname, '/public')));
app.set('view engine', 'ejs'); // Templating
app.use(bodyParser.urlencoded({ extended: true })); // Allow to submit forms

// enable files upload
app.use(fileupload({ createParentPath: true }));
//Use Session
app.use(session({ secret: 'St&phani&1987', resave: false, saveUninitialized: false }));
// External routes
app.use(require('./routes/patient'));
app.use(require('./routes/examen'));
app.use(require('./routes/stock'));
app.use(require('./routes/setting'));
app.use(require('./routes/print'));


//Entry Point
app.get('/', async (req, res) => {
    await stats.intitValues();
    res.render('login');
    //console.log("RESPONSE : ", response)

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
app.get('/change-pwd', auth, async (req, res) => {
    if (typeof req.session.UserData != "undefined") {
        res.render('users/change-pwd', { UserData: req.session.UserData });
    } else {
        res.redirect('/');
    }
});
app.post('/change-pwd', auth, async (req, res) => {
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
    //console.log("LOGIN : " + found);
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

        //REAL TIME INFORMATIONS
        io.on('connection', async function (socket) {
            console.log("User " + user_name + " is connected...");
            await stats.updateNbStockRequest(io);
            //UPDATE THE NUMBER OF STOCK REQUESTS MADE BY USERS WHEN A REQUEST IS MADE
            socket.on('updateNbRequestsStock', async function (msg) {
                await stats.updateNbStockRequest(io);
                console.log("User " + msg);
            });
            //UPDATE THE NUMBER OF STOCK REQUESTS MADE BY USERS EVERY 60 SECS
            setTimeout(async () => {
                await stats.updateNbStockRequest(io);
                await stats.unreadUserMessage(user_name, InfoUser.id_personne, io);
            }, 1000);

            //UPDATE THE NUMBER OF STOCK REQUESTS MADE BY USERS EVERY 60 SECS
            // setTimeout( async() => {
            //     await stats.updateNbNotifications(io);
            // }, 5000);

            //UPDATE THE NUMBER OF STOCK REQUESTS MADE BY USERS WHEN A REQUEST IS MADE
            socket.on('updateNotificationCount', async function (data) {
                await stats.updateNbNotifications(io, data, { user: user_name, userId: InfoUser.id_personne });
                await stats.unreadUserMessage(user_name, InfoUser.id_personne, io);
                console.log(data);
            });



        });

        if (InfoUser.change_pass) {  // Force the User to change his password
            res.render("users/change-pwd", { page: "Home", UserData: req.session.UserData, }); // Change Password
        } else {
            let page = USER_HOME_PAGE;
            if (UserData.user_menu_access.includes("Tableau de bord") || UserData.user_menu_access[0] == "All") { page = "/home" }
            res.redirect(page); // Panel Admin
        }

    } else {
        res.render("login", { ERROR: "Nous n'arrivons pas à vous identifier. S'il vous plait contactez votre administrateur." });
    }
});

app.get('/home', auth, async (req, res) => {
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

//schedule tasks to be run on the server "* * * * *" every 30 minutes
cron.schedule("*/30 * * * *", async function () {
    // # ┌────────────── second (optional)
    // # │ ┌──────────── minute
    // # │ │ ┌────────── hour
    // # │ │ │ ┌──────── day of month
    // # │ │ │ │ ┌────── month
    // # │ │ │ │ │ ┌──── day of week
    // # │ │ │ │ │ │
    // # │ │ │ │ │ │
    // # * * * * * *
    let settings = await stats.getSettings();
    console.log("Running Cron Job", new Date(), "DATA : ", settings.line1);
});
//GET NOTIFICATIONS
app.get('/notifications', async (req, res) => {
    let myNotifications = await stats.userNotificationList(req.session.username);
    let pageTitle = "Liste des notifications";
    params = {
        UserData: req.session.UserData,
        notifications: myNotifications,
        page: 'Home',
        pageTitle: pageTitle,
    }
    res.render('setting/notifications', params);
    //res.json(stockCritic);
});

helpers.getStartAndEndDateOfTheWeekFromDate("2020-07-09");
app.use(function (req, res) {
    res.status(404).json({ msg: ' This route is not defined...' });
});
const port = 8788;
http.listen(port, () => {
    console.log('KSlab server is started at port: ' + port);
});


