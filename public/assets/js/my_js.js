$(document).ready(function () {
    //SEARCH INTO A TABLE
    $('#dtBasicExample').DataTable({
        "order": [[ 0, "desc" ]]
        });
    $('.dataTables_length').addClass('bs-select');

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

});
