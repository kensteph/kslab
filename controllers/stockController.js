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

        //SET STOCK STATUS
        editMateriau: async function (info) {
            let promise = new Promise((resolve, reject) => {
                let min_stock = info.min_stock;
                let materiauName = info.materiauName;
                let perissable =  info.perissable;
                let materiauId = info.materiauId;
                let sql = "UPDATE tb_materiaux SET nom_materiau ='" + materiauName + "',min_stock =" + min_stock + ",expirable =" + perissable + " WHERE id =?";
                con.query(sql,materiauId, function (err, rows) {
                    if (err) {
                        resolve({
                            msg: "Une erreur est survenue. S'il vous plait réessayez.",
                            type: "danger",
                            debug: err
                        });
                    } else {
                        resolve({
                            msg: "Les informations concernant " + materiauName + " ont été modifiées avec succès.",
                            type: "success"
                        });
                    }
                });
            });
            data = await promise;
            //console.log(data);
            return data;
        },

    //Materiaux LIST
    listOfMateriaux: async function (materiauId) {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            if (materiauId == "All") {
                sql = "SELECT * FROM tb_materiaux ";
            } else {
                sql = "SELECT * FROM tb_materiaux WHERE id=" + materiauId;
            }
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
            let dateRecue = helpers.formatDate(req.body.dateRecue, "EN");
            let dateExpiration = helpers.formatDate(req.body.dateExpiration, "EN");;
            let qteRecue = parseInt(req.body.qteRecue);
            let qteEndomage = req.body.qteEndomage;
            let qteRestante = qteRecue - qteEndomage;
            if (qteEndomage == "") { qteEndomage = 0; } else { qteEndomage = parseInt(qteEndomage); }
            let msg="";
            //   /* Begin transaction */
            con.beginTransaction((err) => {
                if (err) { throw err; }
                let sql =
                    'INSERT INTO tb_stocks (numero_lot,materiau,date_recue,date_expiration,qte_recue,qte_endomage,qte_restante,acteur) VALUES ("' + numero_lot + '","' + materiauId + '","' + dateRecue + '","' + dateExpiration + '",' + qteRecue + ',' + qteEndomage + ',' + qteRestante + ',"' + USER_NAME + '")';
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
                        let commentaire =qteRecue+" "+materiauName+" ont été ajoutés au stock. QTE endomagée : "+qteEndomage;
                        let transactionType ="Add";
                        //Insert info into tb_evolution_stock table
                        let sql = 'INSERT INTO tb_evolution_stock (lot,materiau,qte,transaction,commentaire,acteur) VALUES ("' + numero_lot + '","' + materiauId + '","' + qteRecue + '","' + transactionType + '","' + commentaire + '","' + USER_NAME + '")';

                        con.query(sql, function (err, result) {
                            if (err) {
                                console.log(err);
                                con.rollback(function () {
                                    throw err;
                                    msg = {
                                        type: "danger",
                                        error: true,
                                        msg:
                                            "<font color='red'> Vous avez déja ajouté ce lot " + numero_lot + "</font> ",
                                        debug: err
                                    };
                                });
                            }else{
                                con.commit(function (err) {
                                    if (err) {
                                        console.log(err);
                                        con.rollback(function () {
                                            throw err;
                                        });
                                    }
                                    msg = {
                                        success: "success",
                                        msg:
                                            "<font color='green'> Stock <strong>" + materiauName + "</strong> enregistré avec succès.</font>",
                                    };
                                    resolve(msg);
                                    //console.log(msg);
                                });
                                
                            }

                        });
                        
                    }

                    
                });
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
        let qte = req.body.qte;
        let commentaire = req.body.commentaire;
        let promise = new Promise((resolve, reject) => {
            //   /* Begin transaction */
            con.beginTransaction(function (err) {
                if (err) { throw err; }
                //Insert info into tb_evolution_stock table
                let sql = 'INSERT INTO tb_evolution_stock (lot,materiau,qte,transaction,commentaire,acteur) VALUES ("' + numero_lot + '","' + materiauId + '","' + qte + '","' + transactionType + '","' + commentaire + '","' + USER_NAME + '")';

                con.query(sql, function (err, result) {
                    if (err) {
                        console.log(err);
                        con.rollback(function () {
                            throw err;
                        });
                    }

                    //Update the table tb_stocks
                    let sql2 = "";
                    let action = " enlevé(s) du lot " + numero_lot;
                    if (transactionType == "endommagee") {
                        // qte endomage
                        sql2 = "UPDATE  tb_stocks SET qte_restante = qte_restante - " + qte + ",qte_endomage = qte_endomage + " + qte + "  WHERE numero_lot= ? AND materiau =?";
                    } else {

                        if (transactionType == "substract") {
                            sql2 = "UPDATE  tb_stocks SET qte_restante = qte_restante - " + qte + ",qte_utilisee = qte_utilisee + " + qte + "  WHERE numero_lot= ? AND materiau =?";
                        } else {
                            sql2 = "UPDATE  tb_stocks SET qte_restante = qte_restante + " + qte + " WHERE numero_lot= ? AND materiau =?";
                            action = " ajouté(s) au lot " + numero_lot;
                        }
                    }

                    let param = [numero_lot, materiauId];
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
                                        debug: err
                                    }
                                    resolve(msg);
                                    throw err;

                                });
                            }
                            msg = {
                                type: "success",
                                success: true,
                                msg: "<font color='green'>" + qte + " " + materiauName + " " + action + " avec succès...</font>"
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
    //Add or REMOVE ITEMS STOCK Materiau
    async RemoveItemFromStock(con, numero_lot, materiauId, materiauName, transactionType, qte, commentaire) {
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
                    let action = " enlevé(s) du lot " + numero_lot;
                    if (transactionType == "endommagee") {
                        // qte endomage
                        sql2 = "UPDATE  tb_stocks SET qte_restante = qte_restante - " + qte + ",qte_endomage = qte_endomage + " + qte + "  WHERE numero_lot= ? AND materiau =?";
                    } else {

                        if (transactionType == "substract") {
                            sql2 = "UPDATE  tb_stocks SET qte_restante = qte_restante - " + qte + ",qte_utilisee = qte_utilisee + " + qte + "  WHERE numero_lot= ? AND materiau =?";
                        } else {
                            sql2 = "UPDATE  tb_stocks SET qte_restante = qte_restante + " + qte + " WHERE numero_lot= ? AND materiau =?";
                            action = " ajouté(s) au lot " + numero_lot;
                        }
                    }

                    let param = [numero_lot, materiauId];
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
                                        debug: err
                                    }
                                    resolve(msg);
                                    throw err;

                                });
                            }
                            msg = {
                                type: "success",
                                success: true,
                                msg: "<font color='green'>" + qte + " " + materiauName + " " + action + " avec succès...</font>"
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
    //Load All stock
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
        //console.log(data);
        return data;
    },
    //Liste des stocks expires
    listOfAllExpiredStock: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND DATEDIFF( date_expiration , Now() )<=0";
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        return data;
    },
    //Liste des stocks valide
    listOfAllValidStock: async function (nbJour) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND DATEDIFF( date_expiration , Now() )>" + nbJour;
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        return data;
    },
    //Liste des stocks Critique
    listOfAllAlertStock: async function (nbJour) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND DATEDIFF( date_expiration , Now() )>0 AND DATEDIFF( date_expiration , Now() )<=" + nbJour+" OR min_stock >=qte_restante AND statut=1";
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        return data;
    },

    //Load All stock
    listOfAllStockByProduct: async function (id_product, stock_status) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND tb_stocks.materiau=? AND statut=? ORDER BY date_expiration ASC";
            con.query(sql, [id_product, stock_status], function (err, rows) {
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
    //Mouvement de stock IN and OUT
    stockMoving: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *FROM tb_evolution_stock,tb_materiaux WHERE tb_evolution_stock.materiau=tb_materiaux.id";
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
    //LINK TEST TO MATERIAU
    linkTestToMateriau: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let testId = req.body.testId;

            if (req.body.materiaux) {
                //BULK INSERTION
                let materiaux = req.body.materiaux;
                let qtes = req.body.qtes;
                var values = [];
                for (var i = 0; i < materiaux.length; i++) {
                    let materiau = materiaux[i]; //materiau
                    let qte = qtes[i];
                    line = [];
                    line[0] = testId;
                    line[1] = materiau;
                    line[2] = qte;
                    values.push(line);
                }

                let sql =
                    'INSERT INTO tb_link_materiau_test (test_id,materiau,qte) VALUES ?';
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
    //TEST'S MATERIAUX
    getTestMateriaux: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_link_materiau_test,tb_materiaux WHERE tb_link_materiau_test.materiau=tb_materiaux.id AND test_id = ? ";
            //console.log(sql+" ID : "+id);
            con.query(sql, id, function (err, rows) {
                if (err) {
                    // throw err;
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
    //DISPONIBILITE MATERIAU /QTE DISPONIBLE
    countAvailableMateriaux: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT SUM(qte_restante) as qte FROM `tb_stocks` WHERE materiau = ? AND statut=1 ";
            //console.log(sql+" ID : "+id);
            con.query(sql, id, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve([{ fullname: "" }]);
                } else {
                    resolve(rows[0].qte);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //SET STOCK STATUS
    setStockStatus: async function (numero_lot, statut) {
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_stocks SET statut =" + statut + " WHERE numero_lot =?";
            con.query(sql, numero_lot, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous plait réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Les informations concernant " + numero_lot + " ont été modifiées avec succès.",
                        type: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

}