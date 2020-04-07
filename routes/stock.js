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

//MOUVEMENT DE STOCK
router.get('/mv-stock', async (req, res) => {
    let data = await stockDB.stockMoving();
    let pageTitle = "Mouvement de stock";
    params = {
        pageTitle: pageTitle,
        data : data,
        page: 'StockMoving'
    };
    res.render('stock/mouvement-stock', params);
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


// Exportation of this router
module.exports = router;
