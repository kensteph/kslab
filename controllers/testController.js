const con = require('./database');
const helpers = require('../helpers/helpers');
const examController = require('./examenController');
const stockDB = require('./stockController');

var self = module.exports = {
    //================================= TEST LABORATOIRE PATIENT ======================================
    //Add Valeurs Normales
    addValeursNormales: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let examId = req.body.examId;
            let bebe = req.body.bebe;
            let enfant = req.body.enfant;
            let ado = req.body.ado;
            let femme = req.body.femme;
            let homme = req.body.homme;
            let unite = req.body.unite;
            unite.replace("/", "//");
            let sql =
                'INSERT INTO tb_valeurs_normales (exam_id,bebe,enfant,adolescent,femme,homme,unite) VALUES (' + examId + ',"' + bebe + '","' + enfant + '","' + ado + '","' + femme + '","' + homme + '","' + unite + '")';
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                    // msg = {
                    //     error: " Vous avez déja enregistré ces valeurs ",
                    //     debug: err
                    // };
                    msg = self.editValeursNormales(req);
                } else {
                    msg = {
                        success:
                            "Valeurs enregistrées avec succès.",
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    //UPDATE TEST STATUS
    editValeursNormales: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let examId = req.body.examId;
            let bebe = req.body.bebe;
            let enfant = req.body.enfant;
            let ado = req.body.ado;
            let femme = req.body.femme;
            let homme = req.body.homme;
            let unite = req.body.unite;
            let sql =
                'UPDATE tb_valeurs_normales SET bebe="' + bebe + '",enfant="' + enfant + '",adolescent="' + ado + '",femme="' + femme + '",homme="' + homme + '",unite="' + unite + '" WHERE exam_id =' + examId;
            //console.log(sql);
            con.query(sql, function (err, result) {
                if (err) {
                    msg = {
                        error:
                            "<font color='red'><strong>Une erreur est survenue...</strong></font>",
                        debug: err
                    };
                } else {
                    msg = {
                        success: "<font color='green'><strong>Les informations ont été mise à jour</strong></font>",
                        nb_success: result.affectedRows,
                    };
                }

                resolve(msg);
                // console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    //Valeur Normale d'un test
    valeurNormalExam: async function (field_p, exam_id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            sql = "SELECT CONCAT(" + field_p + ",' ',unite ) as vn FROM tb_valeurs_normales WHERE exam_id=" + exam_id;
            //console.log(sql);
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //Save Test in the DB
    saveTestRequest: async function (req) {
        let promise = new Promise((resolve, reject) => {
            if (req.body.testSelected) { // Si ili y a test
                let patient = req.body.patient;
                let docteur = req.body.docteur;
                let user = req.session.username;
                //   /* Begin transaction */
                con.beginTransaction(function (err) {
                    if (err) { throw err; }
                    //Insert info into personne table
                    let sql = "INSERT INTO tb_test_requests (patient,docteur,acteur) VALUES ('" + patient + "','" + docteur + "','" + user + "')";
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
                        let testSelected = req.body.testSelected;
                        let nbTests = testSelected.length;
                        //console.log("NB TESTS : "+testSelected);
                        var values = [];
                        for (var i = 0; i < nbTests; i++) {
                            let test = testSelected[i]; //Parametres
                            //console.log("TESTS : "+test);
                            line = [];
                            line[0] = id_test_request;
                            line[1] = test;
                            values.push(line);
                        };

                        let sql2 = "INSERT INTO tb_test_requests_contents (test_request_id,examen_id) VALUES ?";
                        con.query(sql2, [values], async function (err, result) {
                            if (err) {
                                con.rollback(function () {
                                    throw err;
                                });
                            }
                            //UPDATE THE STOCK
                            //Pour chaque test demande on va verifier la disponibilite des materiaux
                            let alert = [];
                            for (test_id of testSelected) {
                                console.log(test_id);
                                let info = await stockDB.getTestMateriaux(test_id);
                                console.log(info);
                                //Pour chaque materiau verifier sa disponibilite
                                for (materiau of info) {
                                    let materiauID = materiau.materiau;
                                    let materiauName = materiau.nom_materiau;
                                    let qte_to_use = materiau.qte;
                                    let qte_dispo = await stockDB.countAvailableMateriaux(materiauID);
                                    if (qte_dispo == null) { qte_dispo = 0; }
                                    let diference = qte_dispo - qte_to_use;
                                    if (diference < 0) {
                                        let sms = "<font color='red'>Il n'y a pas assez de <strong>" + materiauName + "</strong>. QTE DISPO : " + qte_dispo + " < QTE A UTILISER : " + qte_to_use + "</font>";
                                        alert.push(sms);
                                    } else {
                                        console.log("GOOD TO GO ");
                                    }
                                    // console.log("QUANTITE DISPO : " + qte_dispo + " " +materiauName );
                                    // console.log("QUANTITE A UTILISER : " + qte_to_use + " " +materiauName );
                                    // console.log(alert); 
                                    let stockByMateriau = await stockDB.listOfAllStockByProduct(materiauID, 1);
                                    if (stockByMateriau.length == 0) {
                                        console.log("Pending transaction for " + materiauName + "...");
                                        await stockDB.pendingStockEvolution(con, materiauID, qte_to_use, test_id, id_test_request);
                                    }
                                    //ON VA PRELEVER LES MATERIAUX DANS LE STOCK LE PLUS ANCIEN
                                    let new_qte_to_take = qte_to_use;
                                    for (item of stockByMateriau) {
                                        console.log(stockByMateriau);
                                        let numero_lot = item.numero_lot;
                                        let materiauId = item.materiau;
                                        let materiauName = item.nom_materiau;
                                        let transactionType = "substract";
                                        let qte = new_qte_to_take;
                                        let commentaire = "";
                                        let qte_dispo_in_stock = item.qte_restante; //Current LOT
                                        let diff = qte_dispo_in_stock - qte;
                                        if (qte_dispo_in_stock <= 0) { //Si il n'y a plus de materiaux dissponible 
                                            console.log("Pending transaction for " + materiauName + "...");
                                            await stockDB.pendingStockEvolution(con, materiauId, qte, test_id, id_test_request);
                                        } else {
                                            if (qte_dispo_in_stock > qte) {
                                                commentaire = qte + " " + materiauName + " a été prélevé du stock pour le test # " + id_test_request;
                                                let rep = await stockDB.RemoveItemFromStock(con, numero_lot, materiauId, materiauName, transactionType, qte, commentaire, user, id_test_request);
                                                break; //On sort de la boucle parce qu'on a deja preleve
                                            } else {
                                                if (diff >= 0) {
                                                    commentaire = qte + " " + materiauName + " a été prélevé du stock pour le test # " + id_test_request;
                                                    let rep = await stockDB.RemoveItemFromStock(con, numero_lot, materiauId, materiauName, transactionType, qte, commentaire, user, id_test_request);
                                                    new_qte_to_take = new_qte_to_take - qte;
                                                }

                                            }
                                        }

                                    }
                                    // console.log(stockByMateriau);
                                }
                            }

                            //console.log("ALERT : " + alert);

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
                        "<font color='red'><strong>Vous devez choisir au moins un examen.</strong></font>",
                };
                resolve(msg);
            }
        });
        data = await promise;
        //console.log(data); 
        return data;
    },
    //LIST REQUEST TESTS
    testRequestlist: async function (dateFrom, dateTo, status) {
        let promise = new Promise((resolve, reject) => {
            let line = [];
            let sql = "";
            if (dateFrom == "All") {
                if (status == "All") { status = ""; } else { status = " AND tb_test_requests.statut =" + status; }
                sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,DATEDIFF( NOW(), date_nais )/365 as age,tb_test_requests.id as id_request,tb_test_requests.statut as test_status FROM tb_test_requests,tb_patients,tb_personnes WHERE tb_test_requests.patient=tb_patients.id_personne AND tb_patients.id_personne=tb_personnes.id " + status;
            } else {
                if (status == "All") { status = ""; } else { status = " AND tb_test_requests.statut =" + status; }
                sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,DATEDIFF( NOW(), date_nais )/365 as age,tb_test_requests.id as id_request,tb_test_requests.statut as test_status FROM tb_test_requests,tb_patients,tb_personnes WHERE tb_test_requests.patient=tb_patients.id_personne AND tb_patients.id_personne=tb_personnes.id AND DATE(date_record) BETWEEN '" + dateFrom + "' AND '" + dateTo + "'  " + status;

            }
            // console.log(sql);
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
                        let line_info = { request_id: item.id_request, date_record: item.date_record, numero_patient: item.numero_patient, patient: item.fullname, docteur: item.docteur, age: item.age, sexe: item.sexe, examens: patient_exams, statut: item.test_status, acteur: item.acteur };
                        line.push(line_info);
                    }
                    resolve(line);
                }

            });

        });
        data = await promise;
        return data;
    },
    //TEST REQUEST CONTENTS
    testRequestInfo: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_test_requests WHERE id = ? ";
            //console.log(sql+" ID : "+id);
            con.query(sql, id, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve([{ fullname: "" }]);
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

    //EDIT DOCTOR OR INSTITUTION
    modifyDoctorInfo: async function (id_test, doctor) {
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_test_requests SET docteur ='" + doctor + "' WHERE id =?";
            con.query(sql, id_test, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        error: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Le docteur/Institution " + doctor + " modifié avec succès.",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //EDIT SIGNATURE AU BAS DE LA PAGE
    modifySignatureInfo: async function (id_test, realisateur, poste) {
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_test_requests SET realiser_par ='" + realisateur + "',poste ='" + poste + "' WHERE id =?";
            con.query(sql, id_test, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        error: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Signature <strong>" + realisateur + "</strong> / <i>" + poste + "</i> ajouté avec succès.",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //DELETE TEST REQUEST
    deleteTestRequest: async function (id_test) {
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_test_requests WHERE id =?";
            con.query(sql, id_test, async function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        error: "danger",
                        debug: err
                    });
                } else {
                    //DELETE PENDING STOCK
                    await stockDB.deletePendingStockByRequestId(id_test);
                    let sql1 = "DELETE FROM tb_test_requests_contents WHERE test_request_id =?";
                    con.query(sql1, id_test, function (err, rows) {
                        if (err) {
                            resolve({
                                msg: "Une erreur est survenue. S'il vous palit réessayez.",
                                error: "danger",
                                debug: err
                            });
                        } else {
                            resolve({
                                msg: "Demande supprimée avec succès...",
                                success: "success"
                            });
                        }
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //DELETE TEST REQUEST SINGLE ITEM
    deleteSingleItemTestRequest: async function (test_request_id, id_exam) {
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_test_requests_contents WHERE test_request_id =? AND examen_id=?";
            con.query(sql, [test_request_id, id_exam], async function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        error: "danger",
                        debug: err
                    });
                } else {
                    let rep = {}
                    //VERIFY IF THERE IS PENDING STOCK FOR THIS ITEM
                    //stock pendant pour ce test
                    let pendingStock = await stockDB.getPendingStockForExamInTestRequest(TestRequestID, ExamID);
                    //DELETE PENDING STOCK
                    if (pendingStock.length > 0) {
                        rep = await stockDB.deletePendingStock(id_exam, test_request_id);
                    } else {
                        //GET MATERIAUX ASS A CE TEST
                        let materiauxLinked = await stockDB.listeMateriauxAssocieATest(id_exam);

                        for (item of materiauxLinked) {
                            //GET THE USED STOCK
                            let stockByMateriau = await stockDB.listOfAllStockByProduct(materiauID, 1);
                            //ADD THE QUANTITY USED BACK TO THE STOCK
                            let numero_lot = "";
                            let materiauId = "";
                            let materiauName = "";
                            let transactionType = "";
                            let qte = "";
                            let commentaire = "";
                            let user = "";
                            let request_id = "";
                            rep = await stockDB.RemoveItemFromStock(con, numero_lot, materiauId, materiauName, transactionType, qte, commentaire, user, request_id);
                        }
                    }

                    if (rep.success) {
                        resolve({
                            msg: "Demande supprimée avec succès...",
                            success: "success"
                        });
                    } else {
                        resolve({
                            msg: "Une erreur est survenue. S'il vous palit réessayez.",
                            error: "danger",
                            debug: err
                        });
                    }
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //LIST REQUEST TESTS
    singlePatientTestRequestlist: async function (patient) {
        let promise = new Promise((resolve, reject) => {
            let line = [];
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,tb_test_requests.id as id_request,tb_test_requests.statut as test_status FROM tb_test_requests,tb_patients,tb_personnes WHERE tb_test_requests.patient=tb_patients.id_personne AND tb_patients.id_personne=tb_personnes.id AND tb_personnes.id=? ORDER BY tb_test_requests.id DESC ";
            //console.log(sql);
            con.query(sql, patient, async function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    let test_name = [];
                    for (item of rows) {
                        let info = await examController.testRequestContent(item.id_request);
                        let ExamID = info[0].examen_id;
                        let infoExam = await examController.getExamById(ExamID);
                        // console.log("TEST CONTENT"+infoExam[0].nom_examen);
                        test_name.push(infoExam[0].nom_examen);
                        let examens = [];
                        for (var i = 0; i < info.length; i++) {
                            let test = { id: info[i].id, nom_examen: info[i].nom_examen };
                            examens.push(test);
                        }
                        //console.log(test_name);
                        let exam_line = test_name.join("|");
                        let line_info = { date_record: item.date_record, numero_patient: item.numero_patient, patient: item.fullname, examens: examens, statut: item.test_status, line_exam: exam_line, docteur: item.docteur };
                        line.push(line_info);
                    }
                    resolve(line);
                }

            });

        });
        data = await promise;
        return data;
    },
    //LIST REQUEST TESTS
    testRequestlistPatient: async function (patientID) {
        let promise = new Promise((resolve, reject) => {
            let line = [];
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,DATEDIFF( NOW(), date_nais )/365 as age,tb_test_requests.id as id_request,tb_test_requests.statut as test_status FROM tb_test_requests,tb_patients,tb_personnes WHERE tb_test_requests.patient=tb_patients.id_personne AND tb_patients.id_personne=tb_personnes.id  AND tb_patients.id_personne=? ORDER BY tb_test_requests.id DESC "
            // console.log(sql);
            con.query(sql, patientID, async function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    for (item of rows) {
                        let info = await examController.testRequestContent(item.id_request);
                        let examens = [];
                        for (var i = 0; i < info.length; i++) {
                            examens.push(info[i].nom_examen);
                        }
                        let patient_exams = examens.join("|");
                        //console.log(patient_exams);
                        let dateExam = helpers.formatDate(item.date_record.substring(0, 10), "FR");
                        let line_info = { request_id: item.id_request, date_record: dateExam, numero_patient: item.numero_patient, patient: item.fullname, docteur: item.docteur, age: item.age, sexe: item.sexe, examens: patient_exams, statut: item.test_status };
                        line.push(line_info);
                    }
                    resolve(line);
                }

            });

        });
        data = await promise;
        return data;
    },
    //VERIFY IF ALL RESULT IS SAVED FOR A TEST REQUEST
    testResultSavedVerification: async function (id_test_request) {
        let ifCompleted = false;
        let countResultsToSave = 0;
        let data = await examController.testRequestContent(id_test_request);
        for (item of data) {
            let testParams = await examController.getExamParameters(item.examen_id);
            let nbEx = testParams.length == 0 ? 1 : testParams.length;
            countResultsToSave += nbEx
            console.log(item.nom_examen + " : " + nbEx);
        }
        let countSavedResultsForATestRequest = await examController.countSavedResultsForATestRequest(id_test_request);
        console.log("TEST RESULT ALREADY SAVED : " + countSavedResultsForATestRequest + " TEST TO SAVE : " + countResultsToSave);

        if (countSavedResultsForATestRequest >= countResultsToSave) {
            ifCompleted = true;
            await examController.updateTestResultStatus(id_test_request, 1);
        }
        return { ifCompleted: ifCompleted, TestRequestContent: data };
    },
    //======================== RAPPORT DES TESTS =================================================
    singleTestReport: async function (dateFrom, dateTo, exma_id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(examen_id) as nb FROM tb_test_requests_contents WHERE DATE(date_record) BETWEEN '" + dateFrom + "' AND '" + dateTo + "' AND examen_id =?";
            //console.log(sql);
            con.query(sql, exma_id, async function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows[0].nb);
                }

            });

        });
        data = await promise;
        return data;
    },
    //LISTE DES TESTS EFFECTUES POUR UNE PERIODE
    testRquestListForPeriod: async function (dateFrom, dateTo) {
        let promise = new Promise((resolve, reject) => {
            let line = [];
            let sql = "SELECT DISTINCT(examen_id) as examen_id FROM tb_test_requests_contents WHERE DATE(date_record) BETWEEN '" + dateFrom + "' AND '" + dateTo + "' ORDER BY id";
            //console.log(sql);
            con.query(sql, async function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    // console.log("RESULT " + rows);
                    for (item of rows) {
                        //console.log("ITEM"+item.examen_id);
                        //Info about the exam
                        let infoExam = await examController.getExamById(item.examen_id);
                        if (typeof infoExam[0] != "undefined") {
                            //console.log("EXAM " + infoExam[0].nom_examen);
                            let qteDemande = await self.singleTestReport(dateFrom, dateTo, item.examen_id);
                            let line_info = {
                                Examen: infoExam[0].nom_examen,
                                qty: qteDemande
                            };
                            line.push(line_info);
                        }

                    }
                    resolve(line);
                }
            });
        });
        data = await promise;
        //console.log(data); 
        return data;
    },

    test: async function () {
        let info = await examController.getExamById(1);
        console.log(info);
    }


}