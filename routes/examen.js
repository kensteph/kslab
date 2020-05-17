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
    if (typeof req.session.UserData != "undefined") {
        if (req.session.UserData.user_sub_menu_access.includes("Ajouter examens") || req.session.UserData.user_sub_menu_access[0] == "All") {
            /// FULL ACCESS
            let pageTitle = "Nouvel examen";
            params = {
                pageTitle: pageTitle,
                UserData: req.session.UserData,
                page: 'NewExam'
            };
            res.render('examens/add-examens', params);

        } else {
            res.redirect(global.USER_HOME_PAGE);
        }

    } else {
        res.redirect("/");
    }
});

router.post('/add-examens', async (req, res) => {
    console.log(req.body);
    let notifications = await examenDB.saveExam(req, res);
    console.log(notifications);
    let pageTitle = "Nouvel examen";
    params = {
        pageTitle: pageTitle,
        notifications: notifications,
        UserData : req.session.UserData,
        page: 'NewExam'
    };
    res.render('examens/add-examens', params);
});

// //EXAMS LIST
router.get('/examens', async (req, res) => {
    if (typeof req.session.UserData != "undefined") {
        if (req.session.UserData.user_sub_menu_access.includes("Voir la liste des examens") || req.session.UserData.user_sub_menu_access[0] == "All") {
            /// FULL ACCESS
            let data = await examenDB.listOfExams();
            let pageTitle = "Liste des examens";
            params = {
                pageTitle: pageTitle,
                data: data,
                UserData: req.session.UserData,
                page: 'ExamsList'
            };
            res.render('examens/examens-list', params);

        } else {
            res.redirect(global.USER_HOME_PAGE);
        }

    } else {
        res.redirect("/");
    }
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
        UserData : req.session.UserData,
        page: 'NewExam'
    };
    res.render('examens/add-test-parameters', params);
});

router.post('/add-test-parameters', async (req, res) => {
    console.log(req.body);
    let notifications = await examenDB.saveTestParameters(req);
    res.json(notifications);
});
//SAVE TEST VALEURS NORMALES
router.post('/save-test-valeurs-normales', async (req, res) => {
    console.log(req.body);
    let notifications = await testDB.addValeursNormales(req);
    res.json(notifications);
});

