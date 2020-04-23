//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const helpers = require('../helpers/helpers');
const examenDB = require('../controllers/examenController.js');
const testDB = require('../controllers/testController.js');
const patientDB = require('../controllers/patientController');
const stockDB = require('../controllers/stockController.js');
const helpers = require('../helpers/helpers');
const fs = require('fs-extra');
const printer = require('../print/print');

// router.use(bodyParser.urlencoded({ extended: true }));
// router.use(express.static('public'));
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
    let exam = data[0].nom_examen;
    let examsParameters = await examenDB.listOfExamsParameters();
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

//ASSOCIATION TEST-MATERIAUX 
router.get('/add-test-materiaux', async (req, res) => {
    let examID = req.query.test;
    let data = await examenDB.getExamById(examID);
    let exam = data[0].nom_examen;
    let materiaux = await stockDB.listOfMateriaux();
    console.log(materiaux);
    let pageTitle = "Matériaux inventoriés associés au test '" + exam + "'";
    params = {
        pageTitle: pageTitle,
        data: materiaux,
        examID: examID,
        exam: exam,
        page: 'NewExam'
    };
    res.render('examens/add-test-materiaux', params);
});

router.post('/add-test-materiaux', async (req, res) => {
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
    // let id_exam = data.testId;
    // let info = await stockDB.getTestMateriaux(id_exam);
    // console.log("MATERIAUX : "+info);
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
    let data = await testDB.testRequestlist(dateFrom, dateTo, status);
    let pageTitle = "Tests laboratoire (" + data.length + ")";
    //DATES
    dateFrom = helpers.formatDate(dateFrom, "FR");
    dateFrom = helpers.changeDateSymbol(dateFrom);
    dateTo = helpers.formatDate(dateTo, "FR");
    dateTo = helpers.changeDateSymbol(dateTo);

    params = {
        pageTitle: pageTitle,
        data: data,
        dateFrom: dateFrom,
        dateTo: dateTo,
        statut: status,
        page: 'ListTest'
    };
    res.render('examens/test-request-list', params);
});
router.post('/Tests', async (req, res) => {
    console.log(req.body);
    let dateFrom = req.body.dateFrom;
    let dateTo = req.body.dateTo;
    let status = req.body.statut;
    dateFromDB = helpers.formatDate(dateFrom, "EN");
    dateToDB = helpers.formatDate(dateTo, "EN");
    let data = await testDB.testRequestlist(dateFromDB, dateToDB, status);
    let text_status = status != "All" ? TEST_STATUS[status] : "";
    let pageTitle = "Tests laboratoire " + text_status + " (" + data.length + ")";
    //DATES
    // dateFrom = helpers.formatDate(dateFrom,"FR");
    // dateFrom = helpers.changeDateSymbol(dateFrom);
    // dateTo = helpers.formatDate(dateTo,"FR");
    // dateTo = helpers.changeDateSymbol(dateTo);
    params = {
        pageTitle: pageTitle,
        data: data,
        dateFrom: dateFrom,
        dateTo: dateTo,
        statut: status,
        page: 'ListTest'
    };
    res.render('examens/test-request-list', params);
});
//SAVE TEST RESULT
router.post('/SaveTestResult', async (req, res) => {
    console.log(req.body);
    let fullname = req.body.patientName;
    let num_patient = req.body.patientNumber;
    let dossier_patient = fullname + " [" + num_patient + "]";
    let patientSelected = { fullname: fullname, num_patient: num_patient, dossier: dossier_patient };
    let id_test_request = req.body.testRequestId;
    let data = await examenDB.testRequestContent(id_test_request);
    //console.log(data);
    let pageTitle = "Enregistrement résultat pour :";
    params = {
        pageTitle: pageTitle,
        data: data,
        patientSelected: patientSelected,
        id_test_request: id_test_request,
        page: 'ListTest'
    };
    res.render('examens/save-test-patient', params);
});
//GET THES TEST'S PARAMETERS
router.post('/get-test-parameters', async (req, res) => {
    console.log(req.body);
    let id_exam = req.body.examID;
    let info = await examenDB.getExamParameters(id_exam);
    if (info.length == 0) {
        info = await examenDB.getExamById(id_exam);
    }
    // let testResult = await examenDB.getTestResult(5,6);
    // console.log(testResult);
    res.json(info);
});

//SAVE TEST RESULT TO DB
router.post('/save-test-result', async (req, res) => {
    console.log(req.body);
    let notifications = await examenDB.saveTestResult(req);
    res.json(notifications);
});

