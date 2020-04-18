//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const fs = require('fs');
// const helpers = require('../helpers/helpers');
const stockDB = require('../controllers/stockController.js');
const printer = require('../print/print');
router.use(bodyParser.urlencoded({ extended: true }));
router.use(express.static('public'));

// PRINT RESULTAT
router.post('/print-resultat', async (req, res) => {
    let data={"items" : "StudentInfo"} ;//helpers.getJsonData();
    let filename = "student-list.pdf";
    let pathfile = "./"+filename;
    await printer.print('invoice',data,pathfile);
    //console.log(data);
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
