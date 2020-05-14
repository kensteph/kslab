var mkdirp = require('mkdirp');
var fs = require('fs');

module.exports = {
    //Generate Code for the Student
    generateCode: function (initial, idPersonne) {
        var dt = new Date();
        part1 = dt.getFullYear(); //Get the current year in 4 digits
        part2 = Math.floor(Math.random() * 10000 + 1000);
        codeGen = initial + '-' + part1 + '-' + idPersonne;
        console.log(codeGen);
        return codeGen;
    },
    //DATE
    getNextYear() {
        var dt = new Date();
        dt.setMonth(12);
        nextYear = dt.getFullYear(); //Get the current year in 4 digits
        return nextYear;
    },

    getCurrentDate(lang) {
        var today = new Date();
        var zero = '';
        var Day = today.getDate();
        var Month = today.getMonth() + 1;
        if (Month < 10) {
            Month = '0' + Month;
        }
        var Year = today.getFullYear();
        if (Day < 10) { Day = "0" + Day; }
        var date = Year + '-' + Month + '-' + Day;
        if (lang == 'FR') {
            date = Day + '-' + Month + '-' + Year;
        }
        //console.log(date);
        return date;
    },
    getDaysInMonth(month, year) {
        // Here January is 1 based
        //Day 0 is the last day in the previous month
        return new Date(year, month, 0).getDate();
        // Here January is 0 based
        // return new Date(year, month+1, 0).getDate();
    },
    //Format Date from FR to EN for the Datatbase
    formatDate(dateP, lang) {
        // console.log("Date Receive "+dateP);
        let splitdat = dateP.split('-');
        if (splitdat.length == 1) { //they use / instead of -
            splitdat = dateP.split('/');
        }
        //console.log("DATE FR : " + splitdat+" TO "+lang);
        let date_f = dateP;
        if (lang == 'FR') {
            date_f = splitdat[2] + '-' + splitdat[1] + '-' + splitdat[0];
        }
        if (lang == 'EN') {
            date_f = splitdat[2] + '-' + splitdat[1] + '-' + splitdat[0];

        }
        //console.log("DATE FORMAT : " + date_f+" TO "+lang);
        return date_f;

    },
    changeDateSymbol(dateF) {
        //dateF = "2020/02/03";
        let pos = dateF.search("/");
        let symbole = "";
        let splitdat = "";
        let newSymbole = "";
        if (pos == -1) {
            symbole = "-";
            newSymbole = "/";
        } else {
            symbole = "/";
            newSymbole = "-";
        }
        splitdat = dateF.split(symbole);
        let finaldate = splitdat.join(newSymbole);
        //console.log(" SYMBOLE : "+symbole+" NEW SYMBOLE : "+newSymbole+" SPLIT : "+finaldate);
        return finaldate;
    },
    //get the next or current Academic year
    getAcademicYear() {
        var today = new Date();
        var zero = '';
        var aneAca = {};
        var Day = today.getDate();
        var Month = today.getMonth() + 1;
        var Year = today.getFullYear();
        aneAcaP = Year - 1 + '-' + Year;
        aneAcaN = Year + '-' + (Year + 1);
        aneAca = { Previous: aneAcaP, Next: aneAcaN };
        return aneAca;
    },
    createFolder(full_path_directory) {
        //Check if a directory is exists
        fs.access(full_path_directory, function (error) {
            if (error) {
                console.log('Directory does not exist.');
                //SO CREATE IT !
                mkdirp(full_path_directory, function (err) {
                    if (err) console.error(err);
                    else console.log('New Directory created for ');
                });
            } else {
                // DO NOTHING
                console.log('Directory already exists.' + full_path_directory);
            }
        });
    },
    //Delete All Files in a folder
    removeFiles(directory) {
        fs.readdir(directory, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(directory, file), err => {
                    if (err) throw err;
                });
            }
        });
    },
    //Count Dir Items
    countDir(path) {
        var totalFiles = 1;
        fs.readdir(path, function (error, files) {
            totalFiles = files.length; // return the number of files
            console.log("process...");
        });
        return totalFiles;
    },
    simpleUpload(req, res, full_path_directory) {
        try {
            if (!req.files) {
                msg = {
                    status: false,
                    message: 'No file uploaded'
                };
                return msg;
            } else {
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                let avatar = req.files.avatar;
                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                avatar.mv(full_path_directory + avatar.name);
                msg = {
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: avatar.name,
                        mimetype: avatar.mimetype,
                        size: avatar.size
                    }
                };
                return msg;
            }
        } catch (err) {
            //res.status(500).send(err);
            console.log(err);
        }
    },
    resizeImage(width, height, path, image_name) {
        Clipper('path/' + image_name, function () {
            this.crop(20, 20, 100, 100)
                .resize(50, 50)
                .quality(80)
                .toFile('path/test.jpg', function () {
                    console.log('saved!');
                });
        });
    },
    //Convert image to base64
    base64(pathFile) {
        const fs = require('fs');
        let buff = fs.readFileSync(pathFile);
        let base64data = buff.toString('base64');
        //console.log('Image converted to base 64 is:\n\n' + base64data);
        return base64data;
    },

    //Additioner les memes proprietes d une collection d 'objets
    SumArrayObjectByProperties(objectList, property) {
        var Total = objectList.reduce(function (prev, cur) {
            return prev + cur[property];
        }, 0);
        return Total;
    },
    //Formater un nombre (2,500.25)
    numberFormat(num, symbole) {
        return symbole + " " + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },

    //Formater un nombre (2,500.25)
    ageFormat(num, symbole) {
        return symbole + " " + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    },

    //Fonction permettant de rechercher dans une collection d'objets
    searchObject(arrayObject, property_to_search, value_to_search) {
        let found = arrayObject.find(obj => obj[property_to_search] == value_to_search);
        return found;
    },
    //Return an unique array from a given one
    array_unique(array) {
        return Array.from(new Set(array));
    },

    titleByAge(age, sexe) {
        age = parseFloat(age);
        console.log("AGE : " + age + " SEXE : " + sexe);
        let title = "";
        if (age <= 4) {
            title = "bebe";
        } else if (age <= 12) {
            title = "enfant";
        } else if (age <= 20) {
            title = "adolescent";
        } else {
            if (sexe == "F") {
                title = "femme";
            } else {
                title = "homme";
            }
        }
        return title;
    },
    //============================================ EMAIL ============================================
    sendEmail(ent_email, pass, recipient_email, attach_file, subject, body) {
        var nodemailer = require('nodemailer');

        var mail = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: ent_email,
                pass: pass
            }
        });

        var mailOptions = {
            from: ent_email,
            to: recipient_email,
            subject: subject,
            html: body,
            attachments: [
                {
                    filename: attach_file,
                    content: 'Résultat'
                },
                {   // file on disk as an attachment
                    filename: 'resultat.pdf',
                    path: './tmp/10-05-2020.pdf' // stream this file
                }
            ]
        };

        mail.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
};
