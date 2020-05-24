//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const printer = require('../print/print');
const helpers = require('../helpers/helpers');
const fs = require('fs-extra');
const con = require('../controllers/database');
// const helpers = require('../helpers/helpers');
const stockDB = require('../controllers/stockController.js');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
// ADD Materiau in stock
router.get('/add-materiau', async (req, res) => {
    let pageTitle = "Nouveau Matériau";
    params = {
        pageTitle: pageTitle,
        UserData: req.session.UserData,
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
        UserData: req.session.UserData,
        page: 'AddMateriau'
    };
    res.render('stock/add-materiau', params);
    //res.json(notifications);
});
//EDIT MATERIAU
router.post('/edit-materiau', async (req, res) => {
    console.log(req.body);
    let notifications = await stockDB.editMateriau(req.body);
    res.json(notifications);
});
//MATERIAUX LIST
router.get('/materiaux', async (req, res) => {
    let materiauID = "All";
    if (req.query.mat) {
        materiauID = req.query.mat;
    }
    let data = await stockDB.listOfMateriaux(materiauID);
    let pageTitle = "Liste des materiaux";
    params = {
        pageTitle: pageTitle,
        data: data,
        UserData: req.session.UserData,
        page: 'ListMateriau'
    };
    res.render('stock/materiaux-list', params);
});

//INVENTAIRE
router.get('/inventaire', async (req, res) => {
    let statut = 'All';
    let materiauSelected = 'All';
    if (req.query.statut) { statut = req.query.statut; }
    if (req.query.materiauSelected) { statut = req.query.materiauSelected; }
    let data = "";
    if (statut == "Critique") {
        data = await stockDB.listOfAllAlertStock(materiauSelected, global.NBJOUR_STOCK_ALERT);
    } else if (statut == "Expiré") {
        data = await stockDB.listOfAllExpiredStock(materiauSelected);
    } else if (statut == "Valide") {
        data = await stockDB.listOfAllValidStock(materiauSelected);
    } else {
        data = await stockDB.listOfAllStock(materiauSelected);
    }
    await stockDB.stockToNotify(global.NBJOUR_STOCK_ALERT);
    statut_text = statut != "All" ? statut + "s" : "";
    let pageTitle = "Inventaire des stocks " + statut_text;
    let materiauxList = await stockDB.listOfMateriaux("All");
    params = {
        pageTitle: pageTitle,
        data: data,
        statut: statut,
        materiauxList: materiauxList,
        materiauSelected: materiauSelected,
        UserData: req.session.UserData,
        page: 'Inventaire'
    };
    res.render('stock/inventaire', params);
});

//INVENTAIRE POST
router.post('/inventaire', async (req, res) => {
    console.log(req.body);
    let statut = 'All';
    let materiauSelected = 'All';
    if (req.body.statut) { statut = req.body.statut; }
    if (req.body.materiauSelected) { materiauSelected = req.body.materiauSelected; }
    let data = "";
    if (statut == "Critique") {
        data = await stockDB.listOfAllAlertStock(materiauSelected, global.NBJOUR_STOCK_ALERT);
    } else if (statut == "Expiré") {
        data = await stockDB.listOfAllExpiredStock(materiauSelected);
    } else if (statut == "Valide") {
        data = await stockDB.listOfAllValidStock(materiauSelected);
    } else {
        data = await stockDB.listOfAllStock(materiauSelected);
    }
    statut_text = statut != "All" ? statut + "s" : "";
    let pageTitle = "Inventaire des stocks " + statut_text;
    let materiauxList = await stockDB.listOfMateriaux("All");
    params = {
        pageTitle: pageTitle,
        data: data,
        statut: statut,
        materiauxList: materiauxList,
        materiauSelected: materiauSelected,
        UserData: req.session.UserData,
        page: 'Inventaire'
    };
    res.render('stock/inventaire', params);
});

//MOUVEMENT DE STOCK
router.get('/mv-stock', async (req, res) => {
    console.log(req.body);
    let dateF = helpers.getCurrentDate();
    let dateT = helpers.getCurrentDate();
    let materiauxList = await stockDB.listOfMateriaux("All");
    let materiauSelected = 'All';
    if (req.body.materiauSelected) { materiauSelected = req.body.materiauSelected; }
    let data = await stockDB.stockMoving(dateF,dateT,materiauSelected);
    let dateFrom = helpers.formatDate(dateF, "FR");
    dateFrom = helpers.changeDateSymbol(dateFrom);
    let dateTo = helpers.formatDate(dateT, "FR");
    dateTo = helpers.changeDateSymbol(dateTo);
    let pageTitle = "Mouvement de stock";
    params = {
        pageTitle: pageTitle,
        data: data,
        UserData: req.session.UserData,
        materiauxList : materiauxList,
        materiauSelected : materiauSelected,
        dateFrom : dateFrom,
        dateTo : dateTo,
        dateFromDB : dateF,
        dateToDB : dateT,
        page: 'StockMoving'
    };
    res.render('stock/mouvement-stock', params);
});

router.post('/mv-stock', async (req, res) => {
    console.log(req.body);
    let dateFrom = req.body.DateFrom;
    let dateTo = req.body.DateTo;
    let materiauSelected = 'All';
    if (req.body.materiauSelected) { materiauSelected = req.body.materiauSelected; }
    let materiauxList = await stockDB.listOfMateriaux("All");
    //DATES
    dateFromDB =  helpers.changeDateSymbol(dateFrom);
    dateFromDB = helpers.formatDate(dateFrom, "EN");
    dateToDB =  helpers.changeDateSymbol(dateTo);
    dateToDB = helpers.formatDate(dateTo, "EN");
    let data = await stockDB.stockMoving(dateFromDB,dateToDB,materiauSelected);
    let pageTitle = "Mouvement de stock";
    params = {
        pageTitle: pageTitle,
        data: data,
        UserData: req.session.UserData,
        materiauxList : materiauxList,
        materiauSelected : materiauSelected,
        dateFrom : dateFrom,
        dateTo : dateTo,
        dateFromDB : dateFromDB,
        dateToDB : dateToDB,
        page: 'StockMoving'
    };
    res.render('stock/mouvement-stock', params);
});

