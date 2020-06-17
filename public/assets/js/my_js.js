$(document).ready(function () {
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

    // var notifArrayId = [];
    // function notifList(data) {
    //     let sms = '<li class="notification-message">';
    //     sms += '<a href="activities.html">';
    //     sms += '<div class="media">';
    //     sms += '<span class="avatar">';
    //     sms += '<img alt="John Doe" src="assets/img/user.jpg" class="img-fluid"></span>';
    //     sms += '<div class="media-body">';
    //     sms += '<p class="noti-details"><span class="noti-title">' + data.nom_materiau + '</span> added';
    //     sms += 'new task <span class="noti-title">Patient appointment booking</span></p>';
    //     sms += '<p class="noti-time"><span class="notification-time">4 mins ago</span></p>'
    //     sms += '</div> </div></a></li>';
    //     $("#notifications").append(sms);
    // };
    // var myVar = setInterval(myTimer, 5000);
    // function myTimer() {
    //     var d = new Date();
    //     var t = d.toLocaleTimeString();
    //     $("#notifications").html("");
    //     $.get("/notifications", function (data, status) {
    //         //alert("Data: " + data + "\nStatus: " + status);
    //         $("#countNotifs").html(data.length);
    //         for (notif of data) {
    //             notifList(notif);
    //         }

    //     });

    // }

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
    //Prevent users from submitting a form by hitting Enter
    $(window).keydown(function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            return false;
        }
    });

});


function formToJSONString(form) {
    var obj = {};
    var elements = form.querySelectorAll("input, select, textarea");
    for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        var name = element.name;
        var value = element.value;

        if (name) {
            obj[name] = value;
        }
    }

    return JSON.stringify(obj);
}