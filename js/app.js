var appData = null;
var currentMapItem = null;
var currentLang = "th";

var historyStack = [
    "screen-home"
];

var idleTimer = null;

document.addEventListener(
    "DOMContentLoaded",
    function(){

        alert("APP START");
        
        loadData();

        setupButtons();

        setupAutoRefresh();

    }
);

function loadData(){

    var xhr =
        new XMLHttpRequest();

    xhr.onreadystatechange =
        function(){

            if(
                xhr.readyState === 4 &&
                xhr.status === 200
            ){

                appData =
                    JSON.parse(
                        xhr.responseText
                    );

                buildOfficeList();

                buildPrograms();

            }

        };

    xhr.open(
        "GET",
        "data/data.json",
        true
    );

    xhr.send();

}

function setupButtons(){

    document
        .getElementById("homeBtn")
        .onclick = goHome;

    document
        .getElementById("backBtn")
        .onclick = goBack;

    document
        .getElementById("langToggle")
        .onclick = toggleLanguage;

    var menuButtons =
        document.querySelectorAll(
            ".main-menu-btn"
        );

    var i;

    for(i=0;i<menuButtons.length;i++){

        menuButtons[i].onclick =
            function(){

                var target =
                    this.getAttribute(
                        "data-target"
                    );

                navigateTo(target);

            };

    }

    startIdleTimer();

}

function buildOfficeList(){

    var container =
        document.getElementById(
            "office-list"
        );

    container.innerHTML = "";

    var offices =
        appData.offices;

    var i;

    for(i=0;i<offices.length;i++){

        createOfficeButton(
            container,
            offices[i]
        );

    }

}

function createOfficeButton(
    container,
    office
){

    var item =
        document.createElement("div");

    item.className =
        "list-item";

    item.innerHTML =
        "<span>" +
        office.name[currentLang] +
        "</span>" +
        "<i class='fa-solid fa-location-dot'></i>";

    item.onclick = function(){

        showMap(
            office.name[currentLang],
            office.x,
            office.y
        );

    };

    container.appendChild(item);

}

function buildPrograms(){

    var container =
        document.getElementById(
            "faculty-programs"
        );

    container.innerHTML = "";

    var programs =
        appData.programs;

    var i;

    for(i=0;i<programs.length;i++){

        var btn =
            document.createElement("div");

        btn.className =
            "branch-card";

        btn.innerHTML =
            programs[i];

        btn.onclick =
            createProgramHandler(
                programs[i]
            );

        container.appendChild(btn);

    }

}

function createProgramHandler(
    program
){

    return function(){

        showFaculty(program);

        navigateTo(
            "screen-instructors"
        );

    };

}

function showFaculty(program){

    document
        .getElementById(
            "faculty-title"
        ).innerHTML =
            program;

    var container =
        document.getElementById(
            "instructor-list"
        );

    container.innerHTML = "";

    var teachers =
        appData.instructors[
            program
        ];

    var i;

    for(i=0;i<teachers.length;i++){

        createInstructor(
            container,
            teachers[i]
        );

    }

}

function createInstructor(
    container,
    teacher
){

    var item =
        document.createElement("div");

    item.className =
        "list-item instructor-item";

    item.innerHTML =

    "<div class='instructor-info'>" +

    "<img src='" +
    teacher.image +
    "' class='instructor-img'>" +

    "<span>" +
    (currentLang === "en"
     ? teacher.name_th
     : teacher.name_en)
        +
    "</span>" +

    "</div>" +

    "<i class='fa-solid fa-location-dot'></i>";

    item.onclick =
        function(){
    
        currentMapItem =
        teacher;
            
    showMap(
    
            currentLang === "en"
            ? teacher.name_th
            : teacher.name_en,
        
            teacher.x,
        
            teacher.y,
    
            "Room/ห้อง : " +
            teacher.room +
    
            "<br>" +
    
            teacher.detail_th,
    
            teacher.image
    
    );
};       
    container.appendChild(item);

}

