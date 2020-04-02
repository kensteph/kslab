const con = require('./database');
const helpers = require('../helpers/helpers');
module.exports = {
    //Save Exam
    saveExam: async function(req) {
        let promise = new Promise((resolve, reject) => {
            let nom_examen = req.body.nomExamen;
            let type_examen = req.body.typeResultat;
            let ifbilan = req.body.ifbilan;
            let sql =
                'INSERT INTO tb_examens (nom_examen,type_resultat,is_bilan) VALUES ("'+nom_examen+'","'+type_examen+'","'+ifbilan+'")';
            con.query(sql, function(err, result) {
                if (err) {
                    msg = {
                        type: "danger",
                        error: true,
                        msg:
                            " Vous avez déja ajouté "+nom_examen+" ",
                        debug: err
                    };
                } else {
                    msg = {
                        type: "success",
                        msg: 
                        nom_examen+" enregistré avec succès.",
                    };
                }

                resolve(msg);
                console.log(msg);
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
        dateOfBirth = req.body.datenais;// helpers.formatDate(req.body.datenais, "EN");
        adresse = req.body.adresse;
        phone = req.body.telephone;
        status = req.body.status;
        id_personne = req.body.patientID;
        let params = [firstName, lastName, gender, dateOfBirth, adresse, phone,status, id_personne];
        let promise = new Promise((resolve, reject) => {
            let sql = "UPDATE tb_personnes SET prenom = ?,nom =? ,sexe =? ,date_nais =? ,adresse =? ,telephone =?,statut =? WHERE id =?";
            console.log(sql+" ID : "+id_personne);
            con.query(sql, params, function (err, rows) {
                if (err) {
                    resolve({
                        msg: "Une erreur est survenue. S'il vous palit réessayez.",
                        type: "danger",
                        debug : err
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
                console.log(sql+" ID : "+id_personne);
                con.query(sql, id_personne, function (err, rows) {
                    if (err) {
                        resolve({
                            msg: "Une erreur est survenue. S'il vous palit réessayez.",
                            type: "danger",
                            debug : err
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