//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const helpers = require('../helpers/helpers');
const patientDB = require('../controllers/patientController.js');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));
// ADD PATIENT
router.get('/add-patient', async (req, res) => {
    let pageTitle = "Nouveau patient";
    params = {
        pageTitle: pageTitle,
        page: 'NewPatient'
    };
    res.render('patients/add-patient', params);
});

router.post('/add-patient', async (req, res) => {
    console.log(req.body);
    let response = await patientDB.savePatient(req, res);
    console.log(response);
    let pageTitle = "Nouveau patient";
    params = {
        pageTitle: pageTitle,
        page: 'NewPatient'
    };
    res.render('patients/add-patient', params);
});

//PATIENTS LIST
router.get('/patients', async (req, res) => {
    let data = await patientDB.listOfAllPatients();
    let pageTitle = "";
    params = {
        pageTitle: pageTitle,
        data : data,
        page: 'PatientsList'
    };
    res.render('patients/patient-list', params);
});

//EDIT PATIENT
router.get('/edit-patient', async (req, res) => {
    let patienID = req.query.patient;
    //console.log(patienID);
    let data = await patientDB.getPatientById(patienID);
    console.log("EDIT : "+data);
    let pageTitle = "Modification du patient : "+data.fullname;
    params = {
        pageTitle: pageTitle,
        data : data,
        patienID : patienID,
        page: 'PatientsList'
    };
    res.render('patients/add-patient', params);
});

router.post('/edit-patient', async (req, res) => {
    let notifications = await patientDB.updatePatient(req);
    let data = await patientDB.getPatientById(req.body.patientID);
    //console.log(data);
    let pageTitle = "Modification du patient : ";
    params = {
        pageTitle: pageTitle,
        data : data,
        notifications : notifications,
        page: 'PatientsList'
    };
    res.render('patients/add-patient', params);
});

// Exportation of this router
module.exports = router;
