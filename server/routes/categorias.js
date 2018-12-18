/**
 * 
 * 
 */

const express = require('express');

const _ = require('underscore'); //esta librería extiende funciones de javascript

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion.js');

let app = express();

//let Categoria = require('../midlewares/categoria');
let Categoria = require('../models/categoria');



// ============================
// Mostrar todas las categorías
// ============================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find()
        .sort('nombre') //ordenamos los campos a la hora de mostrarlos
        .populate('usuario', 'nombre email') //obtenemos los datos de usuario
        .exec((err, categorias) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error del servidor',
                    err
                });
            }

            console.log(categorias.length);

            if (categorias.length === 0) {
                return res.status(400).json({
                    ok: false,
                    message: 'No hay categorías',
                    err
                });
            }


            res.json({
                ok: true,
                categorias
            });

        });


});



// ============================
// Mostrar una categoría por ID
// ============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    //Categoria.findById(...);

    let id = req.params.id;

    console.log(id);

    Categoria.findById(id, (err, categoria) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                message: 'Error del servidor',
                err
            });
        }

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                message: 'La categoría no existe',
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });

    });



});


// ============================
// Crear nueva categoria
// ============================
app.post('/categoria', [verificaToken, verificaAdmin_Role], (req, res) => {
    // regresa la nueva categoria
    // req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        nombre: body.nombreCategoria.toLowerCase(),
        estado: true,
        usuario: req.usuario._id
    });

    //console.log(categoria);

    categoria.save((err, categoriaDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                message: 'No se ha podido crear la categoría',
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    })




});




// ============================
// Actualizar una categoría
// ============================
app.put('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //actualizar el nombre de la categoría

    let id = req.params.id;


    if (req.body.nombre) {

        req.body.nombre = req.body.nombre.toLowerCase();

        let body = _.pick(req.body, ['nombre']); //este es el arreglo de todas las opciones que si que quiero que se pueda acutalizar


        Categoria.findByIdAndUpdate(id, body, { new: true }, (err, categoriaDB) => {

            //con new: true  le estamos diciendo que nos devuelva el campo ya actualizado de la bd
            //con runValidators: true  Le estamos diciendo que ejecute las validaciones del schema, en este caso lo ulizamos para rolesValidos en models/usuarios.js

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se ha podido actualizar la categoría',
                    err
                });
            }

            res.json({
                ok: true,
                message: 'Categoría actualizada correctamente',
                categoria: categoriaDB
            });

        });

    } else {
        return res.status(400).json({
            ok: false,
            message: 'No se han enviado el nombre de la categoría para actualizar'
        })
    }

});



// ============================
// Borramos una categoría
// ============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    //solo un administrador puede borrar categorías
    //V Categoria.findByIdAndRemove+

    let id = req.params.id;

    console.log(id);

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {


        if (err) {
            return res.status(400).json({
                ok: false,
                message: 'no se ha podido borrar la categoría, es posible que no exista.',
                err
            })
        }

        if (!categoriaDB) {

            return res.json({
                ok: false,
                categoriaDB,
                error: "No existe la categoría seleccionada"
            });
        }

        res.json({
            ok: true,
            message: 'Se ha borrado correctamente la categoría',
            categoriaDB
        });


    });



});





module.exports = app;