//ADD STOCK
router.post('/add-stock', async (req, res) => {
    if (helpers.is_session(req, res)) {
        console.log(req.body);
        console.log("USER ACT: " + req.session.username);
        let notifications = await stockDB.addStock(req);
        console.log("NOTIF : " + notifications);
        res.json(notifications);
    } else {
        res.redirect("http://localhost:8788/");
        console.log("Redirect to LOGIN");
    }
});

//ADD OR REMOVE ITEMS STOCK
router.post('/add-remove-stock', async (req, res) => {
    console.log(req.body);
    let numero_lot = req.body.lot;
    let materiauId = req.body.materiauId;
    let materiauName = req.body.materiauName;
    let transactionType = req.body.type;
    let qte = req.body.qte;
    let user = req.session.username;
    let commentaire = req.body.commentaire;;
    let notifications = await stockDB.RemoveItemFromStock(con, numero_lot, materiauId, materiauName, transactionType, qte, commentaire, user);
    console.log("ADD/REMOVE " + notifications.success);
    res.json(notifications);
});

//CHANGE STOCK STATUS
router.post('/change-stock-status', async (req, res) => {
    console.log(req.body);
    let statut = req.body.statut
    let lot = req.body.lod_id;
    let notifications = await stockDB.setStockStatus(lot, statut);
    res.json(notifications);
});

//LINK TEST TO MATERIAU
router.post('/link-test-materiau', async (req, res) => {
    let data = req.body;
    console.log(data);
    let notifications = { msg: "<font color='red'>Le nombre de matériau doit etre égal au nombre de quantité.</fon>" };
    if (data.qte) {
        if (data.qte.length == data.materiau.length) {
            console.log("QTE : " + data.qte.length);
            notifications = await stockDB.linkTestToMateriau(req);
        }
    } else {
        console.log("NO DATA");
    }
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
            if (qte_dispo == null) { qte_dispo = 0; }
            let diference = qte_dispo - qte_to_use;
            if (diference < 0) {
                let sms = pos + "- <font color='red'>Pas assez de <strong>" + materiauName + "</strong> en stock. QTE DISPO : " + qte_dispo + "</font>";
                alert.push(sms);
            } else {
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

//======================== PRINT INVENTORY REPORT ================================

router.post('/print-inventory-report', async (req, res) => {
    console.log(req.body);
    let statut = 'All';
    let materiauSelected = "All";
    if (req.body.statut) { statut = req.body.statut; }
    if (req.body.materiauSelected) { materiauSelected = req.body.materiauSelected; }
    let data = "";
    if (statut == "Critique") {
        data = await stockDB.listOfAllAlertStock(materiauSelected, global.NBJOUR_STOCK_ALERT);
    } else if (statut == "Expiré") {
        data = await stockDB.listOfAllExpiredStock(materiauSelected);
    } else if (statut == "Valide") {
        data = await stockDB.listOfAllValidStock(materiauSelected);
    } else {
        data = await stockDB.listOfAllStock(materiauSelected);
    }
    let dateN = helpers.getCurrentDate();
    statut_text = statut != "All" ? statut + "s" : "";
    let pageTitle = "Inventaire des stocks " + statut_text + " pour le " + helpers.formatDate(dateN, "FR");
    let report = dateN;
    let filename = report + ".pdf";
    let pathfile = "./tmp/" + filename;
    let template_name = "inventory";
    params = {
        data: data,
        pageTitle: pageTitle
    };
    await printer.print(template_name, params, pathfile);
    //Display the file in the browser
    var stream = fs.ReadStream(pathfile);
    // Be careful of special characters
    filename = encodeURIComponent(filename);
    // Ideally this should strip them
    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    stream.pipe(res);
});

//PRINT STOCK MOVE /print-stock-move-report
router.post('/print-stock-move-report', async (req, res) => {
    console.log(req.body);
    let dateFrom = req.body.DateFrom;
    let dateTo = req.body.DateTo;
    let materiauSelected = 'All';
    let infoMateriau = [];
    if (req.body.materiauSelected) { 
        materiauSelected = req.body.materiauSelected;
        infoMateriau = await stockDB.getMateriau(materiauSelected);
     }
    //DATES
    let data = await stockDB.stockMoving(dateFrom,dateTo,materiauSelected);
    console.log(infoMateriau);
    let dateN = helpers.getCurrentDate();
    let text_date = "";
    materiauSelected = materiauSelected="All" ? "" : infoMateriau.nom_materiau;
    if (dateFrom == dateTo) {
        text_date = "pour le " + helpers.formatDate(dateFrom, "FR");
    } else {
        text_date = "Du " + helpers.formatDate(dateFrom, "FR") + " au " + helpers.formatDate(dateTo, "FR");
    }
    let pageTitle = "Mouvement de stock " + materiauSelected + "  " + text_date;
    let report = "stock-move-"+dateN;
    let filename = report + ".pdf";
    let pathfile = "./tmp/" + filename;
    let template_name = "stock-move";
    params = {
        data: data,
        pageTitle: pageTitle
    };
    await printer.print(template_name, params, pathfile);
    //Display the file in the browser
    var stream = fs.ReadStream(pathfile);
    // Be careful of special characters
    filename = encodeURIComponent(filename);
    // Ideally this should strip them
    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    stream.pipe(res);
});




// Exportation of this router
module.exports = router;
