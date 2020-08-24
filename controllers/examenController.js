const con = require('./database');
const helpers = require('../helpers/helpers');
var self = module.exports = {
    //Save Exam
    saveExam: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let nom_examen = req.body.nomExamen;
            let type_examen = req.body.typeResultat;
            let ifbilan = req.body.ifbilan;
            let ifTest = req.body.is_test;
            let sql =
                'INSERT INTO tb_examens (nom_examen,type_resultat,is_bilan,if_test_or_param_test) VALUES (?,?,?,?)';
            con.query(sql, [nom_examen, type_examen, ifbilan, ifTest], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté " + nom_examen + " ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg:
                            nom_examen + " enregistré avec succès.",
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },

    //Save Modalites paiement
    editExam: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let examen = req.body.examen;
            let examenID = req.body.examenID;
            let type_resultat = req.body.typeResultat;
            let is_bilan = req.body.is_bilan;
            let is_test = req.body.is_test;
            let sql =
                'UPDATE tb_examens SET nom_examen=?, type_resultat =?, is_bilan=?,if_test_or_param_test=? WHERE id=?';
            // console.log(sql);
            con.query(sql, [examen, type_resultat, is_bilan, is_test, examenID], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "<font color='red'><strong>Vous avez déja attribué ces paramètres.</strong></font>",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        success: true,
                        msg:
                            "<font color='green'><strong> " + examen + " modifié avec succès...</strong></font>",
                        nb_success: result.affectedRows,
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },

    //Load All The Courses Categories
    listOfExams: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_examens ORDER BY nom_examen ";
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        //console.log(data); 
        return data;
    },
    //LIST OF ALL TEST PARAMETERS
    listOfExamsParameters: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_examens WHERE if_test_or_param_test=0 ";
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        //console.log(data); 
        return data;
    },

    //LIST OF ALL TEST 
    listOfTests: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_examens WHERE if_test_or_param_test=1 ORDER BY nom_examen";
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        //console.log(data); 
        return data;
    },
    //Load All The Courses Categories
    getExamById: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_examens WHERE id = ? ";
            //console.log(sql + " ID : " + id);
            con.query(sql, id, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve([{ fullname: "" }]);
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

    //Save Modalites paiement
    saveTestParameters: async function (req) {
        let promise = new Promise((resolve, reject) => {
            examID = req.body.examID;

            if (req.body.testParameters) {
                //BULK INSERTION
                testParameters = req.body.testParameters;
                var values = [];
                for (var i = 0; i < testParameters.length; i++) {
                    let test = testParameters[i]; //Parametres
                    line = [];
                    line[0] = examID;
                    line[1] = test;
                    values.push(line);
                }

                let sql =
                    'INSERT INTO tb_parametres_examens (id_examen,id_param_exam) VALUES ?';
                con.query(sql, [values], function (err, result) {
                    if (err) {
                        msg = {
                            type: "danger",
                            msg:
                                "<font color='red'><strong>Vous avez déja attribué ces paramètres.</strong></font>",
                            debug: err
                        };
                    } else {
                        msg = {
                            type: "success",
                            success: true,
                            msg:
                                "<font color='green'><strong>Paramètres attribués avec succès...</strong></font>",
                            nb_success: result.affectedRows,
                        };
                    }

                    resolve(msg);
                    //console.log(msg);
                });
            } else {
                msg = {
                    type: "danger",
                    msg:
                        "<font color='red'><strong>Vous devez choisir des paramètres.</strong></font>",
                };
                resolve(msg);
            }
        });
        rep = await promise;
        return rep;
    },
    //Delete PATIENT
    removeItem: async function (req) {
        let examID = req.body.examID;
        let itemID = req.body.itemID;
        let itemName = req.body.itemName;
        let action = req.body.action;
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            if (action == "P") {
                sql = "DELETE FROM tb_parametres_examens  WHERE id_examen =" + examID + " AND id_param_exam=" + itemID;
            } else if (action == "VN") {
                sql = "DELETE FROM tb_valeurs_normales  WHERE exam_id =" + examID;
            } else {
                sql = "DELETE FROM tb_link_materiau_test  WHERE test_id =" + examID + " AND materiau=" + itemID;
            }
            //console.log(sql);
            con.query(sql, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        error: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: itemName + " supprimé avec succès.",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //TEST REQUEST CONTENTS
    testRequestContent: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_test_requests_contents,tb_examens WHERE tb_test_requests_contents.examen_id=tb_examens.id AND  test_request_id = ? ";
            //console.log(sql+" ID : "+id);
            con.query(sql, id, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve([{ fullname: "" }]);
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //TEST REQUEST CONTENTS
    getExamParameters: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_parametres_examens,tb_examens WHERE tb_parametres_examens.id_param_exam=tb_examens.id AND id_examen = ? ORDER BY position,nom_examen ";
            //console.log(sql+" ID : "+id);
            con.query(sql, id, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve([{ fullname: "" }]);
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //SET EXAM POSITION
    reOrderExam: async function (id_examen, id_param_exam, position) {
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_parametres_examens SET position =? WHERE id_examen =? AND id_param_exam=?";
            con.query(sql, [position, id_examen, id_param_exam], function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous plait réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "La position a été modifiée avec succès.",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

    //TEST REQUEST COUNT SAVED RESULT
    countSavedResultsForATestRequest: async function (test_request_id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(examen_id) as nb_resultat_saved FROM tb_resultats WHERE test_request_id = ? ";
            //console.log(sql + " ID : " + test_request_id);
            con.query(sql, test_request_id, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve([{ fullname: "" }]);
                } else {
                    resolve(rows[0].nb_resultat_saved);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //SELECT CONCAT('BEBE : ',bebe,' ENFANT : ',enfant,' ADO :',adolescent,' FEMME : ',femme,' HOMME : ',homme,' ',unite) FROM tb_valeurs_normales WHERE 1
    //TEST REQUEST CONTENTS
    getExamNormalValues: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT exam_id,CONCAT('BEBE : ',bebe,' ENFANT : ',enfant,' ADO :',adolescent,' FEMME : ',femme,' HOMME : ',homme,' ',unite) as  vn FROM tb_valeurs_normales WHERE  exam_id = ? ";
            //console.log(sql+" ID : "+id);
            con.query(sql, id, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve([{ fullname: "" }]);
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //TEST SIGNATURE
    deleteExam: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM  tb_examens WHERE id=? ";
            //console.log(sql+" ID : "+id);
            con.query(sql, id, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve({
                        msg: "Une erreur est survenue. S'il vous plait réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Suppression effectuée avec succès....",
                        success: true,
                        debug: err
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //============================= SAVE TEST RESULT ==================================================
    //Save Test Result
    saveTestResult: async function (req) {
        let promise = new Promise((resolve, reject) => {
            if (req.body.test) {
                //BULK INSERT
                let test_request_id = req.body.testRequestId;
                let tests_id = req.body.test;
                let testResults = req.body.resultat;
                let ExamParent = req.body.ExamID;
                let values = [];
                let pos = 0;

                for (item of testResults) {
                    let resultat = testResults[pos];
                    let examen_id = tests_id[pos];
                    let saveID = test_request_id + "" + ExamParent + "" + examen_id;
                    let line = [];
                    line[0] = test_request_id;
                    line[1] = examen_id;
                    line[2] = ExamParent;
                    line[3] = resultat;
                    line[4] = saveID;
                    values.push(line);
                    pos++;
                }
                let sql =
                    'INSERT INTO tb_resultats (test_request_id,examen_id,exam_parent,resultat,id_save) VALUES ?';
                con.query(sql, [values], async function (err, result) {
                    if (err) {
                        msg = {
                            type: "danger",
                            msg:
                                "<font color='red'><strong>Vous avez déja  enregistré ces résultats.</strong></font>",
                            debug: err
                        };
                    } else {
                        // UPDATE TEST STATUS
                        //let rep = await self.updateTestResultStatus(test_request_id, 1);
                        msg = {
                            type: "success",
                            success: true,
                            msg:
                                "<font color='green'><strong>Résultat enregistré avec succès...</strong></font>",
                            nb_success: result.affectedRows,
                        };
                    }

                    resolve(msg);
                    //console.log(msg);
                });
            } else {
                msg = {
                    type: "danger",
                    msg:
                        "<font color='red'><strong>Vous devez choisir des paramètres.</strong></font>",
                };
                resolve(msg);
            }
        });
        rep = await promise;
        return rep;
    },
    //Save Single Test Result
    saveSingleTestResult: async function (test_request_id, examen_id, resultat, save_id, exam_parent) {
        let promise = new Promise((resolve, reject) => {
            let sql =
                'INSERT INTO tb_resultats (test_request_id,examen_id,exam_parent,resultat,save_id) VALUES (?,?,?,?,?)';
            con.query(sql, [test_request_id, examen_id, exam_parent, resultat, save_id], async function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "<font color='red'><strong>Vous avez déja  enregistré ces résultats.</strong></font>",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        success: true,
                        msg:
                            "<font color='green'><strong>Résultat enregistré avec succès...</strong></font>",
                    };
                }

                resolve(msg);
                //console.log("SINGLE SAVE : "+err);
            });
        });
        rep = await promise;
        return rep;
    },

    //Save Test Result
    editTestResult: async function (req) {
        let msg = { msg: "NO ACTION" };
        if (req.body.test) {
            //BULK INSERT
            let test_request_id = req.body.testRequestId;
            let tests_id = req.body.test;
            let testResults = req.body.resultat;
            let SavedIDs = req.body.SavedID;
            let ExamParent = req.body.ExamID;
            let pos = 0;
            for (item of testResults) {
                let resultat = testResults[pos];
                let examen_id = tests_id[pos];
                let savedId = SavedIDs[pos];
                await self.editSingleTestResult(test_request_id, examen_id, resultat, savedId, ExamParent);
                pos++;
            }
            msg = {
                type: "success",
                success: true,
                msg:
                    "<font color='green'><strong>Résultat(s) modifié(s) avec succès...</strong></font>",
            };

        } else {
            msg = {
                type: "danger",
                msg:
                    "<font color='red'><strong>Vous devez choisir des paramètres.</strong></font>",
            };
        }
        return msg;
    },

    //UPDATE SINGLE TEST RESULTS
    editSingleTestResult: async function (test_request_id, examen_id, resultat, saveId, ExamParent) {
        let promise = new Promise((resolve, reject) => {
            let sql =
                'UPDATE tb_resultats SET resultat=? WHERE id_save=? ';
            //console.log(sql);
            con.query(sql, [resultat, saveId], async function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "<font color='red'><strong>Vous avez déja attribué ces paramètres.</strong></font>",
                        debug: err
                    };
                } else {
                    let nb_success = result.affectedRows;
                    if (nb_success == 0) { //Enregistrer le nouveau test
                        console.log("SAve the test...");
                        let save_id = test_request_id + "" + ExamParent + "" + examen_id;
                        await self.saveSingleTestResult(test_request_id, examen_id, resultat, save_id, ExamParent);
                    }
                    msg = {
                        type: "success",
                        success: true,
                        msg:
                            "<font color='green'><strong>Résultat enregistré avec succès...</strong></font>",
                        nb_success: result.affectedRows,
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    //TEST REQUEST CONTENTS
    getTestResult: async function (test_request_id, examen_id, ExamParent) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_resultats,tb_examens WHERE tb_resultats.examen_id=tb_examens.id AND test_request_id =? AND tb_resultats.examen_id = ? AND exam_parent=? ";
            //console.log(sql+" EXAMEN ID : "+examen_id+" REQUEST ID "+test_request_id);
            con.query(sql, [test_request_id, examen_id, ExamParent], function (err, rows) {
                if (err) {
                    throw err;
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
    //UPDATE TEST STATUS
    updateTestResultStatus: async function (test_request_id, statut) {
        let promise = new Promise((resolve, reject) => {
            let sql =
                'UPDATE tb_test_requests SET statut=?,date_resultat=NOW() WHERE id =?';
            //console.log(sql);
            con.query(sql, [statut, test_request_id], function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        msg:
                            "<font color='red'><strong>Une erreur est survenue...</strong></font>",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        success: true,
                        msg:
                            "<font color='green'><strong>Mise à jour...</strong></font>",
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

    //TEST SIGNATURE
    getTestSignature: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT realiser_par,poste FROM tb_test_requests WHERE id=? ";
            //console.log(sql+" ID : "+id);
            con.query(sql, id, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve([{ realiser_par: "" }]);
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //DELETE TEST REQUEST 
    async deleteTestRequest(item, test_request_id, user) {
        let promise = new Promise((resolve, reject) => {
            //   /* Begin transaction */
            con.beginTransaction(function (err) {
                if (err) { throw err; }
                let numero_lot = item.lot;
                let materiauId = item.materiau;
                let materiauName = item.nom_materiau;
                let transactionType = "add";
                let qte = item.qte;
                let commentaire = qte + " " + materiauName + " ajouté(s) au lot " + numero_lot + " | Suppression Test numéro " + test_request_id;
                console.log(commentaire);
                //Insert info into tb_evolution_stock table
                let sql = 'INSERT INTO tb_evolution_stock (lot,materiau,qte,transaction,commentaire,acteur,test) VALUES (?,?,?,?,?,?,?)';

                con.query(sql, [numero_lot, materiauId, qte, transactionType, commentaire, user, test_request_id], function (err, result) {
                    if (err) {
                        console.log(err);
                        con.rollback(function () {
                            throw err;
                        });
                    }
                    sql2 = "UPDATE  tb_stocks SET qte_restante = qte_restante + " + qte + ",qte_utilisee = qte_utilisee - " + qte + " WHERE numero_lot= ? AND materiau =?";
                    let param = [numero_lot, materiauId];
                    con.query(sql2, param, function (err, result) {
                        if (err) {
                            console.log(err);
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
                                        error: true,
                                        msg: "<font color='red'>Une erreur est survenue</font>",
                                        debug: err
                                    }
                                    resolve(msg);
                                    throw err;

                                });
                            }
                            msg = {
                                type: "success",
                                success: true,
                                msg: "<font color='green'>" + commentaire + " avec succès...</font>"
                            }
                            resolve(msg);
                        });

                    });
                });



            });
            /* End transaction */
        });
        data = await promise;
        //console.log(data); 
        return data;
    },
}