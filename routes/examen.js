//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const helpers = require('../helpers/helpers');
const examenDB = require('../controllers/examenController.js');
const testDB = require('../controllers/testController.js');
const patientDB = require('../controllers/patientController');
const helpers = require('../helpers/helpers');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
// ADD EXAM
router.get('/add-examens', async (req, res) => {
    let pageTitle = "Nouvel examen";
    params = {
        pageTitle: pageTitle,
        page: 'NewExam'
    };
    res.render('examens/add-examens', params);
});

router.post('/add-examens', async (req, res) => {
    console.log(req.body);
    let notifications = await examenDB.saveExam(req, res);
    console.log(notifications);
    let pageTitle = "Nouvel examen";
    params = {
        pageTitle: pageTitle,
        notifications: notifications,
        page: 'NewExam'
    };
    res.render('examens/add-examens', params);
});

// //EXAMS LIST
router.get('/examens', async (req, res) => {
    let data = await examenDB.listOfExams();
    let pageTitle = "Liste des examens";
    params = {
        pageTitle: pageTitle,
        data: data,
        page: 'ExamsList'
    };
    res.render('examens/examens-list', params);
});

//ADD TEST PARAMETERS
router.get('/add-test-parameters', async (req, res) => {
    let examID = req.query.exam;
    let data = await examenDB.getExamById(examID);
    let exam = data.nom_examen;
    let examsParameters = await examenDB.listOfExamsParameters();
    console.log("EDIT : " + data.nom_examen);
    let pageTitle = "Paramètres du test '" + exam + "'";
    params = {
        pageTitle: pageTitle,
        data: examsParameters,
        examID: examID,
        exam: exam,
        page: 'NewExam'
    };
    res.render('examens/add-test-parameters', params);
});

router.post('/add-test-parameters', async (req, res) => {
    console.log(req.body);
    let notifications = await examenDB.saveTestParameters(req);
    res.json(notifications);
});

// ============================================== TEST LABORATOIRE PATIENTS ====================================

router.get('/test-laboratoire', async (req, res) => {
    let pageTitle = "Demande de  test laboratoire";
    let data = await patientDB.listOfAllPatients();
    let dataExam = await examenDB.listOfExams();
    let patientSelected = -1;
    params = {
        pageTitle: pageTitle,
        data: data,
        dataExam: dataExam,
        patientSelected: patientSelected,
        page: 'NewTest'
    };
    res.render('examens/add-test-patient', params);
});

router.post('/test-laboratoire', async (req, res) => {
    let pageTitle = "Demande de  test laboratoire";
    let data = await patientDB.listOfAllPatients();
    let dataExam = await examenDB.listOfExams();
    let patientSelected = -1;
    if (req.body.patientSelected) {
        patientSelected = req.body.patientSelected;
    }
    params = {
        pageTitle: pageTitle,
        data: data,
        dataExam: dataExam,
        patientSelected: patientSelected,
        page: 'NewTest'
    };
    res.render('examens/add-test-patient', params);
});


router.post('/save-test-request', async (req, res) => {
    console.log(req.body);
    let notifications = await testDB.saveTestRequest(req);
    res.json(notifications);
});

//LIST DES TESTS
router.get('/Tests', async (req, res) => {
    let dateFrom = helpers.getCurrentDate();
    let dateTo = helpers.getCurrentDate(); 
    let status = "All";
    let data = await testDB.testRequestlist(dateFrom,dateTo,status);
    let pageTitle = "Tests laboratoire ("+data.length+")";
    //DATES
    dateFrom = helpers.formatDate(dateFrom,"FR");
    dateFrom = helpers.changeDateSymbol(dateFrom);
    dateTo = helpers.formatDate(dateTo,"FR");
    dateTo = helpers.changeDateSymbol(dateTo);

    params = {
        pageTitle: pageTitle,
        data: data,
        dateFrom : dateFrom,
        dateTo : dateTo,
        statut : status,
        page: 'ListTest'
    };
    res.render('examens/test-request-list', params);
});
router.post('/Tests', async (req, res) => {
    console.log(req.body);
    let dateFrom = req.body.dateFrom;
    let dateTo = req.body.dateTo; 
    let status = req.body.statut;
    dateFromDB = helpers.formatDate(dateFrom,"EN");
    dateToDB = helpers.formatDate(dateTo,"EN");
    let data = await testDB.testRequestlist(dateFromDB,dateToDB,status);
    let text_status = status !="All" ? TEST_STATUS[status] : ""; 
    let pageTitle = "Tests laboratoire "+text_status+" ("+data.length+")";
    //DATES
    // dateFrom = helpers.formatDate(dateFrom,"FR");
    // dateFrom = helpers.changeDateSymbol(dateFrom);
    // dateTo = helpers.formatDate(dateTo,"FR");
    // dateTo = helpers.changeDateSymbol(dateTo);
    params = {
        pageTitle: pageTitle,
        data: data,
        dateFrom : dateFrom,
        dateTo : dateTo,
        statut : status,
        page: 'ListTest'
    };
    res.render('examens/test-request-list', params);
});

// Exportation of this router
module.exports = router;