function showMap(
    title,
    x,
    y,
    detail,
    image
){

    document
        .getElementById(
            "map-subtitle"
        ).innerHTML = title;

    if(detail){

        document
            .getElementById(
                "map-detail"
            )
            .innerHTML = detail;

    }
    else{

        document
            .getElementById(
                "map-detail"
            )
            .innerHTML = "";

    }

    // แสดงรูป
    if(image){

        document
            .getElementById(
                "map-person-image"
            )
            .src = image;

        document
            .getElementById(
                "map-person-image"
            )
            .style.display = "block";

    }
    else{

        document
            .getElementById(
                "map-person-image"
            )
            .style.display = "none";

    }

    navigateTo("screen-map");

    var pin =
        document.getElementById(
            "map-pin"
        );

    pin.classList.remove(
        "show"
    );

    setTimeout(function(){

        pin.style.left =
            x + "%";

        pin.style.top =
            y + "%";

        pin.classList.add(
            "show"
        );

    },300);

}

function navigateTo(screenId){

    var current =
        historyStack[
            historyStack.length-1
        ];

    if(current===screenId){

        return;

    }

    document
        .getElementById(current)
        .classList
        .remove("active");

    document
        .getElementById(screenId)
        .classList
        .add("active");

    historyStack.push(
        screenId
    );

    updateNavButtons();

    resetIdleTimer();

}

function goBack(){

    if(historyStack.length<=1){

        return;

    }

    var current =
        historyStack.pop();

    var previous =
        historyStack[
            historyStack.length-1
        ];

    document
        .getElementById(current)
        .classList
        .remove("active");

    document
        .getElementById(previous)
        .classList
        .add("active");

    updateNavButtons();

}

function goHome(){

    var screens =
        document.querySelectorAll(
            ".screen"
        );

    var i;

    for(i=0;i<screens.length;i++){

        screens[i]
        .classList
        .remove("active");

    }

    document
        .getElementById(
            "screen-home"
        )
        .classList
        .add("active");

    historyStack = [
        "screen-home"
    ];

    updateNavButtons();

}

function updateNavButtons(){

    var visible =
        historyStack.length > 1;

    document
        .getElementById(
            "homeBtn"
        )
        .style.visibility =
            visible
            ? "visible"
            : "hidden";

    document
        .getElementById(
            "backBtn"
        )
        .style.visibility =
            visible
            ? "visible"
            : "hidden";

}

function toggleLanguage(){

    currentLang =
        currentLang==="th"
        ? "en"
        : "th";

    document
        .getElementById(
            "langToggle"
        )
        .innerHTML =
            currentLang==="th"
            ? "EN"
            : "TH";

    updateLanguageTexts();

    buildOfficeList();

    // รีเฟรชรายชื่ออาจารย์
    if(
        historyStack[
            historyStack.length-1
        ] === "screen-instructors"
    ){

        var program =
            document
            .getElementById(
                "faculty-title"
            )
            .innerHTML;

        showFaculty(program);

    }

    // รีเฟรชหน้าแผนที่
    if(
        historyStack[
            historyStack.length-1
        ] === "screen-map"
        &&
        currentMapItem
    ){

        document
            .getElementById(
                "map-subtitle"
            )
            .innerHTML =

            currentLang==="th"
            ? currentMapItem.name_th
            : currentMapItem.name_en;

        document
            .getElementById(
                "map-detail"
            )
            .innerHTML =

            "ห้อง : " +
            currentMapItem.room +

            "<br>" +

            (
                currentLang==="th"
                ? currentMapItem.detail_th
                : currentMapItem.detail_en
            );

    }

}

function updateLanguageTexts(){

    var elements =
        document.querySelectorAll(
            "[data-th]"
        );

    var i;

    for(i=0;i<elements.length;i++){

        elements[i].innerHTML =
            elements[i]
            .getAttribute(
                "data-" +
                currentLang
            );

    }

}

function startIdleTimer(){

    document.onclick =
        resetIdleTimer;

    document.ontouchstart =
        resetIdleTimer;

    document.onmousemove =
        resetIdleTimer;

    resetIdleTimer();

}

function resetIdleTimer(){

    clearTimeout(
        idleTimer
    );

    idleTimer =
        setTimeout(
            goHome,
            60000
        );

}

function setupAutoRefresh(){

    setInterval(

        function(){

            location.reload();

        },

        1800000

    );

}
