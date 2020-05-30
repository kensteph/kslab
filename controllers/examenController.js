const con = require('./database');
const helpers = require('../helpers/helpers');
var self = module.exports = {
    //Save Exam
    saveExam: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let nom_examen = req.body.nomExamen;
            let type_examen = req.body.typeResultat;
            let ifbilan = req.body.ifbilan;
            let sql =
                'INSERT INTO tb_examens (nom_examen,type_resultat,is_bilan) VALUES ("' + nom_examen + '","' + type_examen + '","' + ifbilan + '")';
            con.query(sql, function (err, result) {
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
                
                let sql =
                    'UPDATE tb_examens SET nom_examen="' + examen + '", type_resultat =' + type_resultat + ', is_bilan=' + is_bilan +' WHERE id=?';
               // console.log(sql);
                con.query(sql,examenID, function (err, result) {
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
                                "<font color='green'><strong> "+examen+" modifié avec succès...</strong></font>",
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
            let sql = "SELECT * FROM tb_examens ";
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
    //
    listOfExamsParameters: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_examens WHERE is_bilan=0 ";
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
            let sql ="";
            if(action == "P"){
                sql = "DELETE FROM tb_parametres_examens  WHERE id_examen =" + examID + " AND id_param_exam=" + itemID;
            }else if(action == "VN"){
                sql = "DELETE FROM tb_valeurs_normales  WHERE exam_id =" + examID ;
            }else{
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
                        msg:  itemName + " supprimé avec succès.",
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
            let sql = "SELECT * FROM tb_parametres_examens,tb_examens WHERE tb_parametres_examens.id_param_exam=tb_examens.id AND id_examen = ? ";
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

    //============================= SAVE TEST RESULT ==================================================
    //Save Test Result
    saveTestResult: async function (req) {
        let promise = new Promise((resolve, reject) => {
            if (req.body.test) {
                //BULK INSERT
                let test_request_id = req.body.testRequestId;
                let tests_id = req.body.test;
                let testResults = req.body.resultat;
                let values = [];
                let pos = 0;
                for (item of testResults) {
                    let resultat = testResults[pos];
                    let examen_id = tests_id[pos];
                    let line = [];
                    line[0] = test_request_id;
                    line[1] = examen_id;
                    line[2] = resultat;
                    values.push(line);
                    pos++;
                }
                let sql =
                    'INSERT INTO tb_resultats (test_request_id	,examen_id,resultat) VALUES ?';
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
                        let rep = await self.updateTestResultStatus(test_request_id, 1);
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

      //Save Test Result
      editTestResult: async function (req) {
          let msg = {msg : "NO ACTION"};
            if (req.body.test) {
                //BULK INSERT
                let test_request_id = req.body.testRequestId;
                let tests_id = req.body.test;
                let testResults = req.body.resultat;
                let pos = 0;
                for (item of testResults) {
                    let resultat = testResults[pos];
                    let examen_id = tests_id[pos];
                    await self.editSingleTestResult(test_request_id,examen_id,resultat);
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
    editSingleTestResult: async function (test_request_id, examen_id, resultat) {
        let promise = new Promise((resolve, reject) => {
            let sql =
                'UPDATE tb_resultats SET resultat="' + resultat + '" WHERE test_request_id =' + test_request_id + ' AND  examen_id=' + examen_id + ' ';
         console.log(sql);
            con.query(sql, function (err, result) {
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
    getTestResult: async function (test_request_id, examen_id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_resultats,tb_examens WHERE tb_resultats.examen_id=tb_examens.id AND test_request_id =? AND tb_resultats.examen_id = ?  ";
            //console.log(sql+" ID : "+id);
            con.query(sql, [test_request_id, examen_id], function (err, rows) {
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
                'UPDATE tb_test_requests SET statut=' + statut + ',date_resultat=NOW() WHERE id =' + test_request_id;
            //console.log(sql);
            con.query(sql, function (err, result) {
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
                    resolve([{ realiser_par : "" }]);
                } else {
                    resolve(rows[0]);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

}