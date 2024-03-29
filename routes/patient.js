//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const helpers = require('../helpers/helpers');
const patientDB = require('../controllers/patientController.js');
const testLabDB = require('../controllers/testController');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));

// ADD PATIENT
router.get('/add-patient', async (req, res) => {
    if (typeof req.session.UserData != "undefined") {
        if (req.session.UserData.user_sub_menu_access.includes("Ajouter Patient") || req.session.UserData.user_sub_menu_access[0] == "All") {
            /// FULL ACCESS
            let pageTitle = "Nouveau patient";
            params = {
                pageTitle: pageTitle,
                UserData: req.session.UserData,
                page: 'NewPatient'
            };
            res.render('patients/add-patient', params);
        } else {
            res.redirect(global.USER_HOME_PAGE);
        }

    } else {
        res.redirect("/");
    }
});

router.post('/add-patient', async (req, res) => {
    console.log(req.body);
    let notifications = await patientDB.savePatient(req, res);
    console.log(notifications);
    res.json(notifications);
});

// SEARCH PATIENT
router.post('/live-search-patient', async (req, res) => {
    //console.log(req.body);
    let key = req.body.key
    let patient = await patientDB.liveSearchPatient(key);
    //console.log(patient);
    res.json(patient);
});
//DISPLAY PATIENT SELECTED
router.get('/search-patient', async (req, res) => {
    console.log(req.query);
    let patient = req.query.liveSearch;
    let patientID = req.query.PatientSelected;
    let data = await patientDB.getPatientById(patientID);
    let dataExams = await testLabDB.testRequestlistPatient(patientID);
    let pageTitle = "Recherche | " + patient;
    params = {
        pageTitle: pageTitle,
        data: data,
        dataExams: dataExams,
        UserData: req.session.UserData,
        page: 'SearchPatient'
    };
    res.render('patients/patient-profile', params);
});
router.post('/search-patient', async (req, res) => {
    console.log(req.body);
    let patient = req.body.liveSearch;
    let patientID = req.body.PatientSelected;
    let data = await patientDB.getPatientById(patientID);
    let dataExams = await testLabDB.testRequestlistPatient(patientID);
    let pageTitle = "Recherche | " + patient;
    params = {
        pageTitle: pageTitle,
        data: data,
        dataExams: dataExams,
        UserData: req.session.UserData,
        page: 'SearchPatient'
    };
    res.render('patients/patient-profile', params);
});

//PATIENTS LIST
router.get('/patients', async (req, res) => {
    let data = await patientDB.listOfAllPatients();
    let pageTitle = "Liste des patients";
    params = {
        pageTitle: pageTitle,
        data: data,
        UserData: req.session.UserData,
        page: 'PatientsList'
    };
    res.render('patients/patient-list', params);
});

//EDIT PATIENT
router.get('/edit-patient', async (req, res) => {
    if (typeof req.session.UserData != "undefined") {
        if (req.session.UserData.user_sub_menu_access.includes("Modifier Patients") || req.session.UserData.user_sub_menu_access[0] == "All") {
            /// FULL ACCESS
            let patienID = req.query.patient;
            //console.log(patienID);
            let data = await patientDB.getPatientById(patienID);
            console.log("EDIT : " + data);
            let pageTitle = "Modification du patient : " + data.fullname;
            params = {
                pageTitle: pageTitle,
                data: data,
                patienID: patienID,
                UserData: req.session.UserData,
                page: 'PatientsList'
            };
            res.render('patients/add-patient', params);
        } else {
            res.redirect(global.USER_HOME_PAGE);
        }

    } else {
        res.redirect("/");
    }
});

router.post('/edit-patient', async (req, res) => {
    console.log(req.body);
    let notifications = await patientDB.updatePatient(req);
    // let data = await patientDB.getPatientById(req.body.patientID);
    res.json(notifications);
});

//DELETE PATIENT
router.post('/delete-patient', async (req, res) => {
    console.log(req.body);
    let notifications = await patientDB.removePatient(req);
    res.json(notifications);
});

// Exportation of this router
module.exports = router;
