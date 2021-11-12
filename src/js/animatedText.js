var typing = false;
function maquina(contenedor, texto, intervalo, n){
    //If this is running in other instance we must wait.
    if(typing) {
        return;
    } else {
        $("#" + contenedor).html("");
    };
    typing = true;
    var i = 0,

    timer = setInterval(function() {
        if ( i < texto.length) {

            $("#"+contenedor).html(texto.substr(0,i++) + "_");
        } else {
            clearInterval(timer);
            $("#"+contenedor).html(texto);

            if ( --n != 0 ) {
                typing = false;
                blinkStepA(contenedor, texto);
            }
        }
    }, intervalo);
};

function blinkStepA(contenedor, texto) {
    if (typing == false) {
        $("#"+contenedor).html(texto.substr(0, texto.length) + "_");
        setTimeout(function() {
            blinkStepB(contenedor, texto);
        }, 1000)
    }
}

function blinkStepB(contenedor, texto) {
    if (typing == false) {
        $("#"+contenedor).html(texto.substr(0, texto.length) + "");
        setTimeout(function() {
            blinkStepA(contenedor, texto);
        }, 1000)
    }
}