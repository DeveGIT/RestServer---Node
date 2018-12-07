/**
 * 
 * 
 * 
 */


require('../config/config');

const express = require('express');

const bcrypt = require('bcrypt');
//jwt.io -generación de Tokens
const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();



app.post('/login', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "(Usuario) o contraseña incorrectos"
                }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario o (contraseña) incorrectos"
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, seedToken, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });


    });


});



module.exports = app;