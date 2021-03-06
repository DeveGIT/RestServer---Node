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
// Vencimiento del Token
// =================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
//process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30; //Se me caduca ensegidan esto no son 3 días
process.env.CADUCIDAD_TOKEN = '30 days'; // 48h en horas también sería posible




// =================================
// SEED de autenticación
// =================================
process.env.seedToken = process.env.seedToken || 'este-es-el-sed-desarrolo';



// =================================
// Base de Datos
// =================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI_MLAB; //Hemos creado una variable de entorno en el servidor con la ruta a la bd de MLAB.
}

process.env.URLDB = urlDB;



// =================================
// Google Client ID
// =================================

process.env.CLIENT_ID = process.env.CLIENT_ID || '213510736061-lfo92gmon4775qhquo1hueooclpujeus.apps.googleusercontent.com';