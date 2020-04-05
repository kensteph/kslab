const con = require('./database');
const helpers = require('../helpers/helpers');
module.exports = {
    //Save Teacher in the DB
    async savePatient(req, res) {
        //DATA RECEIVING
        console.log(req.body);
        firstName = req.body.firstname;
        lastName = req.body.lastname;
        fullname = firstName + " " + lastName;
        gender = req.body.gender;
        dateOfBirth = helpers.formatDate(req.body.datenais, "EN");
        adresse = req.body.adresse;
        phone = req.body.telephone;

        let promise = new Promise((resolve, reject) => {
            //   /* Begin transaction */
            con.beginTransaction(function (err) {
                if (err) { throw err; }
                //Insert info into personne table
                let sql = "INSERT INTO tb_personnes (prenom,nom,sexe,date_nais,adresse,telephone) VALUES ('" + firstName + "','" + lastName + "','" + gender + "','" + dateOfBirth + "','" + adresse + "','" + phone + "')";
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
                    //Insert info into professeur  table
                    let sql2 = "INSERT INTO tb_patients (id_personne,numero_patient) VALUES ('" + id_personne + "','" + numero_patient + "')";
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
                                msg: "Nouveau patient " + fullname + " ajouté avec succès..."
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
    listOfAllPatients: async function () {
        let promise = new Promise((resolve, reject) => {
            let sql = "SELECT *,CONCAT(prenom,' ',nom) as fullname,DATEDIFF( NOW(), date_nais )/365 as age FROM tb_personnes, tb_patients WHERE tb_patients.id_personne = tb_personnes.id";
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