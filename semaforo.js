// Carga del módulo necesario
var b = require('bonescript');

// creación de rutas de archivos
var fileV1 = "/var/lib/cloud9/Proyecto_semaforo/archivos/verde1";
var fileR1 = "/var/lib/cloud9/Proyecto_semaforo/archivos/rojo1";
var fileV2 = "/var/lib/cloud9/Proyecto_semaforo/archivos/verde2";
var fileA2 = "/var/lib/cloud9/Proyecto_semaforo/archivos/amarillo2";
var fileR2 = "/var/lib/cloud9/Proyecto_semaforo/archivos/rojo2";
var fileP1 = "/var/lib/cloud9/Proyecto_semaforo/archivos/pulsador1";
var fileP2 = "/var/lib/cloud9/Proyecto_semaforo/archivos/pulsador2";
var fileC = "/var/lib/cloud9/Proyecto_semaforo/archivos/contador";
var filePW1 = "/var/lib/cloud9/Proyecto_semaforo/archivos/pulsadorWeb1";
var filePW2 = "/var/lib/cloud9/Proyecto_semaforo/archivos/pulsadorWeb2";
var fileT = "/var/lib/cloud9/Proyecto_semaforo/archivos/tiempos";

// Programación del semáforo - creación de variables
var verde1 = 'P9_11';
var indicadorLed = 'P9_12';
var rojo1 = 'P9_13';
var verde2 = 'P9_15';
var amarillo2 = 'P9_17';
var rojo2 = 'P9_23';
var pulsador1 = 'P9_41';
var pulsador2 = 'P9_42';
var estado = 0;
var tiempov1 = 20;
var tiempov2 = 20;
var tiempoa2 = 4;
var contador = tiempov2;
var tiempoint = 1000;
var stpulsador = 0;
var presiona1 = b.LOW;
var presiona2 = b.LOW;
var presionaWeb1 = 0;
var presionaWeb2 = 0;
var reset = 0;

// Definición de los pines como salida y entrada respectivamente
b.pinMode(verde1, b.OUTPUT);
b.pinMode(indicadorLed, b.OUTPUT);
b.pinMode(rojo1, b.OUTPUT);
b.pinMode(verde2, b.OUTPUT);
b.pinMode(amarillo2, b.OUTPUT);
b.pinMode(rojo2, b.OUTPUT);
b.pinMode(pulsador1, b.INPUT);
b.pinMode(pulsador2, b.INPUT);

// Definición del estado inicial de los pines de salida
b.digitalWrite(verde1, b.LOW);
b.digitalWrite(indicadorLed, b.LOW);
b.digitalWrite(rojo1, b.HIGH);
b.digitalWrite(verde2, b.HIGH);
b.digitalWrite(amarillo2, b.LOW);
b.digitalWrite(rojo2, b.LOW);

// Actualizar la función principal
setInterval(actualizarEstado, tiempoint);

// Función principal del semáforo
function actualizarEstado() {
    switch (estado) {
        case 0:
            contador--;
            if (contador == 0) {
                estado = 1;
                b.digitalWrite(verde1, b.LOW);
                b.digitalWrite(rojo1, b.HIGH);
                b.digitalWrite(verde2, b.LOW);
                b.digitalWrite(amarillo2, b.HIGH);
                b.digitalWrite(rojo2, b.LOW);
                contador = tiempoa2;
                stpulsador = 0;
                presiona1 = b.LOW;
                presiona2 = b.LOW;
                b.writeTextFile(filePW1, reset);
                b.writeTextFile(filePW2, reset);
                b.digitalWrite(indicadorLed, b.LOW);
            } else {

                // Lectura de estado del pulsador 1
                presiona1 = b.digitalRead(pulsador1);
                // Guardar estado de pulsador 1 en archivo
                b.writeTextFile(fileP1, presiona1);
                //console.log("pulsador1:", presiona1);

                // Lectura de estado del pulsador 2
                presiona2 = b.digitalRead(pulsador2);
                // Guardar estado de pulsador 2 en archivo            
                b.writeTextFile(fileP2, presiona2);
                //console.log("pulsador2:", presiona2);

                // Lectura de estado del pulsadorWeb 1
                presionaWeb1 = b.readTextFile(filePW1);
                //console.log("pulsadorWeb1:", presionaWeb1);

                // Lectura de estado del pulsadorWeb 2
                presionaWeb2 = b.readTextFile(filePW2);
                //console.log("pulsadorWeb2:", presionaWeb2);

                // Acortar tiempo de espera de peatones
                if (stpulsador == 0 && (presiona1 == 1 || presiona2 == 1 || presionaWeb1 == 1 || presionaWeb2 == 1)) {
                    contador = Math.round(contador / 2);
                    stpulsador = 1;
                    b.digitalWrite(indicadorLed, b.HIGH);
                    b.writeTextFile(filePW1, reset);
                    b.writeTextFile(filePW2, reset);
                    console.log("Tiempo de espera reducido a la mitad");
                }
            }
            break;

        case 1:
            contador--;
            if (contador == 0) {
                estado = 2;
                b.digitalWrite(verde1, b.HIGH);
                b.digitalWrite(rojo1, b.LOW);
                b.digitalWrite(verde2, b.LOW);
                b.digitalWrite(amarillo2, b.LOW);
                b.digitalWrite(rojo2, b.HIGH);
                contador = tiempov1;
            }
            break;
            
        case 2:
            contador--;
            if (contador == 0) {
                estado = 0;
                b.digitalWrite(verde1, b.LOW);
                b.digitalWrite(rojo1, b.HIGH);
                b.digitalWrite(verde2, b.HIGH);
                b.digitalWrite(amarillo2, b.LOW);
                b.digitalWrite(rojo2, b.LOW);
                contador = tiempov2;
            } else if (contador % 2 == 0 && contador <= 10) {
                b.digitalWrite(verde1, b.LOW);
            } else if (contador % 2 == 1 && contador <= 9) {
                b.digitalWrite(verde1, b.HIGH);
            }
            break;

    }
}

/* Monitoreo del trabajo del semáforo
Actualizar funciones cada 1 segundo */
setInterval(luces, 500);
setInterval(contadorT, 500);
setInterval(ajusteTiempos, 500);

// Función para leer y guardar el estado de las luces en archivos
function luces() {

    var v1 = b.digitalRead(verde1);
    b.writeTextFile(fileV1, v1);

    var r1 = b.digitalRead(rojo1);
    b.writeTextFile(fileR1, r1);

    var v2 = b.digitalRead(verde2);
    b.writeTextFile(fileV2, v2);

    var a2 = b.digitalRead(amarillo2);
    b.writeTextFile(fileA2, a2);

    var r2 = b.digitalRead(rojo2);
    b.writeTextFile(fileR2, r2);
}

// Función para guardar en archivo el valor de la variable "contador"
function contadorT() {

    b.writeTextFile(fileC, contador);
}

// Función para leer archivo que modifica los tiempos del semáforo
function ajusteTiempos(data) {

    var datos = b.readTextFile(fileT);

    if (datos == 1) {
        tiempov1 = 20;
        tiempov2 = 20;
        tiempoa2 = 4;
    } else if (datos == 2) {
        tiempov1 = 20;
        tiempov2 = 40;
        tiempoa2 = 4;
    } else if (datos == 3) {
        tiempov1 = 40;
        tiempov2 = 20;
        tiempoa2 = 4;
    }
}
 
console.log("Semáforo en marcha...");