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
        notifications: notifications,
        page: 'AddMateriau'
    };
    res.render('stock/add-materiau', params);
    //res.json(notifications);
});
//MATERIAUX LIST
router.get('/materiaux', async (req, res) => {
    let materiauID = "All";
    if(req.query.mat){
        materiauID = req.query.mat;
    }
    let data = await stockDB.listOfMateriaux(materiauID);
    let pageTitle = "Liste des materiaux";
    params = {
        pageTitle: pageTitle,
        data: data,
        page: 'ListMateriau'
    };
    res.render('stock/materiaux-list', params);
});

//INVENTAIRE
router.get('/inventaire', async (req, res) => {
    let statut = 'All';
    if(req.query.statut){ statut = req.query.statut; }
    let data ="";
    if(statut == "Critique"){
        data = await stockDB.listOfAllAlertStock(30);
    }else if(statut == "Expiré"){
        data = await stockDB.listOfAllExpiredStock();
    }else if(statut == "Valide"){
        data = await stockDB.listOfAllValidStock(30);
    }else{
        data = await stockDB.listOfAllStock();
    }
    statut = statut !="All" ? statut+"s" : "";
    let pageTitle = "Inventaire des stocks "+ statut;
    params = {
        pageTitle: pageTitle,
        data: data,
        statut : statut,
        page: 'Inventaire'
    };
    res.render('stock/inventaire', params);
});

//INVENTAIRE POST
router.post('/inventaire', async (req, res) => {
    let statut = 'All';
    if(req.body.statut){ statut = req.body.statut; }
    let data ="";
    if(statut == "Critique"){
        data = await stockDB.listOfAllAlertStock(30);
    }else if(statut == "Expiré"){
        data = await stockDB.listOfAllExpiredStock();
    }else if(statut == "Valide"){
        data = await stockDB.listOfAllValidStock(30);
    }else{
        data = await stockDB.listOfAllStock();
    }
    
    statut = statut !="All" ? statut+"s" : "";
    let pageTitle = "Inventaire des stocks "+ statut;
    params = {
        pageTitle: pageTitle,
        data: data,
        statut : statut,
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
        data: data,
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

//LINK TEST TO MATERIAU
router.post('/link-test-materiau', async (req, res) => {
    let data = req.body;
    if (data.qtes) {
        console.log(data);
    } else {
        console.log("NO DATA");
    }
    let notifications = await stockDB.linkTestToMateriau(req);
    res.json(notifications);
});

//DISPONIBILITE MATERIAU /QTE DISPONIBLE

//GET THES TEST'S MATERIAUX
router.post('/verify-materiaux-availability', async (req, res) => {
    console.log("Verification");
    let data_posted = req.body;
    let testSelected = data_posted.testSelected;
    console.log(data_posted);
    let alert = [];
    //Pour chaque test demande on va verifier la disponibilite des materiaux
    for (test_id of testSelected) {
        let info = await stockDB.getTestMateriaux(test_id);
        //console.log(info);
        //Pour chaque materiau verifier sa disponibilite
        let pos = 1;
        for (materiau of info) {
            let materiauID = materiau.materiau;
            let materiauName = materiau.nom_materiau;
            let qte_to_use = materiau.qte;
            let qte_dispo = await stockDB.countAvailableMateriaux(materiauID);
            if(qte_dispo == null){ qte_dispo = 0;}
            let diference = qte_dispo - qte_to_use;
            if(diference<0){
                let sms = pos+"- <font color='red'>Pas assez de <strong>"+materiauName+"</strong> en stock. QTE DISPO : "+qte_dispo+"</font>";
                alert.push(sms);
            }else{
                console.log("GOOD TO GO "); 
            }
            
            // console.log("QUANTITE DISPO : " + qte_dispo + " " +materiauName );
            // console.log("QUANTITE A UTILISER : " + qte_to_use + " " +materiauName );
            // console.log(alert);
            pos++; 
        }
    }
    res.json(alert);
    // let id_exam = req.body.examID;
    // let info = await stockDB.getTestMateriaux(id_exam);
    // if(info.length == 0){
    //     info = await examenDB.getExamById(id_exam);
    // }
    // let testResult = await examenDB.getTestResult(5,6);
    // console.log(testResult);
    //res.json(info);
});
// Exportation of this router
module.exports = router;
