const con = require('./database');
const helpers = require('../helpers/helpers');
var self = module.exports = {
    //Add Materiau
    addMateriau: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let nom_materiau = req.body.nomMateriau;
            let min_stock = req.body.min_stock;
            let expirable = req.body.perissable;
            let sql =
                'INSERT INTO tb_materiaux (nom_materiau,min_stock,expirable) VALUES ("' + nom_materiau + '",' + min_stock + ',' + expirable + ')';
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
                //console.log(msg);
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
            let perissable = info.perissable;
            let materiauId = info.materiauId;
            let sql = "UPDATE tb_materiaux SET nom_materiau ='" + materiauName + "',min_stock =" + min_stock + ",expirable =" + perissable + " WHERE id =?";
            con.query(sql, materiauId, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous plait réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        success: true,
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
    //Materiaux LIST
    listeMateriauxAssocieATest: async function (testId) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_materiaux,tb_link_materiau_test WHERE tb_link_materiau_test.materiau=tb_materiaux.id AND test_id=" + testId;
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
    //============================================== PENDING STOCK TRANSACTION ===========================

    //DELETE TEST REQUEST
    deleteStockPending: async function (con, materiauID) {
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_pending_stock_evolution WHERE materiau_id =?";
            con.query(sql, materiauID, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        error: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Stock pendant supprimé avec succès...",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //UPDATE TEST REQUEST
    updateStockPending: async function (con, materiauID, qte) {
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_pending_stock_evolution SET qte_a_enlever=qte_a_enlever-" + qte + " WHERE materiau_id =?";
            console.log(sql);
            con.query(sql, materiauID, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        error: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Stock pendant supprimé avec succès...",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //PENDING STOCK TRANSACTION FOR A MATERIAU
    getPendingStockForMateriau: async function (materiauID) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_materiaux,tb_pending_stock_evolution WHERE tb_pending_stock_evolution.materiau_id=tb_materiaux.id AND materiau_id=" + materiauID;
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

    //PENDING STOCK TRANSACTION FOR A TESTREQUEST AND A PATICULAR EXAM
    getPendingStockForExamInTestRequest: async function (testRequestID, examiD) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_materiaux,tb_pending_stock_evolution WHERE tb_pending_stock_evolution.materiau_id=tb_materiaux.id AND request_id=? AND  test_id=?  ";
            con.query(sql, [testRequestID, examiD], function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    resolve(rows);
                }
            });
        });
        data = await promise;
        console.log(testRequestID + "|" + examiD);
        return data;
    },
    //COUNT PENDING STOCK TRANSACTION FOR A MATERIAU
    getCountPendingStockForMateriau: async function (con, materiauID) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(qte_a_enlever) as nb FROM tb_pending_stock_evolution WHERE materiau_id=" + materiauID;
            con.query(sql, function (err, rows) {
                if (err) {
                    throw err;
                } else {

                    if (rows.length > 0) {
                        resolve(rows[0].nb);
                    } else {
                        resolve(0);
                    }

                }
            });
        });
        data = await promise;
        //console.log(data); 
        return data;
    },
    //Manage PENDING STOCK EVOLUTION
    managePendingStock: async function (con, matInfo, qte, pendingQtyForThisItem, action) {
        if (pendingQtyForThisItem == 0) {
            return qte;
        }
        //Enlever automatiquement la quantite pendante de la qteRestante
        if (pendingQtyForThisItem > qte) { // Mise a jour de la quantite pandante
            console.log("Mise a jour de la quantite pandante");
            //Parmis les stocks pendants on va choisir x pour supprimer
            let pst = await self.getPendingStockForMateriau(matInfo.id);
            //Determiner le nombre de stock a supprimer
            let qte_a_utiliser = pst[0].qte_a_enlever;
            let x = qte / qte_a_utiliser; x = Math.ceil(x);
            //Stock a supprimer
            let stocksDelete = pst.slice(0, x);
            //await self.updateStockPending(con, matInfo.id, qte);
            for (stck of stocksDelete) {
                //Remove stock
                await self.deletePendingStock(stck.test_id, stck.request_id);
            }
            if (action == "INSERT") {
                let commentaire = qte + " " + matInfo.name + " retiré(s) du lot " + matInfo.lot + " | Transaction pendante";
                await self.RemoveItemFromStock(con, matInfo.lot, matInfo.id, matInfo.name, "substract", qte, commentaire, "System", -1);
            }
            qte = 0;
        } else { // Suppression de la qte pandante
            if (action == "INSERT") {
                let commentaire = pendingQtyForThisItem + " " + matInfo.name + " retiré(s) du lot " + matInfo.lot + " | Transaction pendante";
                await self.RemoveItemFromStock(con, matInfo.lot, matInfo.id, matInfo.name, "substract", pendingQtyForThisItem, commentaire, "System", -1);
            }
            qte = qte - pendingQtyForThisItem;
            console.log("Suppression de la qte pandante");
            await self.deleteStockPending(con, matInfo.id);

        }
        return qte;
    },
    //Pending Stock evolution Transaction
    pendingStockEvolution: async function (con, materiau_id, qte_a_enlever, test_id, req_id) {
        let promise = new Promise((resolve, reject) => {
            let sql =
                'INSERT INTO tb_pending_stock_evolution (materiau_id,qte_a_enlever,test_id,request_id) VALUES (' + materiau_id + ',' + qte_a_enlever + ',' + test_id + ',' + req_id + ')';
            con.query(sql, function (err, result) {
                if (err) {
                    console.log(err);
                    // msg = {
                    //     error: " Vous avez déja enregistré ces valeurs ",
                    //     debug: err
                    // };
                    msg = self.updateStockPendingEvolution(materiau_id, qte_a_enlever, test_id, req_id);
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
    //UPDATE Stock evolution Transaction
    updateStockPendingEvolution: async function (materiauID, qte, test_id, request_id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_pending_stock_evolution SET qte_a_enlever=qte_a_enlever+" + qte + " WHERE materiau_id =? AND test_id=? AND request_id=?";
            con.query(sql, [materiauID, test_id, request_id], function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        error: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Stock pendant modifie avec succès...",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //DELETE PENDING STOCK
    deletePendingStock: async function (id_test, id_request) {
        let promise = new Promise((resolve, reject) => {
            let sql1 = "DELETE FROM tb_pending_stock_evolution WHERE test_id=? AND request_id =?";
            con.query(sql1, [id_test, id_request], function (err, rows) {
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
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //DELETE PENDING STOCK BY REQUEST_ID
    deletePendingStockByRequestId: async function (id_request) {
        let promise = new Promise((resolve, reject) => {
            let sql1 = "DELETE FROM tb_pending_stock_evolution WHERE  request_id =?";
            con.query(sql1, id_request, function (err, rows) {
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
        });
        data = await promise;
        //console.log(data);
        return data;
    },

    //UPDATE QTY USED
    updateStockQtyUsedById: async function (stockID, qte, action) {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            if (action == "add") {
                sql = "UPDATE tb_stocks SET qte_utilisee=qte_utilisee + " + qte + " WHERE id=?";
            } else {
                sql = "UPDATE tb_stocks SET qte_utilisee=qte_utilisee  - " + qte + " WHERE id=?";
            }

            con.query(sql, stockID, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        error: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Qte utilisée modifiée avec succès...",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //Add STOCK Materiau
    addStock: async function (req) {
        let promise = new Promise(async (resolve, reject) => {
            let numero_lot = req.body.lot;
            let materiauId = req.body.materiauId;
            let materiauName = req.body.materiauName;
            let dateRecue = helpers.formatDate(req.body.dateRecue, "EN");
            let dateExpiration = null;
            if (req.body.dateExpiration.length >= 8) {
                dateExpiration = helpers.formatDate(req.body.dateExpiration, "EN");
            }

            let qteRecue = parseInt(req.body.qteRecue);
            let qteEndomage = req.body.qteEndomage;
            let qteRestante = qteRecue - qteEndomage;
            let user = req.session.username;


            if (qteEndomage == "") { qteEndomage = 0; } else { qteEndomage = parseInt(qteEndomage); }
            let msg = { msg: "NO ACTION DONE..." };
            //   /* Begin transaction */
            con.beginTransaction(async (err) => {
                //VERIFY IF THERE IS PENDING REQUEST
                let pendingQtyForThisItem = await self.getCountPendingStockForMateriau(con, materiauId);
                let matInfo = { id: materiauId, name: materiauName, lot: numero_lot };
                if (err) { throw err; }
                let sql = "";
                if (dateExpiration != null) {
                    sql = 'INSERT INTO tb_stocks (numero_lot,materiau,date_recue,date_expiration,qte_recue,qte_endomage,qte_restante,acteur) VALUES ("' + numero_lot + '","' + materiauId + '","' + dateRecue + '","' + dateExpiration + '",' + qteRecue + ',' + qteEndomage + ',' + qteRestante + ',"' + user + '")';
                } else {
                    sql = 'INSERT INTO tb_stocks (numero_lot,materiau,date_recue,qte_recue,qte_endomage,qte_restante,acteur) VALUES ("' + numero_lot + '","' + materiauId + '","' + dateRecue + '",' + qteRecue + ',' + qteEndomage + ',' + qteRestante + ',"' + user + '")';
                }

                con.query(sql, function (err, result) {
                    console.log("TEST");
                    if (err) {
                        msg = {
                            type: "danger",
                            error: true,
                            msg:
                                "<font color='red'> Vous avez déja ajouté ce lot " + numero_lot + "</font> " + err,
                            debug: err
                        };
                        resolve(msg);
                    } else {
                        let commentaire = qteRecue + " " + materiauName + " ont été ajoutés au stock. QTE endomagée : " + qteEndomage;
                        let transactionType = "add";
                        //Insert info into tb_evolution_stock table
                        let sql = 'INSERT INTO tb_evolution_stock (lot,materiau,qte,transaction,commentaire,acteur) VALUES ("' + numero_lot + '","' + materiauId + '","' + qteRecue + '","' + transactionType + '","' + commentaire + '","' + user + '")';

                        con.query(sql, function (err, result) {
                            if (err) {
                                console.log(err);
                                con.rollback(function () {
                                    //throw err;
                                    msg = {
                                        type: "danger",
                                        error: true,
                                        msg:
                                            "<font color='red'> Vous avez déja ajouté ce lot " + numero_lot + "</font> ",
                                        debug: err
                                    };
                                    resolve(msg);
                                });
                            } else {
                                con.commit(async function (err) {
                                    if (err) {
                                        console.log(err);
                                        con.rollback(function () {
                                            //throw err;
                                            msg = {
                                                type: "danger",
                                                error: true,
                                                msg:
                                                    "<font color='red'> Vous avez déja ajouté ce lot " + numero_lot + "</font> ",
                                                debug: err
                                            };
                                        });
                                    }
                                    await self.managePendingStock(con, matInfo, qteRestante, pendingQtyForThisItem, "INSERT");
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
        console.log("RSPONSE : " + rep);
        return rep;
    },

    //Add or REMOVE ITEMS STOCK Materiau

    async RemoveItemFromStock(con, numero_lot, materiauId, materiauName, transactionType, qte, commentaire, user, request_id) {
        let promise = new Promise((resolve, reject) => {
            //   /* Begin transaction */
            con.beginTransaction(async function (err) {
                if (err) { throw err; }
                //Insert info into tb_evolution_stock table
                let sql = 'INSERT INTO tb_evolution_stock (lot,materiau,qte,transaction,commentaire,acteur,test) VALUES ("' + numero_lot + '","' + materiauId + '","' + qte + '","' + transactionType + '","' + commentaire + '","' + user + '",' + request_id + ')';

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
                        con.commit(async function (err) {
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
                            // if (transactionType == "add") {
                            //     //VERIFY IF THERE IS PENDING REQUEST
                            //     let pendingQtyForThisItem = await self.getCountPendingStockForMateriau(con, materiauId);
                            //     let matInfo = { id: materiauId, name: materiauName, lot: numero_lot };
                            //     await self.managePendingStock(con, matInfo, qte, pendingQtyForThisItem, "UPDATE");
                            // }

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
    //REQUEST ADD OR REMOVE STOCK
    requestAddOrRemoveStock: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let numero_lot = req.body.lot;
            let materiauId = req.body.materiauId;
            let materiauName = req.body.materiauName;
            let transactionType = req.body.type;
            let qte = req.body.qte;
            let commentaire = req.body.commentaire;
            let user = req.session.username;
            let sql = 'INSERT INTO tb_evolution_stock (lot,materiau,qte,transaction,commentaire,acteur,approved) VALUES ("' + numero_lot + '","' + materiauId + '","' + qte + '","' + transactionType + '","' + commentaire + '","' + user + '",0)';
            con.query(sql, function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté " + materiauName + " ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg: "<font color='green'>Demande en attente d'approbation...</font>",
                    };
                }

                resolve(msg);
                //console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },

    //Add or REMOVE ITEMS STOCK Materiau
    async approvedRemoveItemStock(requestId, numero_lot, materiauId, materiauName, transactionType, qte, user, statut) {
        let promise = new Promise((resolve, reject) => {
            //   /* Begin transaction */
            con.beginTransaction(function (err) {

                if (err) { throw err; }
                //Insert info into tb_evolution_stock table
                let sql = "UPDATE tb_evolution_stock SET approved =" + statut + ",approved_by='" + user + "' WHERE id =?";
                con.query(sql, requestId, function (err, result) {
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
    getMateriau: async function (id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_materiaux WHERE id = ? ";
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
    listOfAllStock: async function (materiauId) {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            if (materiauId == "All") {
                sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days,tb_stocks.id as stock_id FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id";
            } else {
                sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days,tb_stocks.id as stock_id FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND tb_materiaux.id=" + materiauId;
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
    //Liste des stocks expires
    listOfAllExpiredStock: async function (materiauID) {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            if (materiauID == "All") {
                sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days,tb_stocks.id as stock_id FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND DATEDIFF( date_expiration , Now() )<=0";
            } else {
                sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days,tb_stocks.id as stock_id FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND DATEDIFF( date_expiration , Now() )<=0 AND tb_materiaux.id=" + materiauID;
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
        return data;
    },
    //Liste des stocks valide
    listOfAllValidStock: async function (materiauId) {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            if (materiauId == "All") {
                sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days,tb_stocks.id as stock_id FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND statut=1 ";
            } else {
                sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days,tb_stocks.id as stock_id FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND statut=1 AND tb_materiaux.id=" + materiauId;
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
        return data;
    },
    //SELECT *,DATEDIFF( date_expiration , Now() ) as days FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND DATEDIFF( date_expiration , Now() )BETWEEN 0 AND 90 AND statut=1
    //
    //Liste des stocks Critique
    listOfAllAlertStock: async function (materiauSelected, nbJour) {
        let stockAlert = await self.stockToNotify(nbJour);
        if (stockAlert.length != 0) {
            let promise = new Promise((resolve, reject) => {
                let sql = "";
                if (materiauSelected == "All") {
                    sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days,tb_stocks.id as stock_id FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND tb_stocks.id IN (" + stockAlert.join(",") + ")";
                } else {
                    sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days,tb_stocks.id as stock_id FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND tb_stocks.id IN (" + stockAlert.join(",") + ") AND tb_materiaux.id=" + materiauSelected;
                }

                console.log(sql);
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
        } else {
            return data = [];
        }
    },
    //Liste des stocks Critique selon la date expriration
    StockToBeExpired: async function (nbJour) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT tb_stocks.id as numero_lot FROM tb_stocks WHERE  DATEDIFF( date_expiration , Now()) BETWEEN 0 AND " + nbJour + " AND statut=1";
            //console.log(sql);
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
    //Liste des stocks Critique selon le seuil d'alert (stock minimum)
    StockMinimumReach: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT tb_stocks.id as numero_lot FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND  qte_restante<=min_stock AND statut=1";
            //console.log(sql);
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
    //Liste des stocks en jaune
    stockToNotify: async function (nbj) {
        let toBeExpired = await self.StockToBeExpired(nbj);
        let minStock = await self.StockMinimumReach();
        let stockList = [];
        //console.log("TO BE EXPIRED : "+toBeExpired.length);
        toBeExpired.forEach(element => {
            //console.log(element.numero_lot);
            stockList.push("'" + element.numero_lot + "'");
        });
        //console.log("STOCK MINIMUM : "+minStock);
        minStock.forEach(element => {
            //console.log(element.numero_lot);
            if (!stockList.includes("'" + element.numero_lot + "'")) {
                stockList.push("'" + element.numero_lot + "'");
            }

        });
        //console.log("STOCK ALERT : "+stockList.length);

        return stockList;
    },
    //Load All stock
    listOfAllStockByProduct: async function (id_product, stock_status) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,DATEDIFF( date_expiration , Now() ) as days,tb_stocks.id as id_stock FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND tb_stocks.materiau=? AND statut=? ORDER BY date_expiration ASC";
            con.query(sql, [id_product, stock_status], function (err, rows) {
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
    //Mouvement de stock IN and OUT
    stockMoving: async function (dateFrom, dateTo, materiauSelected) {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            if (materiauSelected == "All") {
                sql = "SELECT *FROM tb_evolution_stock,tb_materiaux WHERE tb_evolution_stock.materiau=tb_materiaux.id AND DATE(date_record) BETWEEN '" + dateFrom + "' AND '" + dateTo + "' AND approved=1 ORDER BY date_record ";
            } else {
                sql = "SELECT *FROM tb_evolution_stock,tb_materiaux WHERE tb_evolution_stock.materiau=tb_materiaux.id AND DATE(date_record) BETWEEN '" + dateFrom + "' AND '" + dateTo + "' AND materiau=" + materiauSelected + " AND approved=1 ORDER BY date_record";
            }
            //console.log(sql);
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
    //Requests to remove item from stock
    stockRequestByUsers: async function (dateFrom, dateTo, statut) {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            if (dateFrom == "All") {
                sql = "SELECT *,tb_evolution_stock.id as request_id FROM tb_evolution_stock,tb_materiaux WHERE tb_evolution_stock.materiau=tb_materiaux.id AND approved=0 ORDER BY date_record ";
            } else {

                if (statut == "All") {
                    sql = "SELECT *,tb_evolution_stock.id as request_id FROM tb_evolution_stock,tb_materiaux WHERE tb_evolution_stock.materiau=tb_materiaux.id AND DATE(date_record) BETWEEN '" + dateFrom + "' AND '" + dateTo + "' ORDER BY date_record ";
                } else {
                    sql = "SELECT *,tb_evolution_stock.id as request_id FROM tb_evolution_stock,tb_materiaux WHERE tb_evolution_stock.materiau=tb_materiaux.id AND DATE(date_record) BETWEEN '" + dateFrom + "' AND '" + dateTo + "' AND approved=" + statut + " ORDER BY date_record";
                }
            }
            //console.log(sql);
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
            let testId = req.body.examID;

            if (req.body.materiau) {
                //BULK INSERTION
                let materiaux = req.body.materiau;
                let qtes = req.body.qte;
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
                        "<font color='red'><strong>Vous devez choisir des matériaux et précisez leurs valeurs.</strong></font>",
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
    setStockStatus: async function (req) {
        let  stock_id = req.body.stock_id;
        let  stock_name= req.body.stockName;
        let  lot = req.body.lot;
        let  statut = req.body.statut;
        let etat= ["invalide","valide"];
        
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_stocks SET statut =" + statut + " WHERE id =?";
            con.query(sql, stock_id, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous plait réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Le stock "+stock_name+" est maintenant "+etat[statut],
                        type: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

    //DELETE STOCK REQUEST
    deleteRequestUserForStock: async function (request_id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_evolution_stock WHERE id =?";
            con.query(sql, request_id, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous plait réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "La requete a été supprimée avec succès...",
                        type: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //DELETE STOCK REQUEST
    deleteStock: async function (req) {
        let stockID = req.body.stockID;
        let stockName = req.body.stockName;
        let stockName_split = stockName.split("|");
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_stocks WHERE id =?";
            con.query(sql, stockID, async function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous plait réessayez.",
                        error: "danger",
                        debug: err
                    });
                } else {
                    //LOG THE TRANSACTIONS
                    let materiauName = stockName_split[0];
                    let numero_lot = stockName_split[1];
                    let materiauId = stockName_split[2];
                    let qte = stockName_split[3];
                    let stock = materiauName + " | " + numero_lot;
                    let transactionType = "delete";
                    let commentaire = "Suppression du stock " + stock;
                    let user = req.session.username;
                    notifications = await self.RemoveItemFromStock(con, numero_lot, materiauId, materiauName, transactionType, qte, commentaire, user, id_test_request = -1);
                    resolve({
                        msg: "Le stock " + stock + " a été supprimé avec succès...",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //LISTE DES MATERIAUX UTILISES POUR LA DEMANDE
    listeMateriauxForTestRequest: async function (request_id) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *FROM tb_evolution_stock,tb_materiaux WHERE tb_evolution_stock.materiau=tb_materiaux.id AND transaction='substract' AND test=" + request_id;
            //console.log(sql);
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
    //======================== RAPPORT D'UTILISATION DES MATERIAUX =================================================
    //SELECT COUNT(qte) FROM `tb_evolution_stock` WHERE test IS NOT NULL AND transaction="add"
    //SELECT COUNT(qte) FROM `tb_evolution_stock` WHERE test IS NOT NULL AND transaction="substract"
    singleMateriauReport: async function (dateFrom, dateTo, materiau_id) {
        let qte_utilisee = 0;
        let qte_ajoute = await self.nombreMateriauReport(dateFrom, dateTo, materiau_id, "add");
        let qte_retire = await self.nombreMateriauReport(dateFrom, dateTo, materiau_id, "substract");
        qte_utilisee = qte_retire - qte_ajoute;
        return qte_utilisee;
    },
    //NOMBRE DE MATERIAUX AJOUTE OU ENLEVE DU STOCK BY ID
    nombreMateriauReport: async function (dateFrom, dateTo, materiau_id, typeTransaction) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT SUM(qte) as nb FROM tb_evolution_stock WHERE DATE(date_record) BETWEEN '" + dateFrom + "' AND '" + dateTo + "' AND materiau =? AND transaction =? AND approved=1 AND test IS NOT NULL";
            console.log(sql + "" + materiau_id + "|" + typeTransaction);
            con.query(sql, [materiau_id, typeTransaction], async function (err, rows) {
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
    materiauxUsageForPeriod: async function (dateFrom, dateTo) {
        let promise = new Promise((resolve, reject) => {
            let line = [];
            let sql = "SELECT DISTINCT(materiau) as materiau FROM tb_evolution_stock WHERE DATE(date_record) BETWEEN '" + dateFrom + "' AND '" + dateTo + "' ";
            console.log(sql);
            con.query(sql, async function (err, rows) {
                if (err) {
                    throw err;
                } else {
                    // console.log("RESULT " + rows);
                    for (item of rows) {
                        //Info about the materiau
                        let infoExam = await self.getMateriau(item.materiau);
                        let qteUtilisee = await self.singleMateriauReport(dateFrom, dateTo, item.materiau, "substract");
                        let line_info = {
                            Materiau: infoExam.nom_materiau,
                            qty: qteUtilisee
                        };
                        line.push(line_info);
                        console.log(line);

                    }
                    resolve(line);
                }
            });
        });
        data = await promise;
        //console.log(data); 
        return data;
    },
}