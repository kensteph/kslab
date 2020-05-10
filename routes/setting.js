//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const helpers = require('../helpers/helpers');
const stockDB = require('../controllers/stockController.js');
const settingsDB = require('../controllers/stats');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));

//SETTINGS
router.get('/settings', async (req, res) => {
    let pageTitle = "Paramètres ";
    let response = await  settingsDB.getSettings();
    console.log(response);
    res.render('setting/app-settings', { page: 'GeneralSettings', pageTitle: pageTitle,data : response });
});

//SAVE SETTINGS
router.post('/settings', async (req, res) => {
    if (req.files) {
        let image = req.files.logo;
        console.log(image);
        let split_img_name = image.name.split(".");
        let img_extension = split_img_name[1];
        let logo ="logo." + img_extension;
        settingsDB.updateLogo(logo);//logo name
        //console.log("Extension : "+img_extension);
        let path = "public/logo/"+logo;
        image.mv(path, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Image uploaded...");
            }
        });
    }
    //console.log(req.body); // the uploaded file object
    let response_insert = await  settingsDB.updateSettings(req);
    console.log(response_insert);
    let response = await  settingsDB.getSettings();
    let pageTitle = "Paramètres ";
    res.render('setting/app-settings', { page: 'GeneralSettings', pageTitle: pageTitle ,data : response });
});

//================================================= NOTIFICATIONS ======================================================
//INSERT NOTIFICATIONS
//GET NOTIFICATIONS LIST
router.get('/notifications-list', async (req, res) => {
    let pageTitle = "Notifications ";
    let stockCritic = await stockDB.listOfAllExpiredStock();
    res.render('setting/notifications', { page: 'GeneralSettings', pageTitle: pageTitle });
});


// Exportation of this router
module.exports = router;
