//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const helpers = require('../helpers/helpers');
const stockDB = require('../controllers/stockController.js');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
// ADD Materiau in stock
router.get('/add-materiau', async (req, res) => {
    let pageTitle = "Nouveau Matériau";
    params = {
        pageTitle: pageTitle,
        page: 'AddMateriau'
    };
    res.render('stock/add-materiau', params);
});

router.post('/add-materiau', async (req, res) => {
    console.log(req.body);
    let notifications = await stockDB.addMateriau(req);
    let pageTitle = "Nouveau Matériau";
    params = {
        pageTitle: pageTitle,
        notifications : notifications,
        page: 'AddMateriau'
    };
    res.render('stock/add-materiau', params);
    //res.json(notifications);
});
//MATERIAUX LIST
router.get('/materiaux', async (req, res) => {
    let data = await stockDB.listOfMateriaux();
    let pageTitle = "Liste des materiaux";
    params = {
        pageTitle: pageTitle,
        data : data,
        page: 'ListMateriau'
    };
    res.render('stock/materiaux-list', params);
});

//INVENTAIRE
router.get('/inventaire', async (req, res) => {
    let data = await stockDB.listOfAllStock();
    let pageTitle = "Inventaire";
    params = {
        pageTitle: pageTitle,
        data : data,
        page: 'Inventaire'
    };
    res.render('stock/inventaire', params);
});

//ADD STOCK
router.post('/add-stock', async (req, res) => {
    console.log(req.body);
    let notifications = await stockDB.addStock(req);
    res.json(notifications);
});

//ADD OR REMOVE ITEMS STOCK
router.post('/add-remove-stock', async (req, res) => {
    console.log(req.body);
    let notifications = await stockDB.addRemoveItemStock(req);
    res.json(notifications);
});

// //DELETE PATIENT
// router.post('/delete-patient', async (req, res) => {
//     console.log(req.body);
//     res.json({success : "Test",msg : "Done.."});
//     // let notifications = await patientDB.updatePatient(req);
//     // let data = await patientDB.getPatientById(req.body.patientID);
//     // let pageTitle = "Modification du patient : ";
//     // params = {
//     //     pageTitle: pageTitle,
//     //     data : data,
//     //     notifications : notifications,
//     //     page: 'PatientsList'
//     // };
//     // res.render('patients/add-patient', params);
// });

// Exportation of this router
module.exports = router;
