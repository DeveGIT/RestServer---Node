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
    urlDB = 'mongodb://cafe-user:a123456@ds127704.mlab.com:27704/cafe';
}

process.env.URLDB = urlDB;