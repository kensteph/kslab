const con = require('./database');
const helpers = require('../helpers/helpers');
var self = module.exports = {
    //Nombre de patients
    patientcountByStatus: async function (statut) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(id) as nb_patient FROM tb_personnes, tb_patients WHERE tb_patients.id_personne = tb_personnes.id AND tb_personnes.statut = ? ";
            //console.log(sql+" ID : "+id_personne);
            con.query(sql, statut, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve(0);
                } else {
                    resolve(rows[0].nb_patient);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //Nombre de test par statut
    testcountByStatus: async function (statut) {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            if (statut == "All") {
                sql = "SELECT COUNT(id) as nb_test FROM tb_test_requests";
            } else {
                sql = "SELECT COUNT(id) as nb_test FROM tb_test_requests WHERE statut = ? ";
            }

            //console.log(sql+" ID : "+id_personne);
            con.query(sql, statut, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve(0);
                } else {
                    resolve(rows[0].nb_test);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

    //Nombre de materiaux
    StockCount: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            sql = "SELECT COUNT(id) as nb_test FROM tb_materiaux";
            //console.log(sql+" ID : "+id_personne);
            con.query(sql, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve(0);
                } else {
                    resolve(rows[0].nb_test);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

    //Stock expire
    StockExpiredCount: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "";
            sql = "SELECT COUNT(tb_stocks.id) as nb FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND DATEDIFF( date_expiration , Now() )<=0";
            //console.log(sql+" ID : "+id_personne);
            con.query(sql, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve(0);
                } else {
                    resolve(rows[0].nb);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

        //Stock Critique
        StockAlertCount: async function (nbJours) {
            let promise = new Promise((resolve, reject) => {
                let sql = "";
                sql = "SELECT COUNT(tb_stocks.id) as nb FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND DATEDIFF( date_expiration , Now() )>0 AND DATEDIFF( date_expiration , Now() )<="+nbJours;
                //console.log(sql+" ID : "+id_personne);
                con.query(sql, function (err, rows) {
                    if (err) {
                        //throw err;
                        resolve(0);
                    } else {
                        resolve(rows[0].nb);
                    }
                });
            });
            data = await promise;
            //console.log(data);
            return data;
        },


    //============================================ APP SETTINGS ========================================
    //SAVE OR UPDATE SETTINGS
    saveSettings: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let line1 = req.body.line1;
            let line2 = req.body.line2;
            let line3 = req.body.line3;
            let line4 = req.body.line4;
            let line5 = req.body.line5;
            let line6 = req.body.line6;
            let logo = req.body.logo;
            let sql =
                'INSERT INTO tb_app_settings (line1,line2,line3,line4,line5,line6,logo) VALUES ("' + line1 + '","' + line2 + '","' + line3 + '","' + line4 + '","' + line5 + '","' + line6 + '","' + logo + '")';
            con.query(sql, function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté ",
                        // debug: err
                    };
                    self.updateSettings(req);
                } else {
                    msg = {
                        type: "success",
                        msg:
                            "Paramètres enregistrés avec succès.",
                    };
                }

                resolve(msg);
                console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    //update settings
    updateSettings: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let line1 = req.body.line1;
            let line2 = req.body.line2;
            let line3 = req.body.line3;
            let line4 = req.body.line4;
            let line5 = req.body.line5;
            let line6 = req.body.line6;
            let sql = "UPDATE tb_app_settings SET line1='" + line1 + "',line2='" + line2 + "',line3='" + line3 + "',line4='" + line4 + "',line5='" + line5 + "',line6='" + line6 + "' WHERE labo=1 ";
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
        //console.log(data); 
        return data;
    },
    //update settings
    updateLogo: async function (logo) {
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_app_settings SET logo='" + logo + "' WHERE labo=1 ";
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
    //Get settings
    getSettings: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT * FROM tb_app_settings WHERE labo=1 ";
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
    //============================================== NOTIFICATIONS =============================================
    saveNotification: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let nom_examen = req.body.nomExamen;
            let type_examen = req.body.typeResultat;
            let ifbilan = req.body.ifbilan;
            let sql =
                'INSERT INTO tb_notifications (de,a,type_notif,contenu,) VALUES ("' + nom_examen + '","' + type_examen + '","' + ifbilan + '")';
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
                console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },


}