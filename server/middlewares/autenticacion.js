//

const jwt = require('jsonwebtoken');

// ================================
// Verifica Token
// ================================

let verificaToken = (req, res, next) => {

    let token = req.get('token'); //recibimos el toquen en el head de la consulta get

    //console.log(token);

    jwt.verify(token, process.env.seedToken, (err, decoded) => { //esta funcion verifica si coinciden tanto el token enviado por el usuario como el token generado por nosotros

        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        //console.log(token);

        req.usuario = decoded.usuario;
        next(); // si no llamamos a la funcion next, este middleweare no permitira que siga ejecutádose el código desde el método de consulta (get, post...) utilizado.


    });

};



// ================================
// Verifica AdminRole
// ================================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });

    }




}






module.exports = {
    verificaToken,
    verificaAdmin_Role
}