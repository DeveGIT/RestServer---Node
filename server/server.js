/**
 * 
 * 
 */

require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path'); //es un paquete que trae node, no hace falta instalar

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());


// habilitar la carpeta public
//app.use(express.static(__dirname + '../public')); // esta ruta esta mal puesta, daría esto: "/home/myequip/Documentos/UDEMY/NODEJS/01-hola-mundo/07-restserver/server../public"
//console.log(__dirname + '../public'); // para arreglar ese error hay que usar path, no require de instalación
app.use(express.static(path.resolve(__dirname, '../public'))); //Crea correctamente al dirección
//console.log(path.resolve(__dirname, '../public'));



//Configuración global de rutas
app.use(require('./routes/index'));



mongoose.connect(process.env.URLDB, {
    useCreateIndex: true,
    useNewUrlParser: true
}, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE');

});


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});