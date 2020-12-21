const con = require('./database');
const helpers = require('../helpers/helpers');
var self = module.exports = {
    //Save Teacher in the DB
    async savePatient(req, res) {
        //DATA RECEIVING
        console.log(req.body);
        let numero_patient = req.body.numero_patient;
        firstName = req.body.firstname;
        lastName = req.body.lastname;
        fullname = firstName + " " + lastName;
        gender = req.body.gender;
        let dateOfBirth = null;
        if (req.body.datenais.length >= 8) {
            dateOfBirth = helpers.formatDate(req.body.datenais, "EN");
        }
        let age_manuel = req.body.ageManuel;
        adresse = req.body.adresse;
        phone = req.body.telephone;
        email = req.body.email;

        let promise = new Promise((resolve, reject) => {
            //   /* Begin transaction */
            con.beginTransaction(function (err) {
                if (err) { throw err; }
                //Insert info into personne table
                let sql = "";
                let params = [];

                if (dateOfBirth == null) {
                    params = [firstName, lastName, gender, age_manuel, adresse, phone, email];
                    sql = "INSERT INTO tb_personnes (prenom,nom,sexe,age_manuel,adresse,telephone,email) VALUES (?,?,?,?,?,?,?)";
                } else {
                    params = [firstName, lastName, gender, dateOfBirth, age_manuel, adresse, phone, email];
                    sql = "INSERT INTO tb_personnes (prenom,nom,sexe,date_nais,age_manuel,adresse,telephone,email) VALUES (?,?,?,?,?,?,?,?)";
                }
                con.query(sql, params, function (err, result) {
                    if (err) {
                        //console.log(err);
                        con.rollback(function () {
                            msg = {
                                type: "danger",
                                error: true,
                                msg: "<font color='red'>Une erreur est survenue. S'il vous plait réessayez.</font>" + err
                            }
                            resolve(msg);
                        });
                    } else {
                        //console.log(result);
                        var id_personne = result.insertId;
                        let initial = firstName.charAt(0) + lastName.charAt(0);
                        if (numero_patient.trim().length == 0) {
                            numero_patient = helpers.generateCode(initial, id_personne);
                        }

                        //Insert info into professeur  table
                        let sql2 = "INSERT INTO tb_patients (id_personne,numero_patient) VALUES (?,?)";
                        con.query(sql2, [id_personne, numero_patient], function (err, result) {
                            if (err) {
                                con.rollback(function () {
                                    msg = {
                                        type: "danger",
                                        error: true,
                                        msg: err
                                    }
                                    resolve(msg);
                                });
                            }

                            //COMMIT IF ALL DONE COMPLETELY
                            con.commit(function (err) {
                                if (err) {
                                    con.rollback(function () {
                                        msg = {
                                            type: "danger",
                                            error: true,
                                            msg: err
                                        }
                                        resolve(msg);
                                    });
                                }
                                msg = {
                                    type: "success",
                                    success: true,
                                    patientID: id_personne,
                                    msg: "<font color='green'><strong>Nouveau patient " + fullname + " ajouté avec succès...</strong></font>"
                                }
                                resolve(msg);
                            });

                        });
                    }
                });
            });
            /* End transaction */
        });
        data = await promise;
        //console.log(data); 
        return data;
    },

    //Load All The Courses Categories
    listOfAllPatients: async function () {
        let promise = new Promise((resolve, reject) => {
            let infoList = [];
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,DATEDIFF( NOW(), date_nais )/365 as age FROM tb_personnes, tb_patients WHERE tb_patients.id_personne = tb_personnes.id ";
            //console.log(sql+" ID : "+id_personne);
            con.query(sql, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve([{ fullname: "" }]);
                } else {
                    for (info of rows) {
                        let date_nais_fr = "à préciser";
                        let age = 0;
                        if (info.date_nais != null) {
                            date_nais_fr = helpers.formatDate(info.date_nais, "FR");
                            age = helpers.personAge(info.date_nais);
                        }

                        if (info.age_manuel != null) {
                            age = info.age_manuel;
                        }
                        // console.log("AGE CLT : ", age);
                        let patient = {
                            id: info.id,
                            fullname: info.fullname,
                            prenom: info.prenom,
                            nom: info.nom,
                            sexe: info.sexe,
                            date_nais: info.date_nais,
                            date_nais_fr: date_nais_fr,
                            adresse: info.adresse,
                            telephone: info.telephone,
                            email: info.email,
                            statut: info.statut,
                            visible: info.visible,
                            id_personne: info.id_personne,
                            numero_patient: info.numero_patient,
                            date_ajout: info.date_ajout,
                            age: age,
                        };
                        infoList.push(patient);
                    }

                    resolve(infoList);
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
    //Load All The Courses Categories
    getPatientById: async function (id_personne) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,DATEDIFF( NOW(), date_nais )/365 as age FROM tb_personnes, tb_patients WHERE tb_patients.id_personne = tb_personnes.id AND tb_personnes.id = ? ";
            //console.log(sql+" ID : "+id_personne);
            con.query(sql, id_personne, function (err, rows) {
                if (err) {
                    //throw err;
                    resolve([{ fullname: "" }]);
                } else {
                    let info = rows[0];
                    console.log("PATIENT : ", info);
                    let age = 0;
                    let date_nais_fr = "à préciser";
                    if (info.date_nais != null) {
                        date_nais_fr = helpers.formatDate(info.date_nais, "FR");
                        if (info.age != null) {
                            age = info.age.toFixed(1); //helpers.personAge(info.date_nais);
                        }

                        //UPDATE AGE_MANUEL IF WE HAVE THE DOB
                        self.updatePersonneAge(age, info.id);
                    } else {
                        age = info.age_manuel;
                    }

                    let patient = {
                        id: info.id,
                        fullname: info.fullname,
                        prenom: info.prenom,
                        nom: info.nom,
                        sexe: info.sexe,
                        date_nais: info.date_nais,
                        date_nais_fr: date_nais_fr,
                        adresse: info.adresse,
                        telephone: info.telephone,
                        email: info.email,
                        statut: info.statut,
                        visible: info.visible,
                        id_personne: info.id_personne,
                        numero_patient: info.numero_patient,
                        date_ajout: info.date_ajout,
                        age: age,
                    };
                    resolve(patient);
                }
            });
        });
        data = await promise;
        return data;
    },

    //Load All The Courses Categories
    liveSearchPatient: async function (patient) {
        let promise = new Promise((resolve, reject) => {
            let sql =
                'SELECT id_personne,CONCAT(prenom," ",nom," (ID : ",tb_personnes.id,")"," ",numero_patient) as patient,tb_personnes.id from tb_personnes,tb_patients WHERE tb_personnes.id=tb_patients.id_personne AND CONCAT(prenom," ",nom," (ID : ",tb_personnes.id,")"," ",numero_patient) LIKE "%' +
                patient +
                '%"';
            //console.log(sql+" ID : "+patient);
            con.query(sql, patient, function (err, rows) {
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

    //Nombre de patients
    patientcountByStatus: async function (statut) {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT COUNT(id) as nb_patient FROM tb_personnes, tb_patients WHERE tb_patients.id_personne = tb_personnes.id AND tb_personnes.statut = ? ";
            //console.log(sql+" ID : "+id_personne);
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


    //UPDATE INFO PATIENT
    updatePatient: async function (req) {
        firstName = req.body.firstname;
        lastName = req.body.lastname;
        fullname = firstName + " " + lastName;
        gender = req.body.gender;
        let dateOfBirth = null;
        if (req.body.datenais.length >= 8) {
            dateOfBirth = helpers.formatDate(req.body.datenais, "EN");
        }
        let age_manuel = req.body.ageManuel;
        adresse = req.body.adresse;
        phone = req.body.telephone;
        status = req.body.status;
        email = req.body.email;
        id_personne = req.body.patientID;

        let promise = new Promise((resolve, reject) => {
            let sql = "";
            let params = [];
            if (dateOfBirth == null) {
                params = [firstName, lastName, gender, age_manuel, adresse, phone, status, email, id_personne];
                sql = "UPDATE tb_personnes SET prenom = ?,nom =? ,sexe =? ,age_manuel =? ,adresse =? ,telephone =?,statut =?,email=? WHERE id =?";
            } else {
                params = [firstName, lastName, gender, dateOfBirth, age_manuel, adresse, phone, status, email, id_personne];
                sql = "UPDATE tb_personnes SET prenom = ?,nom =? ,sexe =? ,date_nais =?,age_manuel =? ,adresse =? ,telephone =?,statut =?,email=? WHERE id =?";
            }
            //console.log(sql + " ID : " + id_personne);
            con.query(sql, params, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "<font color='red'> <strong>Une erreur est survenue. S'il vous palit réessayez.</strong></font>" + err,
                        error: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "<font color='green'> <strong>Les informations concernant " + fullname + " ont été modifiées avec succès.</strong></font>",
                        success: true,
                        patientID: id_personne,
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

    //UPDATE INFO PATIENT
    updatePersonneAge: async function (age, id_personne) {

        let promise = new Promise((resolve, reject) => {
            let sql = "";
            sql = "UPDATE tb_personnes SET age_manuel =? WHERE id =?";

            con.query(sql, [age, id_personne], function (err, rows) {
                if (err) {
                    resolve({
                        msg: "<font color='red'> <strong>Une erreur est survenue. S'il vous palit réessayez.</strong></font>" + err,
                        error: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "<font color='green'> <strong>L'age a été modifiées avec succès.</strong></font>",
                        success: true,
                        patientID: id_personne,
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },

    //Delete PATIENT
    deletePatient: async function (id_personne) {
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_personnes SET visible =? WHERE id =?";
            //console.log(sql + " ID : " + id_personne);
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
        //console.log(data);
        return data;
    },
    //Delete PATIENT DEFINITEVELY
    removePatient: async function (req) {
        let idPatient = req.body.PatientID;
        let fullname = req.body.fullname;
        let promise = new Promise((resolve, reject) => {
            let sql = "DELETE FROM tb_personnes  WHERE id =?";
            //console.log(sql + " ID : " + id_personne);
            con.query(sql, idPatient, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        type: "danger",
                        debug: err
                    });
                } else {
                    resolve({
                        msg: "Les informations concernant " + fullname + " ont été supprimées avec succès.",
                        success: "success"
                    });
                }
            });
        });
        data = await promise;
        //console.log(data);
        return data;
    },
}