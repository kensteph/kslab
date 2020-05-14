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
            sql = "SELECT COUNT(tb_stocks.id) as nb FROM tb_stocks,tb_materiaux WHERE tb_stocks.materiau=tb_materiaux.id AND DATEDIFF( date_expiration , Now() )>0 AND DATEDIFF( date_expiration , Now() )<=" + nbJours+" OR min_stock >=qte_restante AND statut=1";
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
    //============================================= USERS ========================================

    //Save Teacher in the DB
    async saveUser(req, res) {
        //DATA RECEIVING
        console.log(req.body);
        let firstName = req.body.firstname;
        let lastName = req.body.lastname;
        let fullname = firstName + " " + lastName;
        let user_name = req.body.username;
        let gender = req.body.gender;
        let dateOfBirth = helpers.formatDate(req.body.datenais, "EN");
        let adresse = req.body.adresse;
        let phone = req.body.telephone;
        let email = req.body.email;

        let promise = new Promise((resolve, reject) => {
            //   /* Begin transaction */
            con.beginTransaction(function (err) {
                if (err) { throw err; }
                //Insert info into personne table
                let sql = "INSERT INTO tb_personnes (prenom,nom,sexe,date_nais,adresse,telephone,email) VALUES ('" + firstName + "','" + lastName + "','" + gender + "','" + dateOfBirth + "','" + adresse + "','" + phone + "','" + email + "')";
                con.query(sql, function (err, result) {
                    if (err) {
                        console.log(err);
                        con.rollback(function () {
                            throw err;
                        });
                    }
                    console.log(result);
                    var id_personne = result.insertId;
                    let initial = firstName.charAt(0) + lastName.charAt(0);
                    let numero_patient = helpers.generateCode(initial, id_personne);
                    let default_pass = "KSl@b12345678";
                    //Insert info into professeur  table
                    let sql2 = "INSERT INTO tb_users (id_personne,id_employe,user_name,pass_word) VALUES (" + id_personne + ",'" + numero_patient + "','" + user_name + "','" + default_pass + "')";
                    con.query(sql2, function (err, result) {
                        if (err) {
                            con.rollback(function () {
                                throw err;
                            });
                        }

                        //COMMIT IF ALL DONE COMPLETELY
                        con.commit(function (err) {
                            if (err) {
                                con.rollback(function () {
                                    throw err;
                                });
                            }
                            msg = {
                                type: "success",
                                success: true,
                                patientID: id_personne,
                                msg: "Nouvel utilisateur " + fullname + " ajouté avec succès..."
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

    //Load All The Courses Categories
    listOfAllUsers: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,DATEDIFF( NOW(), date_nais )/365 as age FROM tb_personnes, tb_users WHERE tb_users.id_personne = tb_personnes.id";
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
    getUserById: async function (id_personne) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,DATEDIFF( NOW(), date_nais )/365 as age FROM tb_personnes, tb_users WHERE tb_users.id_personne = tb_personnes.id AND tb_personnes.id = ? ";
            //console.log(sql + " ID : " + id_personne);
            con.query(sql, id_personne, function (err, rows) {
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
    //UPDATE INFO USER
    updateUser: async function (req) {
        firstName = req.body.firstname;
        lastName = req.body.lastname;
        fullname = firstName + " " + lastName;
        gender = req.body.gender;
        dateOfBirth = req.body.datenais;// helpers.formatDate(req.body.datenais, "EN");
        adresse = req.body.adresse;
        phone = req.body.telephone;
        status = req.body.status;
        let email = req.body.email;
        id_personne = req.body.patientID;

        let params = [firstName, lastName, gender, dateOfBirth, adresse, phone, status, email, id_personne];
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_personnes SET prenom = ?,nom =? ,sexe =? ,date_nais =? ,adresse =? ,telephone =?,statut =?,email=? WHERE id =?";
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
        //Login
        userAuthentication: async function (username,password) {
            let promise = new Promise((resolve, reject) => {
                let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,DATEDIFF( NOW(), date_nais )/365 as age FROM tb_personnes, tb_users WHERE tb_users.id_personne = tb_personnes.id AND user_name = ? AND pass_word=? AND statut=1";
                console.log(sql + " CREDENTIALS : "+username+" | "+password);
                con.query(sql,[username,password], function (err, rows) {
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
    //UPDATE TEST STATUS
    changePassword: async function (id_user,password) {
        let promise = new Promise((resolve, reject) => {
            let sql =
                'UPDATE tb_users SET pass_word="'+password+'",change_pass=0 WHERE id_personne ='+id_user;
            console.log(sql);
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
                            "<font color='green'><strong>Mot de passe changer avec succèss...</strong></font>",
                        nb_success: result.affectedRows,
                    };
                }

                resolve(msg);
                console.log(msg);
            });
        });
        rep = await promise;
        return rep;
    },
    saveUserPermision: async function (req) {
        let promise = new Promise((resolve, reject) => {
            let Menu = req.body.Menu.join("|");
            let SubMenu = req.body.SubMenu.join("|");
            let user_id = req.body.user_id;
            let sql =
                'UPDATE tb_users SET menu_access = "' + Menu + '",sub_menu_access = "' + SubMenu + '" WHERE id_personne=?';
            con.query(sql,user_id, function (err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté " + Menu + " ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg:
                        Menu + " enregistré avec succès.",
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