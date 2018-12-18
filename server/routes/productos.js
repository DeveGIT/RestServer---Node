/**
 * 
 * 
 */

const express = require('express');

const _ = require('underscore'); //esta librería extiende funciones de javascript

let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion.js');

let app = express();

let Categoria = require('../models/categoria');

let Producto = require('../models/productos');




// // =======================================
// //  Obtener todos los productos
// // =======================================
app.get('/productos', (req, res) => {
    // trae todos los productos
    // populate: usuario categoria
    // paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'error del servidor',
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });


        })


});


// // =======================================
// //  Obtener un producto por ID
// // =======================================
app.get('/productos/:id', (req, res) => {
    // populate: usuario categoria

    let id = req.params.id;

    console.log(id);

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'nombre')
        .exec((err, productoBD) => {


            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'error del servidor',
                    err
                });
            }

            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    message: 'No se ha encontrado el producto',
                    productoBD
                });
            }

            res.json({
                ok: true,
                productoBD
            });

        });




});


// =======================================
//  Buscar Productos
// =======================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i'); // el i es para que sea insensible a las mayúsculas y minúsculas


    Producto.find({ nombre: regex, disponible: true })
        .populate('categoria', 'nombre')
        .populate('usuario', 'nombre email')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    message: 'error del servidor',
                    err
                });
            }

            if (!productos) {
                return res.status(400).json({
                    ok: false,
                    message: 'No hay productos con el término de búsqueda utilizado.',
                    err
                });
            }

            res.json({
                ok: true,
                productos,
                message: 'Productos que coinciden con el término de búsqueda introducido'
            });


        });

});


// =======================================
//  Crear un nuevo producto
// =======================================
app.post('/productos', verificaToken, (req, res) => {
    // grabar el usuario
    // grabar una categoría del listado

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: body.usuario
    });

    producto.save((err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({ //201 se utiliza cuando se crea un nuevo registro
            ok: true,
            producto: productoBD
        });

    });


});


// // =======================================
// //  Acualizar producto
// // =======================================
app.put('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // grabar el usuario
    // grabar una categoría del listado

    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoBD) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El ID no existe'
                }
            });
        }

        productoBD.nombre = body.nombre;
        productoBD.precioUni = body.precioUni;
        productoBD.categoria = body.categoria;
        productoBD.disponible = body.disponible;
        productoBD.descripcion = body.descripcion;

        productoBD.save((err, productoGuardado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoGuardado
            });

        });


    });



});


// // =======================================
// //  Borrar un producto
// // =======================================
app.delete('/productos/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    // poner en false el producto

    let id = req.params.id;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        productoDB.disponible = false;

        productoDB.save((err, productoBorrado) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productoBorrado,
                message: 'Producto Borrado'
            })

        });

    });

});



module.exports = app;