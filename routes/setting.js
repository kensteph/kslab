//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const helpers = require('../helpers/helpers');
const stockDB = require('../controllers/stockController.js');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));

//SETTINGS
router.get('/settings', async (req, res) => {
    let pageTitle = "Paramètres ";
    res.render('setting/app-settings',{page : 'GeneralSettings' , pageTitle : pageTitle});
 });

// Exportation of this router
module.exports = router;
