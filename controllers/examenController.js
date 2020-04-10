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
}