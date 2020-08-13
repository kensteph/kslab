$(document).ready(function () {
    $("#SearchPatientButton").hide();
    //$("#loader").hide();
    var $rows = $('#table tr');
    $('#search').keyup(function () {
        // var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
        // $rows.show().filter(function () {
        //     var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        //     return !~text.indexOf(val);
        // }).hide();
        //$("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#table tr").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
        //});
    });


    //SEARCH FOR A PATIENT
    $('#searchPatientInput').keyup(function (e) {
        let wordToSearch = $(this).val().trim();
        if (wordToSearch.length >= 2) {
            $.post("/live-search-patient", { key: wordToSearch }, function (data) {
                console.log(data);
                if (data) {
                    $("#ResultList").html("");
                    for (i = 0; i < data.length; i++) {
                        let item = data[i];
                        let patient = "'" + item.patient + "'";;
                        let line = '<li> <a href="#" onclick="selectPatient(' + item.id_personne + ',' + patient + ')" >' + item.patient + '</a></li>';
                        $("#ResultList").append(line);
                    }
                } else {
                    //alert(data.msg);
                    $("#ResultList").html("Aucun résultat...");
                }
            });
        } else {
            $("#ResultList").html("");
        }
    });

    //SEARCH FOR A PATIENT
    $('#searchPatientInput').click(function (e) {
        $("#SearchPatientButton").hide();
        let wordToSearch = $(this).val().trim();
        if (wordToSearch.length >= 2) {
            $.post("/live-search-patient", { key: wordToSearch }, function (data) {
                console.log(data);
                if (data.length > 0) {
                    $("#ResultList").html("");
                    for (i = 0; i < data.length; i++) {
                        let item = data[i];
                        let patient = "'" + item.patient + "'";;
                        let line = '<li> <a href="#" onclick="selectPatient(' + item.id_personne + ',' + patient + ')" >' + item.patient + '</a></li>';
                        $("#ResultList").append(line);
                    }
                } else {
                    //Hide search button
                    $("#SearchPatientButton").hide();
                    $("#ResultList").html("Aucun résultat...");
                }
            });
        } else {
            $("#ResultList").html("");
        }
    });
    //Prevent users from submitting a form by hitting Enter
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

    //SEARCH INTO A TABLE
    $('#dtBasicExample').DataTable({
        "order": [[0, "desc"]]
    });
    $('.dataTables_length').addClass('bs-select');

});

function personAge(dob) {
    let birthday = new Date(dob);
    const diff = Date.now() - birthday.getTime();
    const ageDate = new Date(diff);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}
function startOfWeek(date) {
    var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);

    return new Date(date.setDate(diff));

}

function formatDate(dateP, lang) {
    console.log("Date Receive " + dateP);
    if (dateP == null) { return }
    let splitdat = dateP.split('-');
    if (splitdat.length == 1) { //they use / instead of -
        splitdat = dateP.split('/');
    }
    console.log("DATE FR : " + splitdat + " TO " + lang);
    let date_f = dateP;
    let Month = splitdat[1];
    let Day = splitdat[2];
    let Year = splitdat[0];

    if (Month < 10 && Month.length == 1) {
        Month = '0' + Month;
    }

    if (Day < 10 && Day.length == 1) { Day = "0" + Day; }

    if (lang == 'FR') {
        date_f = Day + '-' + Month + '-' + Year;
    }

    if (lang == 'EN') {
        date_f = Year + '-' + Month + '-' + Day;

    }
    //console.log("DATE FORMAT : " + date_f+" TO "+lang);
    //}
    return date_f;

}
function getStartAndEndDateOfTheWeekFromDate(givenDate) {
    let date = new Date(givenDate);
    let sd = startOfWeek(date);
    //On ajoute x jours
    let startDate = sd.getFullYear() + '-' + (sd.getMonth() + 1) + '-' + sd.getDate();
    sd.setDate(sd.getDate() + 6);
    let endDate = sd.getFullYear() + '-' + (sd.getMonth() + 1) + '-' + sd.getDate();
    let info = [formatDate(startDate, "FR"), formatDate(endDate, "FR")];
    $("#DateFrom").val(formatDate(startDate, "FR"));
    $("#DateTo").val(formatDate(endDate, "FR"));
    console.log(info);
}


getStartAndEndDateOfTheWeekFromDate(new Date());


