/**
 * 
 * 
 */

const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore'); //esta librería extendie funciones de javascript

const Usuario = require('../models/usuario');

const app = express();



app.get('/usuario', function(req, res) {


    let desde = req.query.desde || 0;
    desde = Number(desde); //lo que recuperamos de la url lo convertimos en un número

    let limite = req.query.limite || 5;
    limite = Number(limite);

    let getUsuarioActivo = {
        estado: true
    }

    Usuario.find(getUsuarioActivo, 'nombre email role estado google img')
        .skip(desde) //empieza desde el número de registro que se ponga
        .limit(limite) //cogerá el número de registros que se indiquen, si no hay skip empieza desde el primero
        .exec((err, usuarios) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments(getUsuarioActivo, (err, conteo) => {

                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            });

        });


});

app.post('/usuario', function(req, res) {

    let body = req.body;

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(body.password, salt);
    console.log(hash);

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: hash, // bcrypt.hassySync() encripta directamente de forma sincrona sin devolver una promesa
        role: body.role
    }); //Esto crea una nueva instancia del modelo Usuario


    usuario.save((err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuarioDB.password = null

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })



});

app.put('/usuario/:id', function(req, res) {

    let id = req.params.id;

    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']); //este es el arreglo de todas las opciones que si que quiero que se pueda acutalizar

    // Para evitar que quien llame a este método modifique estos campos, aunque es una forma ineficiente si tenemos muchos campos
    // delete body.password;
    // delete body.google;


    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        //con new: true  le estamos diciendo que nos devuelva el campo ya actualizado de la bd
        //con runValidators: true  Le estamos diciendo que ejecute las validaciones del schema, en este caso lo ulizamos para rolesValidos en models/usuarios.js

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });


});

app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    //console.log(id);


    //let body = _.pick(req.body, ['estado']); //este es el arreglo de todas las opciones que si que quiero que se pueda acutalizar

    // Para evitar que quien llame a este método modifique estos campos, aunque es una forma ineficiente si tenemos muchos campos
    // delete body.password;
    // delete body.google;

    let cambiarEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true }, (err, usuarioDB) => {

        //con new: true  le estamos diciendo que nos devuelva el campo ya actualizado de la bd
        //con runValidators: true  Le estamos diciendo que ejecute las validaciones del schema, en este caso lo ulizamos para rolesValidos en models/usuarios.js

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });



    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {

    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     }

    //     if (!usuarioBorrado) {
    //         return res.status(400).json({
    //             ok: false,
    //             err: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     })

    // });


});

module.exports = app;