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
    res.render('setting/app-settings', { page: 'GeneralSettings', pageTitle: pageTitle, data: response });
});

//SAVE SETTINGS
router.post('/settings', async (req, res) => {
    if (req.files) {
        let image = req.files.logo;
        console.log(image);
        let split_img_name = image.name.split(".");
        let img_extension = split_img_name[1];
        let logo = "logo." + img_extension;
        settingsDB.updateLogo(logo);//logo name
        //console.log("Extension : "+img_extension);
        let path = "public/logo/" + logo;
        image.mv(path, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Image uploaded...");
            }
        });
    }
    //console.log(req.body); // the uploaded file object
    let response_insert = await settingsDB.updateSettings(req);
    console.log(response_insert);
    let response = await settingsDB.getSettings();
    let pageTitle = "Paramètres ";
    res.render('setting/app-settings', { page: 'GeneralSettings', pageTitle: pageTitle, data: response });
});

//======================================== USERS MANAGEMENT ============================================================

//ADD USER
router.get('/add-user', async (req, res) => {
    let pageTitle = "Nouvel utilisateur";
    params = {
        pageTitle: pageTitle,
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
        page: 'User'
    };
    res.render('users/users-list', params);
});

//USER ACCESS
router.get('/user-permissions', async (req, res) => {
    //console.log(req.query);
    let user = req.query.user;
    let userInfo = await settingsDB.getUserById(user);
    let menu_access =[];
    let sub_menu_access = [];
    if(userInfo.menu_access !=null){menu_access = userInfo.menu_access.split("|");}
    if(userInfo.sub_menu_access !=null){sub_menu_access = userInfo.sub_menu_access.split("|");}
    let pageTitle = "Liste d'accès de "+userInfo.fullname;
    //console.log(menu_access);
    params = {
        pageTitle: pageTitle,
        data: userInfo,
        menu_access : menu_access,
        sub_menu_access : sub_menu_access,
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
    let menu_access =[];
    let sub_menu_access = [];
    if(userInfo.menu_access !=null){menu_access = userInfo.menu_access.split("|");}
    if(userInfo.sub_menu_access !=null){sub_menu_access = userInfo.sub_menu_access.split("|");}
    let pageTitle = "Liste d'accès de "+userInfo.fullname;
    //console.log(userInfo);
    params = {
        pageTitle: pageTitle,
        data: userInfo,
        menu_access : menu_access,
        sub_menu_access : sub_menu_access,
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
        page: 'User'
    };
    res.render('users/add-user', params);
});


//================================================= NOTIFICATIONS ======================================================
//INSERT NOTIFICATIONS
//GET NOTIFICATIONS LIST
router.get('/notifications-list', async (req, res) => {
    let pageTitle = "Notifications ";
    let stockCritic = await stockDB.listOfAllExpiredStock();
    res.render('setting/notifications', { page: 'GeneralSettings', pageTitle: pageTitle });
});

//================================================ BACKUP DB =================================================
//GET DB HISTORIQUE BACKUP
router.get('/backup-db', async (req, res) => {
    let pageTitle = "Historique des sauvegardes ";
const mysqldump = require('mysqldump');
let path_directory = "C:/Users/KS/OneDrive/Saudeez";
// dump the result straight to a file
mysqldump({
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'kslab',
    },
    dumpToFile: path_directory+'/'+helpers.getCurrentDate()+'.sql',
});

// dump the result straight to a compressed file
// mysqldump({
//     connection: {
//         host: 'localhost',
//         user: 'root',
//         password: '123456',
//         database: 'my_database',
//     },
//     dumpToFile: './dump.sql.gz',
//     compressFile: true,
// });
 
// // return the dump from the function and not to a file
// const result = await mysqldump({
//     connection: {
//         host: 'localhost',
//         user: 'root',
//         password: '123456',
//         database: 'my_database',
//     },
// });

    res.render('setting/backup-db', { page: 'backUpDB', pageTitle: pageTitle });
});


// Exportation of this router
module.exports = router;
