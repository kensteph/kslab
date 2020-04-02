//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
// const helpers = require('../helpers/helpers');
const examenDB = require('../controllers/examenController.js');
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
    let notifications  = await examenDB.saveExam(req, res);
    console.log(notifications);
    let pageTitle = "Nouvel examen";
    params = {
        pageTitle: pageTitle,
        notifications : notifications,
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
        data : data,
        page: 'ExamsList'
    };
    res.render('examens/examens-list', params);
});

 //ADD TEST PARAMETERS
router.get('/add-test-parameters', async (req, res) => {
    let examID = req.query.exam;
    //console.log(patienID);
    // let data = await patientDB.getPatientById(patienID);
    // console.log("EDIT : "+data);
    let pageTitle = "Parametres du test";
    params = {
        pageTitle: pageTitle,
        //data : data,
        examID : examID,
        page: 'AddTestParameters'
    };
    res.render('examens/add-test-parameters', params);
});

// router.post('/edit-patient', async (req, res) => {
//     let notifications = await patientDB.updatePatient(req);
//     let data = await patientDB.getPatientById(req.body.patientID);
//     //console.log(data);
//     let pageTitle = "Modification du patient : ";
//     params = {
//         pageTitle: pageTitle,
//         data : data,
//         notifications : notifications,
//         page: 'PatientsList'
//     };
//     res.render('patients/add-patient', params);
// });

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
