var mkdirp = require('mkdirp');
var fs = require('fs');
var exec = require('child_process').exec;
var self = module.exports = {
    //EXECUTE AN EXE FILE
    excuteApp: function (path) {
        console.log("fun() start");
        exec(path, function (err, data) {
            console.log("ERROR : ", err)
            console.log(data.toString());
        });
    },
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
    getPastYear() {
        var dt = new Date();
        dt.setMonth(-12);
        pastYear = dt.getFullYear(); //Get the current year in 4 digits
        return pastYear;
    },
    getCurrentYear() {
        var dt = new Date();
        //dt.setMonth(12);
        CurrYear = dt.getFullYear(); //Get the current year in 4 digits
        return CurrYear;
    },
    getNextYear() {
        var dt = new Date();
        dt.setMonth(12);
        nextYear = dt.getFullYear(); //Get the current year in 4 digits
        return nextYear;
    },

    getCurrentMonth() {
        var dt = new Date();
        nextYear = dt.getMonth() + 1; //Get the current year in 4 digits
        return nextYear;
    },
    getPastMonth() {
        var dt = new Date();
        dt.setDate(dt.getDate() - 30); //Get the current year in 4 digits
        nextYear = dt.getMonth() + 1;
        console.log(nextYear);
        return nextYear;
    },
    getCurrentDateTime() {
        var today = new Date();
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date + ' ' + time;
        return dateTime;
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
    personAge(dob) {
        let birthday = new Date(dob);
        const diff = Date.now() - birthday.getTime();
        const ageDate = new Date(diff);
        return (ageDate.getUTCFullYear() - 1970);
    },
    startOfWeek(date) {
        var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);

        return new Date(date.setDate(diff));

    },
    getStartAndEndDateOfTheWeekFromDate(givenDate) {
        let date = new Date(givenDate);
        let sd = self.startOfWeek(date);
        //On ajoute x jours
        let startDate = sd.getFullYear() + '-' + (sd.getMonth() + 1) + '-' + sd.getDate();
        sd.setDate(sd.getDate() + 6);
        let endDate = sd.getFullYear() + '-' + (sd.getMonth() + 1) + '-' + sd.getDate();
        let info = [startDate, endDate];
        console.log("First week day : " + info);
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
    simpleUpload(req, filename, full_path_directory, field_name) {
        try {
            if (!req.files) {
                msg = {
                    status: false,
                    message: 'No file uploaded'
                };
                console.log(msg);
                return msg;
            } else {
                //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                let avatar = req.files[field_name];
                let split_img_name = avatar.name.split(".");
                let img_extension = split_img_name[1];
                if (filename == "") {
                    filename = avatar.name;
                } else {
                    filename = filename + "." + img_extension;
                }
                //Use the mv() method to place the file in upload directory (i.e. "uploads")
                avatar.mv(full_path_directory + filename);
                msg = {
                    status: true,
                    message: 'File is uploaded',
                    data: {
                        name: filename,
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
        let base64data = null;
        try {
            let buff = fs.readFileSync(pathFile);
            base64data = buff.toString('base64');
        } catch (error) {
            console.log('Image not converted to base 64 :\n\n' + error);
        }
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

    //Sort an array object
    compare(a, b) {
        if (a.Count < b.Count) {
            return -1;
        }
        if (a.Count > b.Count) {
            return 1;
        }
        return 0;
    },
    sortArrayObj(arrayObj) {
        return arrayObj.sort(self.compare);
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
    //===================================== DESTOP NOTIFICATIONS =====================================
    desktopNotification(title, message) {
        const notifier = require('node-notifier');
        const path = require('path');
        notifier.notify(
            {
                title: title,
                message: message,
                icon: path.join(__dirname, '../public/logo/logo.png'), // Absolute path (doesn't work on balloons)
                sound: true, // Only Notification Center or Windows Toasters
                open: 'http://localhost:8788/notifications',
                wait: false // Wait with callback, until user action is taken against notification, does not apply to Windows Toasters as they always wait or notify-send as it does not support the wait option
            },
            function (err, response) {
                // Response is response from notification
                console.log(response);
            }
        );

        notifier.on('click', function (notifierObject, options, event) {
            // Triggers if `wait: true` and user clicks notification
            const spawn = require('child_process').spawn;
            const cmd = spawn('open', ['https://davidwalsh.name']);
            console.log("CLIK!!!!!!!!!!!");
        });

        notifier.on('timeout', function (notifierObject, options) {
            // Triggers if `wait: true` and notification closes
        });


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
    },

    //===================================== DB BACKUP ===================================
    DatatbaseBackup(path) {
        const mysqldump = require('mysqldump');
        let path_directory = path;
        let resp = false;
        // dump the result straight to a file
        try {
            mysqldump({
                connection: {
                    host: process.env.DB_HOST,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    database: process.env.DB_NAME,
                },
                dumpToFile: path_directory + '/' + self.getCurrentDate() + '.sql',
            });
            resp = true;
        } catch (error) {
            console.log("BACKUP DB MSG : " + error);
        }

        return resp;
        // dump the result straight to a compressed file
        // mysqldump({
        //     connection: {
        //         host: 'localhost',
        //         user: 'root',
        //         password: '123456',
        //         database: 'my_database',
        //     },
        //     dumpToFile: './dump.sql.gz',
        //     compressFile: true,
        // });

        // // return the dump from the function and not to a file
        // const result = await mysqldump({
        //     connection: {
        //         host: 'localhost',
        //         user: 'root',
        //         password: '123456',
        //         database: 'my_database',
        //     },
        // });

    },
    //====================================================== SECURITY ================================
    is_session(req, res) {
        let response = false;
        if (req.session.username) {
            console.log("User still authenticated...");
            response = true;
        } else {
            //res.send('root')
            // res.statusCode = 404;
            // res.setHeader('Content-Type', 'text/plain');
            // res.end('Cannot ' + req.method + ' ' + req.url);
            // console.log("Redirect to...");
            // res.status(200).json({
            //     status: 'succes',
            //     data: req.body,
            //   });
            //   res.send('root');
            return;
        }
        return response;
    },
    //============================== SYSTEM INIGTION ==============================================
 

};
