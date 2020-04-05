const con = require('./database');
const helpers = require('../helpers/helpers');
module.exports = {
    //Add Materiau
    addMateriau: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let nom_materiau = req.body.nomMateriau;
            let sql =
                'INSERT INTO tb_materiaux (nom_materiau) VALUES ("' + nom_materiau + '")';
            con.query(sql, function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté " + nom_materiau + " ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg:
                            nom_materiau + " enregistré avec succès.",
                    };
                }

                resolve(msg);
                console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },

    //Materiaux LIST
    listOfMateriaux: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_materiaux ";
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
     //Add STOCK Materiau
     addStock: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let numero_lot = req.body.lot;
            let materiauId = req.body.materiauId;
            let materiauName = req.body.materiauName;
            let dateRecue = helpers.formatDate(req.body.dateRecue,"EN");
            let dateExpiration = helpers.formatDate(req.body.date_expiration,"EN");;
            let qteRecue =  parseInt(req.body.qteRecue);
            let qteEndomage = req.body.qteEndomage;
            let qteRestante = qteRecue - qteEndomage;
            if(qteEndomage == ""){ qteEndomage = 0;}else{ qteEndomage = parseInt(qteEndomage); }
            let sql =
                'INSERT INTO tb_stocks (numero_lot,materiau,date_recue,date_expiration,qte_recue,qte_endomage,qte_restante) VALUES ("' + numero_lot + '","' + materiauId + '","' + dateRecue + '","' + dateExpiration + '",' + qteRecue + ',' + qteEndomage + ',' + qteRestante + ')';
            con.query(sql, function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            "<font color='red'> Vous avez déja ajouté ce lot " + numero_lot + "</font> ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg:
                        "<font color='green'> Stock <strong>"+materiauName + "</strong> enregistré avec succès.</font>",
                    };
                }

                resolve(msg);
                console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
      //Add or REMOVE ITEMS STOCK Materiau
        async addRemoveItemStock(req, res) {
            //DATA RECEIVING
            let numero_lot = req.body.lot;
            let materiauId = req.body.materiauId;
            let materiauName = req.body.materiauName;
            let transactionType = req.body.type;
            let qte = req.body.qte ;
            let commentaire =  req.body.commentaire;
            let promise = new Promise((resolve, reject) => {
                //   /* Begin transaction */
                con.beginTransaction(function (err) {
                    if (err) { throw err; }
                    //Insert info into tb_evolution_stock table
                    let sql = 'INSERT INTO tb_evolution_stock (lot,materiau,qte,transaction,commentaire) VALUES ("' + numero_lot + '","' + materiauId + '","' + qte + '","' + transactionType + '","' + commentaire + '")';
    
                    con.query(sql, function (err, result) {
                        if (err) {
                            console.log(err);
                            con.rollback(function () {
                                throw err;
                            });
                        }
                        
                        //Update the table tb_stocks
                        let sql2 = ""; 
                        let action =" enlevé(s) du lot "+numero_lot;
                        if(transactionType == "endommagee"){
                           // qte endomage
                           sql2 = "UPDATE  tb_stocks SET qte_restante = qte_restante - "+qte+",qte_endomage = qte_endomage + "+qte+"  WHERE numero_lot= ? AND materiau =?";
                        }else{

                            if(transactionType == "substract"){
                                sql2 = "UPDATE  tb_stocks SET qte_restante = qte_restante - "+qte+",qte_utilisee = qte_utilisee + "+qte+"  WHERE numero_lot= ? AND materiau =?";
                            }else{
                                sql2 = "UPDATE  tb_stocks SET qte_restante = qte_restante + "+qte+" WHERE numero_lot= ? AND materiau =?";
                                action = " ajouté(s) au lot "+numero_lot;
                            }
                        }
                        
                        let param = [numero_lot,materiauId];
                        con.query(sql2, param, function (err, result) {
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
                                            error: true,
                                            msg: "<font color='red'>Une erreur est survenue</font>",
                                            debug : err
                                        }
                                        resolve(msg);
                                        throw err;

                                    });
                                }
                                msg = {
                                    type: "success",
                                    success: true,
                                    msg: "<font color='green'>" + qte +" "+materiauName+" "+action+ " avec succès...</font>"
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
    
    //STOCK BY ID
    getStockById: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_examens WHERE id = ? ";
            //console.log(sql+" ID : "+id_personne);
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
 //LIST OF STOCKS
  //Load All The Courses Categories
  listOfAllStock: async function () {
    let promise = new Promise((resolve, reject) => {
        let sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id";
        con.query(sql, function (err, rows) {
            if (err) {
                throw err;
            } else {
                resolve(rows);
            }
        });
    });
    data = await promise;
    console.log(data); 
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
    //UPDATE INFO PATIENT
    updatePatient: async function (req) {
        firstName = req.body.firstname;
        lastName = req.body.lastname;
        fullname = firstName + " " + lastName;
        gender = req.body.gender;
        dateOfBirth = req.body.datenais;// helpers.formatDate(req.body.datenais, "EN");
        adresse = req.body.adresse;
        phone = req.body.telephone;
        status = req.body.status;
        id_personne = req.body.patientID;
        let params = [firstName, lastName, gender, dateOfBirth, adresse, phone, status, id_personne];
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_personnes SET prenom = ?,nom =? ,sexe =? ,date_nais =? ,adresse =? ,telephone =?,statut =? WHERE id =?";
            console.log(sql + " ID : " + id_personne);
            con.query(sql, params, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Les informations concernant " + fullname + " ont été modifiées avec succès.",
                        type: "success"
                    });
                }
            });
        });
        data = await promise;
        console.log(data);
        return data;
    },

    //Delete PATIENT
    deletePatient: async function (id_personne) {
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_personnes SET visible =? WHERE id =?";
            console.log(sql + " ID : " + id_personne);
            con.query(sql, id_personne, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Les informations concernant " + fullname + " ont été modifiées avec succès.",
                        type: "success"
                    });
                }
            });
        });
        data = await promise;
        console.log(data);
        return data;
    },

}