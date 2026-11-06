            : "TH";

    updateLanguageTexts();

    buildOfficeList();

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
