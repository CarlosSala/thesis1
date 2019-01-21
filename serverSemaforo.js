// Carga de módulos necesarios
var http = require('http');
var fs = require('fs');
var path = require('path');
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

/* Programación del servidor web
 Inicializar el servidor en el puerto 8888 */
var server = http.createServer(function(req, res) {
    // Solicitud de archivos
    var file = '.' + ((req.url == '/') ? '/index.html' : req.url);
    var fileExtension = path.extname(file);
    var contentType = 'text/html';
    if (fileExtension == '.css') {
        contentType = 'text/css';
    }
    fs.exists(file, function(exists) {
        if (exists) {
            fs.readFile(file, function(error, content) {
                if (!error) {
                    res.writeHead(200, {
                        'content-type': contentType
                    });
                    res.end(content);
                }
            });
        } else {
            // Página no encontrada
            res.writeHead(404);
            res.end('Page not found');
        }
    });
}).listen(8888);

//Carga del módulo socket io
var io = require('socket.io').listen(server);
var s;

// Establecimiento de comunicación
io.on('connection', function(socket) {

    s = socket;

    setInterval(actualizarLuces, 500);
    setInterval(actualizarPulsadores, 500);
    setInterval(variableContador, 500);
    socket.on('pulsadorWeb1', pw1);
    socket.on('pulsadorWeb2', pw2);
    socket.on('opcionesTiempos', tiempoLuces);
});

/* Función para leer los estados de los pines 
de salida (luces) y emitirlos a la página web */
function actualizarLuces() {

    var V1 = b.readTextFile(fileV1);
    s.emit('green1', V1);
    var R1 = b.readTextFile(fileR1);
    s.emit('red1', R1);
    var V2 = b.readTextFile(fileV2);
    s.emit('green2', V2);
    var A2 = b.readTextFile(fileA2);
    s.emit('yellow2', A2);
    var R2 = b.readTextFile(fileR2);
    s.emit('red2', R2);
}

/* Función para leer los estados de los pines
de entrada (pulsadores) y emitirlos a la página web */
function actualizarPulsadores() {

    var P1 = b.readTextFile(fileP1);
    s.emit('lecturaPulsador1', P1);
    var P2 = b.readTextFile(fileP2);
    s.emit("lecturaPulsador2", P2);
}

/* Función para leer el valor de la variable 
"contador" y emitirlo a la página web*/
function variableContador() {

    var C = b.readTextFile(fileC);
    s.emit('vContador', C);
}

/* Función que recibe y guarda el "1" enviado por 
el pulsador web 1 desde la página web */
function pw1(data) {
    var PW1 = JSON.parse(data);
    b.writeTextFile(filePW1, PW1);
}

/* Función que recibe y guarda el "1" enviado por 
el pulsador web 2 desde la página web */
function pw2(data) {
    var PW2 = JSON.parse(data);
    b.writeTextFile(filePW2, PW2);
}

/* Función que recibe y guarda la opción de tiempo
seleccionada desde página web para el semáforo */
function tiempoLuces(data) {
    var tiempos = JSON.parse(data);
    b.writeTextFile(fileT, tiempos);
}

// visualización de un mensaje en la consola
server.listen(console.log("Server Running ..."));