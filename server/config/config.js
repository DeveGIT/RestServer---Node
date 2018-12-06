/**
 * 
 *  Puerto
 */

process.env.PORT = process.env.PORT || 3000;
//process.env.urlDB = process.env.urlDB || 'mongodb://localhost:27017/cafe';



// =================================
// Entorno
// =================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


// =================================
// Base de Datos
// =================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI_MLAB; //Hemos creado una variable de entorno en el servidor con la ruta a la bd de MLAB
}

process.env.URLDB = urlDB;