var currentLanguage = "th";

var facultyData = {};

function loadFacultyData(){

    var xhr =
        new XMLHttpRequest();

    xhr.onreadystatechange =
    function(){

        if(
            xhr.readyState===4 &&
            xhr.status===200
        ){

            facultyData =
                JSON.parse(
                    xhr.responseText
                );

            showFaculty("ABM");

        }

    };

    xhr.open(
        "GET",
        "data/faculty.json",
        true
    );

    xhr.send();

}

function showPanel(panelId){

    var panels =
        document.getElementsByClassName("panel");

    var i;

    for(i=0;i<panels.length;i++){

        panels[i].className =
            "panel hidden";

    }

    document.getElementById(
        panelId + "-panel"
    ).className = "panel";

}

function showFaculty(program){

    var facultyContainer =
        document.getElementById(
            "faculty-list"
        );

    var html = "<ul>";

    var names =
        facultyData[program];

    var i;

    for(i=0;i<names.length;i++){

        html += "<li>" +
                names[i] +
                "</li>";

    }

    html += "</ul>";

    facultyContainer.innerHTML =
        html;

}

function switchLanguage(lang){

    currentLanguage = lang;

    var thItems =
        document.getElementsByClassName(
            "lang-th"
        );

    var enItems =
        document.getElementsByClassName(
            "lang-en"
        );

    var i;

    if(lang==="th"){

        for(i=0;i<thItems.length;i++){

            thItems[i].style.display =
                "block";

        }

        for(i=0;i<enItems.length;i++){

            enItems[i].style.display =
                "none";

        }

    }

    if(lang==="en"){

        for(i=0;i<thItems.length;i++){

            thItems[i].style.display =
                "none";

        }

        for(i=0;i<enItems.length;i++){

            enItems[i].style.display =
                "block";

        }

    }

}

function resetHome(){

    showPanel("office");

    showFaculty("ABM");

}

var idleTimer;

function restartIdleTimer(){

    clearTimeout(idleTimer);

    idleTimer =
        setTimeout(
            resetHome,
            60000
        );

}

document.onclick =
    restartIdleTimer;

document.ontouchstart =
    restartIdleTimer;

document.onmousemove =
    restartIdleTimer;

restartIdleTimer();

setInterval(function(){

    location.reload();

},1800000);

window.onload = function(){

    loadFacultyData();

    switchLanguage("th");

};