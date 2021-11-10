function maquina(contenedor, texto, intervalo, n){
    var i = 0,
    // Creamos el timer
    timer = setInterval(function() {
        if ( i<texto.length ) {
            // Si NO hemos llegado al final del texto..
            // Vamos añadiendo letra por letra y la _ al final.
            $("#"+contenedor).html(texto.substr(0,i++) + "_");
        } else {
            // En caso contrario..
            // Salimos del Timer y quitamos la barra baja (_)
            clearInterval(timer);
            $("#"+contenedor).html(texto);
            // Auto invocamos la rutina n veces (0 para infinito)
            if ( --n != 0 ) {
                //Aqui tengo que hacer una funcion recursiva
                blinkStepA(contenedor, texto);
            }
        }
    },intervalo);
};

function blinkStepA(contenedor, texto) {
    $("#"+contenedor).html(texto.substr(0, texto.length) + "_");
    setTimeout(function() {
        blinkStepB(contenedor, texto);
    }, 1000)
}

function blinkStepB(contenedor, texto) {
    $("#"+contenedor).html(texto.substr(0, texto.length) + "");
    setTimeout(function() {
        blinkStepA(contenedor, texto);
    }, 1000)
}