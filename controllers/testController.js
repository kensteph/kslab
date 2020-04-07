const con = require('./database');
const helpers = require('../helpers/helpers');
const examController = require('./examenController');
var self = module.exports = {
    //================================= TEST LABORATOIRE PATIENT ======================================
    //Save Teacher in the DB
    async saveTestRequest(req) {
        let promise = new Promise((resolve, reject) => {
            if (req.body.testSelected) { // Si ili y a test
                let patient = req.body.patient;
                //   /* Begin transaction */
                con.beginTransaction(function (err) {
                    if (err) { throw err; }
                    //Insert info into personne table
                    let sql = "INSERT INTO tb_test_requests (patient) VALUES ('" + patient + "')";
                    con.query(sql, function (err, result) {
                        if (err) {
                            console.log(err);
                            con.rollback(function () {
                                throw err;
                            });
                        }
                        var id_test_request = result.insertId;
                        //Insert info into tb_test_requests_contents  table
                        //BULK INSERTION
                        let testSelected = req.body.testSelected
                        var values = [];
                        for (var i = 0; i < testSelected.length; i++) {
                            let test = testSelected[i]; //Parametres
                            line = [];
                            line[0] = id_test_request;
                            line[1] = test;
                            values.push(line);
                        };

                        let sql2 = "INSERT INTO tb_test_requests_contents (test_request_id,examen_id) VALUES ?";
                        con.query(sql2, [values], function (err, result) {
                            if (err) {
                                con.rollback(function () {
                                    throw err;
                                });
                            }

                            //COMMIT IF ALL DONE COMPLETELY
                            con.commit(function (err) {
                                if (err) {
                                    con.rollback(function () {
                                        msg = {
                                            type: "danger",
                                            msg:
                                                "<font color='red'><strong>Une erreur est survenue. Veuillez réessayer s'il vous plait.</strong></font>",
                                        };
                                        resolve(msg);
                                        throw err;
                                    });
                                }
                                msg = {
                                    type: "success",
                                    success: true,
                                    msg: "<font color='green'>Nouvelle demande de test laboratoire ajoutée avec succès...</font>"
                                }
                                resolve(msg);
                            });

                        });
                    });
                });
                /* End transaction */
            } else {
                msg = {
                    type: "danger",
                    msg:
                        "<font color='red'><strong>Vous devez choisir au moin un examen.</strong></font>",
                };
                resolve(msg);
            }
        });
        data = await promise;
        //console.log(data); 
        return data;
    },
    //LIST REQUEST TESTS
    testRequestlist: async function (dateFrom,dateTo,status) {
        let promise = new Promise((resolve, reject) => {
            let line = [];
            if(status ==  "All"){ status ="";}else{  status =" AND tb_test_requests.statut ="+status;}
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,tb_test_requests.id as id_request,tb_test_requests.statut as test_status FROM tb_test_requests,tb_patients,tb_personnes WHERE tb_test_requests.patient=tb_patients.id_personne AND tb_patients.id_personne=tb_personnes.id AND DATE(date_record) BETWEEN '"+dateFrom+"' AND '"+dateTo+"'  "+status;
            console.log(sql);
            con.query(sql, async function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    for (item of rows) {
                        let info = await examController.testRequestContent(item.id_request);
                        let examens = [];
                        for (var i = 0; i < info.length; i++) {
                            examens.push(info[i].nom_examen);
                        }
                        let patient_exams = examens.join();
                        let line_info = { date_record: item.date_record, numero_patient: item.numero_patient, patient : item.fullname, examens: patient_exams,statut : item.test_status };
                        line.push(line_info);
                    }
                    resolve(line);
                }

            });

        });
        data = await promise;
        return data;
    },

}