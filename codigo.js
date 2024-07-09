
const NUMEROTOPOS = 5;

let toposRestantes = NUMEROTOPOS;
let fallos = 0;

const sonidoAcierto = new Audio("sonidos/acierto.wav");
const sonidoFallo = new Audio("sonidos/fallo.wav");

/**
 * Generar un número aleatorio entre el mínimo y máximo dados (ambos incluidos)
 * @param {number} min - valor mínimo
 * @param {number} max - valor máximo
 * @returns {number} - el número generado
 */
function generarAleatorio(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Comprueba si hay un nuevo record, guardándolo en ese caso
 */
function guardarRecord() {
    const recordActual = localStorage.getItem("record");
    if(recordActual == null) {
        localStorage.setItem("record", fallos);
    } else if(recordActual > fallos) {
        localStorage.setItem("record", fallos);
    }
}

/**
 * Carga el record actual
 * @returns {number} - el record actual
 */
function cargarRecord() {
    return localStorage.getItem("record");
}

/**
 * Oculta los topos de las casillas
 */
function ocultarTopos() {
    $(".casilla").css("background-image", "url(imagenes/cesped.png)").on("click", comprobarCasilla);
}

/**
 * Finaliza la partida mostrando el resultado
 */
function finJuego() {
    // Quitamos los eventos para que no se peuda seguir jugando
    $(".casilla").off("click");
    guardarRecord();
    $("#final").css("display", "block");
    if(fallos == 0) {
        $("#resultado").text("Perfecto");
    } else if(fallos < 3) {
        $("#resultado").text("Muy bien");

    } else if(fallos < 6) {
        $("#resultado").text("Bien");

    } else if(fallos < 10) {
        $("#resultado").text("mal");

    } else {
        $("#resultado").text("penoso");
    }
    $("#record").text(cargarRecord());
}

/**
 * Comprueba si la casilla pulsada tiene o no un topo
 * @param {Object} evt - información del evento jQuery
 */

function comprobarCasilla(evt) {
    // Con $(this) cogemos el objeto jQuery, con this el DOM
    if($(this).data("topo") == "si") {
        toposRestantes--;
        sonidoAcierto.play();
        $("#toposRestantes").text(toposRestantes);
        $(this).css("background-image", "url(imagenes/muerto.png)");
        // Quitamos el evento click de esta casilla
        $(this).off("click");
        $(this).css("animation", "");
        this.offsetWidth;
        $(this).css("animation", "acierto .5s");
        if(toposRestantes == 0) {
            finJuego();
        }
    }   else {
        fallos++;
        sonidoFallo.play();
        $(this).css("background-image", "url(imagenes/probado.png)");
        $("#fallos").text(fallos);
    }  
}

/**
 * Prepara la partida
 */
function prepararJuego() {
    const casillas = $(".casilla");
    const generados = [];
    // Generamos 5 topos
    for (let i = 0; i < NUMEROTOPOS; i++) {
        // Generamos un número mientras esté repetido
        let numero;
        do {
            numero = generarAleatorio(0, casillas.length - 1);
        } while (generados.indexOf(numero) != -1); // indexOf devuelve -1 si no existe
        generados.push(numero);
        // eq devuelve el elemento de la posición indicada
        casillas.eq(numero).css("backgroundImage", "url(imagenes/topo.png)");
        // Guardamos un atributo para indicar que en esa casilla hay un topo.
        // Se podría comprobar backgroundImage pero así queda mejor
        casillas.eq(numero).data("topo", "si");
    }
    // Ocultamos los topos pasado 1 segundo
    setTimeout(ocultarTopos, 1000);
}

/**
 * Reinicia la partida
 */
function reiniciar() {
    toposRestantes = NUMEROTOPOS;
    fallos = 0;
    $("#toposRestantes").text(toposRestantes);
    $("#fallos").text(fallos);
    $(".casilla")
        .css("background-image", "url(imagenes/cesped.png")
        .data("topo", "no") // Si ponemos undefined no lo guarda
        .off("click") // Debe hacer el off pues peude haber casillas con el evento
        .on("click", comprobarCasilla);
    prepararJuego();
}

/**
 * Inicializa el juego
 */
function iniciar() {
    $("#cerrar").on("click", function () { $("#final").css("display", "none")} );
    $("#jugar").on("click",  reiniciar);
    $("toposRestantes").text(NUMEROTOPOS);

    prepararJuego();
}

iniciar();
