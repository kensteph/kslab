//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const helpers = require('../helpers/helpers');
const stockDB = require('../controllers/stockController.js');
const settingsDB = require('../controllers/stats');
const helpers = require('../helpers/helpers');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));

//SETTINGS
router.get('/settings', async (req, res) => {
    let pageTitle = "Paramètres ";
    let response = await settingsDB.getSettings();
    console.log(response);
    res.render('setting/app-settings', { page: 'GeneralSettings', pageTitle: pageTitle, data: response, UserData: req.session.UserData, });
});

//SAVE SETTINGS
router.post('/settings', async (req, res) => {
    let path = "public/logo/";
    console.log(req.files);
    if (req.files) {
        let image = req.files.logo;
        let image_menu = req.files.logo_menu;
        if (image) {
            console.log("LOGO : "+image);
            let info = helpers.simpleUpload(req,"logo",path,"logo");
            console.log(info);
            let logo = info.data.name; //logo name
            settingsDB.updateLogo(logo);
        } else {
            console.log("Aucune Image");
        }
        //MENU LOGO
        if(image_menu){
            let info = helpers.simpleUpload(req,"logo_menu",path,"logo_menu");
            console.log(info);
            let logo = info.data.name; //logo name
            settingsDB.updateLogoMenu(logo);
            console.log("MENU : "+image_menu);
        }else {
            console.log("Aucune Image MENU");
        }

    }
    
    // helpers.simpleUpload(req,"logo_menu",path);
    //console.log(req.body); // the uploaded file object
    let response_insert = await settingsDB.updateSettings(req);
    console.log(response_insert);
    let response = await settingsDB.getSettings();
    let pageTitle = "Paramètres ";
    res.render('setting/app-settings', { page: 'GeneralSettings', pageTitle: pageTitle, data: response, UserData: req.session.UserData, update: response_insert });
});

//======================================== USERS MANAGEMENT ============================================================

//ADD USER
router.get('/add-user', async (req, res) => {
    let pageTitle = "Nouvel utilisateur";
    params = {
        pageTitle: pageTitle,
        UserData: req.session.UserData,
        page: 'User'
    };
    res.render('users/add-user', params);
});

router.post('/add-user', async (req, res) => {
    console.log(req.body);
    let notifications = await settingsDB.saveUser(req, res);
    console.log(notifications);
    let pageTitle = "Nouvel utilisateur";
    params = {
        pageTitle: pageTitle,
        notifications: notifications,
        UserData: req.session.UserData,
        page: 'User'
    };
    res.render('users/add-user', params);
});

//USERS LIST
router.get('/users', async (req, res) => {
    let data = await settingsDB.listOfAllUsers();
    let pageTitle = "Liste des utilisateurs";
    params = {
        pageTitle: pageTitle,
        data: data,
        UserData: req.session.UserData,
        page: 'User'
    };
    res.render('users/users-list', params);
});

//USER ACCESS
router.get('/user-permissions', async (req, res) => {
    //console.log(req.query);
    let user = req.query.user;
    let userInfo = await settingsDB.getUserById(user);
    let menu_access = [];
    let sub_menu_access = [];
    if (userInfo.menu_access != null) { menu_access = userInfo.menu_access.split("|"); }
    if (userInfo.sub_menu_access != null) { sub_menu_access = userInfo.sub_menu_access.split("|"); }
    let pageTitle = "Liste d'accès de " + userInfo.fullname;
    //console.log(menu_access);
    params = {
        pageTitle: pageTitle,
        data: userInfo,
        menu_access: menu_access,
        sub_menu_access: sub_menu_access,
        UserData: req.session.UserData,
        page: 'User'
    };
    res.render('users/user-permissions', params);
});
//USER ACCESS
router.post('/user-permissions', async (req, res) => {
    console.log(req.body);
    let user = req.body.user_id;
    await settingsDB.saveUserPermision(req);
    let userInfo = await settingsDB.getUserById(user);
    let menu_access = [];
    let sub_menu_access = [];
    if (userInfo.menu_access != null) { menu_access = userInfo.menu_access.split("|"); }
    if (userInfo.sub_menu_access != null) { sub_menu_access = userInfo.sub_menu_access.split("|"); }
    let pageTitle = "Liste d'accès de " + userInfo.fullname;
    //console.log(userInfo);
    params = {
        pageTitle: pageTitle,
        data: userInfo,
        menu_access: menu_access,
        sub_menu_access: sub_menu_access,
        UserData: req.session.UserData,
        page: 'User'
    };
    res.render('users/user-permissions', params);
});
//EDIT USER
router.get('/edit-user', async (req, res) => {
    let patienID = req.query.user;
    //console.log(patienID);
    let data = await settingsDB.getUserById(patienID);
    //console.log("EDIT : "+data);
    let pageTitle = "Modification de l'utilisateur : " + data.fullname;
    params = {
        pageTitle: pageTitle,
        data: data,
        patienID: patienID,
        UserData: req.session.UserData,
        page: 'User'
    };
    res.render('users/add-user', params);
});

router.post('/edit-user', async (req, res) => {
    //console.log(req.query);
    let notifications = await settingsDB.updateUser(req);
    let data = await settingsDB.getUserById(req.query.user);
    //console.log(data);
    let pageTitle = "Modification de l'utilisateur : " + data.fullname;
    params = {
        pageTitle: pageTitle,
        data: data,
        notifications: notifications,
        UserData: req.session.UserData,
        page: 'User'
    };
    res.render('users/add-user', params);
});

//CHANGE PASS FOR A USER
router.post('/change-user-password', async (req, res) => {
    let user = req.body.userID;
    let Npass = req.body.password;
    let notifications = await settingsDB.changePasswordForUser(user, Npass);
    res.json(notifications);
});

//DESACTIVATE A USER
router.post('/desactivate-user', async (req, res) => {
    console.log(req.body);
    let user = req.body.patientID;
    let action = req.body.action;
    let notifications = await settingsDB.activateOrDesactvateUser(user, action);
    res.json(notifications);
});

//================================================= NOTIFICATIONS ======================================================
//INSERT NOTIFICATIONS
router.post('/save-notification', async (req, res) => {
    console.log(req.body);
    let notifications = await settingsDB.saveNotification(req);
    res.json(notifications);
});
//GET NOTIFICATIONS LIST
router.get('/manage-notifications', async (req, res) => {
    let data = await settingsDB.notificationList();
    let UserList = await settingsDB.listOfAllUsers();
    let pageTitle = "Notifications ";
    params = {
        pageTitle: pageTitle,
        notifications: data,
        UserList : UserList,
        UserData: req.session.UserData,
        page: 'Notifications'
    };
    res.render('setting/manage-notifications',params);
});

//================================================ BACKUP DB =================================================
//GET DB HISTORIQUE BACKUP
router.post('/backup-db', async (req, res) => {
    //let pageTitle = "Historique des sauvegardes ";
    let path_back_up = req.body.backupPath;
    let msg = {};
    if (path_back_up.trim() == "") {
        path_back_up = global.backupPath;
    }
    let rep = helpers.DatatbaseBackup(path_back_up);
    if (rep) {
        msg = { success: true, msg: "<font color='green'>Sauvegarde effectuée avec succès.</font> Chemin : " + path_back_up };
        console.log(msg);
    } else {
        msg = { success: false, msg: "<font color='red'>Une erreur s'est produite. Veuillez réessayer.</font>" };
        console.log(msg);
    }
    res.json(msg);
    //res.render('setting/backup-db', { page: 'backUpDB', pageTitle: pageTitle });
});


// Exportation of this router
module.exports = router;