//ASSOCIATION TEST-MATERIAUX 
router.get('/add-test-materiaux', async (req, res) => {
    let examID = req.query.test;
    let data = await examenDB.getExamById(examID);
    let matAssos = await stockDB.listeMateriauxAssocieATest(examID);
    let exam = data[0].nom_examen;
    let materiaux = await stockDB.listOfMateriaux("All");
    console.log(matAssos);
    let pageTitle = "Matériaux inventoriés associés au test '" + exam + "'";
    params = {
        pageTitle: pageTitle,
        data: materiaux,
        examID: examID,
        exam: exam,
        UserData : req.session.UserData,
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
    //console.log("USER : "+req.session.user);
    params = {
        pageTitle: pageTitle,
        data: data,
        dataExam: dataExam,
        patientSelected: patientSelected,
        UserData : req.session.UserData,
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
        UserData : req.session.UserData,
        page: 'NewTest'
    };
    res.render('examens/add-test-patient', params);
});

//SAVE TEST REQUEST

router.post('/save-test-request', async (req, res) => {
    console.log(req.body);
    let notifications = await testDB.saveTestRequest(req);
    res.json(notifications);
});

//LIST DES TESTS
router.get('/Tests', async (req, res) => {
 if (typeof req.session.UserData != "undefined") {
        if (req.session.UserData.user_sub_menu_access.includes("Liste des demandes de Tests") || req.session.UserData.user_sub_menu_access[0] == "All") {
          /// FULL ACCESS
          let dateFrom = helpers.getCurrentDate();
          let dateTo = helpers.getCurrentDate();
          let status = "All";
          if (req.query.date && req.query.status) {
              dateFrom = "All";
              status = req.query.status;
          }
          console.log(dateFrom + " | " + status);
          let data = await testDB.testRequestlist(dateFrom, dateTo, status);
          let pageTitle = "Tests laboratoire (" + data.length + ")";
          console.log(data);
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
              UserData : req.session.UserData,
              page: 'ListTest'
          };
          res.render('examens/test-request-list', params);
        } else {
            res.redirect(global.USER_HOME_PAGE);
        }
    
    } else {
        res.redirect("/");
    }
});
router.post('/Tests', async (req, res) => {
    console.log("DATA :" + req.query);
    let dateFrom = req.body.dateFrom;
    let dateTo = req.body.dateTo;
    let status = req.body.statut;
    dateFromDB = helpers.formatDate(dateFrom, "EN");
    dateToDB = helpers.formatDate(dateTo, "EN");
    if (req.query.date && req.query.status) {
        dateFrom = "All";
        status = req.query.status;
    }
    console.log(dateFrom + " | " + status);
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
        UserData : req.session.UserData,
        page: 'ListTest'
    };
    res.render('examens/test-request-list', params);
});
//SAVE TEST RESULT
router.post('/SaveTestResult', async (req, res) => {
    console.log(req.body);
    let fullname = req.body.patientName;
    let num_patient = req.body.patientNumber;
    let docteur = req.body.docteur;
    let dossier_patient = fullname + " [" + num_patient + "]";
    let patientSelected = { fullname: fullname, num_patient: num_patient, dossier: dossier_patient, docteur: docteur };
    let id_test_request = req.body.testRequestId;
    let data = await examenDB.testRequestContent(id_test_request);
    //console.log(data);
    let pageTitle = "Enregistrement résultat pour :";
    params = {
        pageTitle: pageTitle,
        data: data,
        patientSelected: patientSelected,
        id_test_request: id_test_request,
        UserData : req.session.UserData,
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

//EDIT DOCTOR OR INSTITUTION 
router.post('/edit-doctor-info', async (req, res) => {
    let testRequestId = req.body.id_test_request;
    let doctor = req.body.Docteur;
    let notifications = await testDB.modifyDoctorInfo(testRequestId, doctor);
    res.json(notifications);
});

//EDIT TEST SIGNATURE
router.post('/update-test-signature', async (req, res) => {
    let testRequestId = req.body.testRequestId;
    let realisateur = req.body.realiser_par;
    let poste = req.body.poste;
    let notifications = await testDB.modifySignatureInfo(testRequestId, realisateur, poste);
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

//================================= PRINT TEST RESULT ===================================================
router.post('/display-test-result', async (req, res) => {
    console.log(req.body);
    let test_request_id = req.body.id_test_request;
    let patient = req.body.patient;
    let patientAge = req.body.patientAge;
    let patientSexe = req.body.patientSexe;
    let patientNumber = req.body.patientNumber;
    let docteur = req.body.docteur;
    let title = helpers.titleByAge(patientAge, patientSexe);
    console.log("YOU ARE A : " + title);
    let data = await examenDB.testRequestContent(test_request_id);
    let date_resultat = helpers.formatDate(helpers.getCurrentDate(), "FR");
    let resultaFinal = [];
    let valNorFinal = [];
    for (test of data) {
        //console.log("TESTS LIST : " + test.examen_id);
        //Pour chaque TEST on va chercher ses parametres
        let id_exam = test.examen_id;
        let name_exam = test.nom_examen;
        let type_exam_resultat = test.type_resultat;
        let infoParams = await examenDB.getExamParameters(id_exam);

        //POUR CHAQUE PARAMETRE ON VA RECUPERER le resultat
        let Resultats = [];
        let ValeurNormal = [];
        if (infoParams.length == 0) {
            infoParams = await examenDB.getExamById(id_exam);
            let testResult = await examenDB.getTestResult(test_request_id, id_exam);
            let VN = await testDB.valeurNormalExam(title, id_exam);
            if (typeof testResult == "undefined") {
                testResult = { resultat: "" };
            }
            if (typeof VN == "undefined") {
                VN = { vn: "" };
            }
            Resultats.push(testResult);
            ValeurNormal.push(VN);
        } else {
            // console.log("PARAMETERS FOR " + name_exam +"["+ type_exam_resultat+"]"+ " : " + infoParams[0]);

            for (testParam of infoParams) {
                //console.log(testParam);
                let testResult = await examenDB.getTestResult(test_request_id, testParam.id_param_exam);
                let VN = await testDB.valeurNormalExam(title, testParam.id_param_exam);
                //console.log(VN);
                if (typeof testResult == "undefined") {
                    testResult = { resultat: "" };
                }
                if (typeof VN == "undefined") {
                    VN = { vn: "" };
                }
                Resultats.push(testResult);
                ValeurNormal.push(VN);
            }
            //console.log(ValeurNormal);
        }

        let info = { TestName: name_exam, TestTypeResult: type_exam_resultat, Parameters: infoParams, Resultats: Resultats, VN: ValeurNormal };
        resultaFinal.push(info);
    }
    console.log("VN : " + resultaFinal[0].VN[3].vn);
    //console.log("FINAL : " + resultaFinal[0].Parameters[0].nom_examen + " : " + resultaFinal[0].Resultats[0].resultat);

    let pageTitle = "Résultat Tests Laboratoire";
    params = {
        pageTitle: pageTitle,
        data: resultaFinal,
        patient: patient,
        testNumber: test_request_id,
        patientNumber: patientNumber,
        patientSexe: patientSexe,
        docteur: docteur,
        date: date_resultat,
        UserData : req.session.UserData,
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

    let pageTitle = "Résultats Tests # " + test_request_id + " | " + patient;
    params = {
        pageTitle: pageTitle,
        data: resultaFinal,
        patient: patient,
        date: date_resultat,
        testRequestId: test_request_id,
        UserData : req.session.UserData,
        page: 'NewTest'
    };
    res.render('examens/display-test-result', params);
});

// ======================================== REPORTS ==============================================

//LIST DES TESTS
router.get('/lab-tests-report', async (req, res) => {
    let dateFrom = helpers.getCurrentDate();
    let dateTo = helpers.getCurrentDate();
    let status = "All";
    if (req.query.date && req.query.status) {
        dateFrom = "All";
        status = req.query.status;
    }
    console.log(dateFrom + " | " + status);
    let data = await testDB.testRquestListForPeriod(dateFrom, dateTo);
    console.log(data);
    let text_date = "";
    if (dateFrom == dateTo) {
        text_date = "Du " + helpers.formatDate(dateFrom, "FR");
    } else {
        text_date = "Du " + helpers.formatDate(dateFrom, "FR") + " au " + helpers.formatDate(dateTo, "FR");
    }

    let pageTitle = "Rapport des tests laboratoire " + text_date + " (" + data.length + ")";
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
        dateFromDB: helpers.getCurrentDate(),
        dateToDB: helpers.getCurrentDate(),
        statut: status,
        UserData : req.session.UserData,
        page: 'Administration'
    };
    res.render('examens/test-report', params);
});
router.post('/lab-tests-report', async (req, res) => {
    console.log("DATA :" + req.query);
    let dateFrom = req.body.dateFrom;
    let dateTo = req.body.dateTo;
    let status = req.body.statut;
    dateFromDB = helpers.formatDate(dateFrom, "EN");
    dateToDB = helpers.formatDate(dateTo, "EN");
    if (req.query.date && req.query.status) {
        dateFrom = "All";
        status = req.query.status;
    }
    // console.log(dateFrom+" | "+status);
    // let report = await testDB.singleTestReport(dateFromDB, dateToDB, 1);
    // console.log("NB TEST "+report);
    //
    let data = await testDB.testRquestListForPeriod(dateFromDB, dateToDB);
    console.log(data);
    let text_date = "";
    if (dateFromDB == dateToDB) {
        text_date = "Du " + helpers.formatDate(dateFromDB, "FR");
    } else {
        text_date = "Du " + helpers.formatDate(dateFromDB, "FR") + " au " + helpers.formatDate(dateToDB, "FR");
    }

    let text_status = status != "All" ? TEST_STATUS[status] : "";
    let pageTitle = "Rapport des tests laboratoire " + text_status + text_date + " (" + data.length + ")";
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
        dateFromDB: dateFromDB,
        dateToDB: dateToDB,
        statut: status,
        UserData : req.session.UserData,
        page: 'Administration'
    };
    res.render('examens/test-report', params);
});

//PRINT TEST REPORT
router.post('/print-test-report', async (req, res) => {
    console.log(req.body);
    let report = helpers.getCurrentDate();
    let filename = report + ".pdf";
    let pathfile = "./tmp/" + filename;
    let template_name = "report";
    let dateFrom = req.body.dateFrom;
    let dateTo = req.body.dateTo;
    let data = await testDB.testRquestListForPeriod(dateFrom, dateTo);
    console.log(data);
    let text_date = "";
    if (dateFrom == dateTo) {
        text_date = "du " + helpers.formatDate(dateFrom, "FR");
    } else {
        text_date = "du " + helpers.formatDate(dateFrom, "FR") + " au " + helpers.formatDate(dateTo, "FR");
    }
    let pageTitle = "Rapport des tests laboratoire " + text_date;
    params = {
        data: data,
        dateFrom: dateFrom,
        dateTo: dateTo,
        UserData : req.session.UserData,
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
    //res.render('examens/display-test-result', params);
});


// Exportation of this router
module.exports = router;