//UPDATE TEST STATUS
router.post('/update-test-status', async (req, res) => {
    console.log(req.body);
    let test_request_id = req.body.testRequestId;
    let statut = req.body.statut;
    let notifications = await examenDB.updateTestResultStatus(test_request_id, statut);
    res.json(notifications);
});
//
//GET THES TEST'S RESULT
router.post('/get-test-result', async (req, res) => {
    let tests_id = req.body.test;
    let test_request_id = req.body.testRequestId;
    let data = [];
    for (idTest of tests_id) {
        let testResult = await examenDB.getTestResult(test_request_id, idTest);
        data.push(testResult);
    }
    console.log(data);
    res.json(data);
});

//PRINT TEST RESULT
router.post('/display-test-result', async (req, res) => {
    console.log(req.body);
    let test_request_id = req.body.id_test_request;
    let patient = req.body.patient;
    let data = await examenDB.testRequestContent(test_request_id);
    let date_resultat = helpers.formatDate(helpers.getCurrentDate(), "FR");
    let resultaFinal = [];

    for (test of data) {
        console.log("TESTS LIST : " + test.examen_id);
        //Pour chaque TEST on va chercher ses parametres
        let id_exam = test.examen_id;
        let name_exam = test.nom_examen;
        let infoParams = await examenDB.getExamParameters(id_exam);

        //POUR CHAQUE PARAMETRE ON VA RECUPERER le resultat
        let Resultats = [];
        if (infoParams.length == 0) {
            infoParams = await examenDB.getExamById(id_exam);
            let testResult = await examenDB.getTestResult(test_request_id, id_exam);
            if (typeof testResult == "undefined") {
                testResult = { resultat: "" };
            }
            Resultats.push(testResult);
        } else {
            console.log("PARAMETERS FOR " + name_exam + " : " + infoParams[0]);
            
            for (testParam of infoParams) {
                //console.log(testParam);
                let testResult = await examenDB.getTestResult(test_request_id, testParam.id_param_exam);
                console.log(testResult);
                if (typeof testResult == "undefined") {
                    testResult = { resultat: "" };
                }
                Resultats.push(testResult);
            }
        }

        let info = { TestName: name_exam, Parameters: infoParams, Resultats: Resultats };
        resultaFinal.push(info);
    }

    console.log("FINAL : " + resultaFinal[0].Parameters[0].nom_examen + " : " + resultaFinal[0].Resultats[0].resultat);

    let pageTitle = "Résultat Tests Laboratoire";
    params = {
        pageTitle: pageTitle,
        data: resultaFinal,
        patient: patient,
        date: date_resultat,
        page: 'NewTest'
    };
    let filename = patient + ".pdf";
    let pathfile = "./tmp/" + filename;
    await printer.print('resultat', params, pathfile);
    //console.log(data);
    //Display the file in the browser
    var stream = fs.ReadStream(pathfile);
    // Be careful of special characters
    filename = encodeURIComponent(filename);
    // Ideally this should strip them
    res.setHeader('Content-disposition', 'inline; filename="' + filename + '"');
    res.setHeader('Content-type', 'application/pdf');
    stream.pipe(res);
    //res.render('examens/display-test-result', params);
});

//DISPLAY TEST RESULT
router.post('/verify-test-result', async (req, res) => {
    console.log(req.body);
    let test_request_id = req.body.id_test_request;
    let patient = req.body.patient;
    let data = await examenDB.testRequestContent(test_request_id);
    let date_resultat = helpers.formatDate(helpers.getCurrentDate(), "FR");
    let resultaFinal = [];
    for (test of data) {
        console.log("TESTS LIST : " + test.examen_id);
        //Pour chaque TEST on va chercher ses parametres
        let id_exam = test.examen_id;
        let name_exam = test.nom_examen;
        let infoParams = await examenDB.getExamParameters(id_exam);
        if (infoParams.length == 0) {
            infoParams = await examenDB.getExamById(id_exam);
        }
        console.log("PARAMETERS FOR " + name_exam + " : " + infoParams.length);
        //POUR CHAQUE PARAMETRE ON VA RECUPERER le resultat
        let Resultats = [];
        for (testParam of infoParams) {
            //console.log(testParam);
            let testResult = await examenDB.getTestResult(test_request_id, testParam.id_param_exam);
            console.log(testResult);
            if (typeof testResult == "undefined") {
                testResult = { resultat: "" };
            }
            Resultats.push(testResult);
        }

        let info = { TestName: name_exam, Parameters: infoParams, Resultats: Resultats };
        resultaFinal.push(info);
    }

    console.log("FINAL : " + resultaFinal[0].Parameters[0].nom_examen + " : " + resultaFinal[0].Resultats[0].resultat);

    let pageTitle = "Résultats Tests # "+test_request_id+" | "+patient;
    params = {
        pageTitle: pageTitle,
        data: resultaFinal,
        patient: patient,
        date: date_resultat,
        testRequestId  : test_request_id,
        
        page: 'NewTest'
    };
    res.render('examens/display-test-result', params);
});


// Exportation of this router
module.exports = router;
