const con = require('./database');
const helpers = require('../helpers/helpers');
const examController = require('./examenController');
const stockDB = require('./stockController.js');
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
                let sql =
                    'INSERT INTO tb_valeurs_normales (exam_id,bebe,enfant,adolescent,femme,homme,unite) VALUES ('+examId+',"' + bebe + '","' + enfant + '","' + ado + '","' + femme + '","' + homme + '","' + unite + '")';
                con.query(sql, function (err, result) {
                    if (err) {
                        msg = {
                            error: " Vous avez déja enregistré ces valeurs ",
                            debug: err
                        };
                    } else {
                        msg = {
                            success: 
                                "Valeurs enregistrées avec succès.",
                        };
                    }
    
                    resolve(msg);
                    console.log(msg);
                });
            });
            rep = await promise;
            return rep;
        },
        //Valeur Normale d'un test
        valeurNormalExam: async function (field_p,exam_id) {
            let promise = new Promise((resolve, reject) => {
                let sql = "";
                sql = "SELECT CONCAT("+field_p+",' ',unite ) as vn FROM tb_valeurs_normales WHERE exam_id="+exam_id;
                console.log(sql);
                con.query(sql, function (err, rows) {
                    if (err) {
                        throw err;
                    } else {
                        resolve(rows[0]);
                    }
                });
            });
            data = await promise;
            console.log(data); 
            return data;
        },
    //Save Test in the DB
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
                                let info = await stockDB.getTestMateriaux(test_id);
                                //console.log(info);
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
                                    //ON VA PRELEVER LES MATERIAUX DANS LE STOCK LE PLUS ANCIEN
                                    let new_qte_to_take = qte_to_use;
                                    for (item of stockByMateriau) {
                                        let numero_lot = item.numero_lot;
                                        let materiauId = item.materiau;
                                        let materiauName = item.nom_materiau;
                                        let transactionType = "substract";
                                        let qte = new_qte_to_take;
                                        let commentaire = "";
                                        let qte_dispo_in_stock = item.qte_restante; //Current LOT
                                        let diff = qte_dispo_in_stock - qte;
                                        if (qte_dispo_in_stock > qte) {
                                            commentaire = qte + " " + materiauName + " a été prélevé du stock pour le test # " + id_test_request;
                                            let rep = await stockDB.RemoveItemFromStock(con, numero_lot, materiauId, materiauName, transactionType, qte, commentaire);
                                            break; //On sort de la boucle parce qu'on a deja preleve
                                        } else {
                                            if (diff >=0) {
                                                commentaire = qte + " " + materiauName + " a été prélevé du stock pour le test # " + id_test_request;
                                                let rep = await stockDB.RemoveItemFromStock(con, numero_lot, materiauId, materiauName, transactionType, qte, commentaire);
                                                new_qte_to_take = new_qte_to_take - qte;
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
            let sql ="";
            if(dateFrom == "All"){
                if (status == "All") { status = ""; } else { status = " AND tb_test_requests.statut =" + status; }
            sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,DATEDIFF( NOW(), date_nais )/365 as age,tb_test_requests.id as id_request,tb_test_requests.statut as test_status FROM tb_test_requests,tb_patients,tb_personnes WHERE tb_test_requests.patient=tb_patients.id_personne AND tb_patients.id_personne=tb_personnes.id "+ status;
            }else{
                if (status == "All") { status = ""; } else { status = " AND tb_test_requests.statut =" + status; }
                sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,DATEDIFF( NOW(), date_nais )/365 as age,tb_test_requests.id as id_request,tb_test_requests.statut as test_status FROM tb_test_requests,tb_patients,tb_personnes WHERE tb_test_requests.patient=tb_patients.id_personne AND tb_patients.id_personne=tb_personnes.id AND DATE(date_record) BETWEEN '" + dateFrom + "' AND '" + dateTo + "'  " + status;
            
            }
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
                        let line_info = { request_id: item.id_request, date_record: item.date_record, numero_patient: item.numero_patient, patient: item.fullname,age : item.age,sexe: item.sexe, examens: patient_exams, statut: item.test_status };
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
    singlePatientTestRequestlist: async function (patient, test_request_id) {
        let promise = new Promise((resolve, reject) => {
            let line = [];
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,tb_test_requests.id as id_request,tb_test_requests.statut as test_status FROM tb_test_requests,tb_patients,tb_personnes WHERE tb_test_requests.patient=tb_patients.id_personne AND tb_patients.id_personne=tb_personnes.id AND";
            //console.log(sql);
            con.query(sql, async function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    for (item of rows) {
                        let info = await examController.testRequestContent(item.id_request);
                        let examens = [];
                        for (var i = 0; i < info.length; i++) {
                            let test = { id: info[i].id, nom_examen: info[i].nom_examen };
                            examens.push(test);
                        }
                        let line_info = { date_record: item.date_record, numero_patient: item.numero_patient, patient: item.fullname, examens: examens, statut: item.test_status };
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