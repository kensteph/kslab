const con = require('./database');
const helpers = require('../helpers/helpers');
module.exports = {
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
//Nombre de patients
testcountByStatus: async function (statut) {
    let promise = new Promise((resolve, reject) => {
        let sql = "";
        if(statut == "All"){
            sql = "SELECT COUNT(id) as nb_test FROM tb_test_requests";
        }else{
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
        
}