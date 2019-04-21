const express = require('express')
let { verificaToken } = require('../middlewares/authentication')
let app = express()
let Producto = require('../models/producto')
const _ = require('underscore')

//Mostrar producto
app.get('/productos', (req, res) => {
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 5
    Producto.find({})
        .skip(desde)
        .limit(limite)
        .populate('user')
        .populate('category')
        .exec((err, productos) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    count: conteo,
                    productos
                })
            })
        })
})

app.post('/crearproducto', verificaToken, (req, res) => {
    let body = req.body;

    let producto = new Producto({
        usuario: req.user._id,
        categoria: body.categoria,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.dispoible
    })

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    })
})

app.put('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible'])
    Producto.findByIdAndUpdate(id, body, { new: true }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: productoDB
        })
    })
})

app.delete('/producto/:id', verificaToken, (req, res) => {
    let id = req.params.id
    let disponible = { disponible: false }
    Producto.findByIdAndUpdate(id, disponible, { new: true }, (err, productoDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else {
            if (!productoDeleted) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            } else {
                return res.status(200).json({
                    ok: true,
                    producto: productoDeleted
                })
            }
        }
    })
})

//Buscar producto
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino
    let regex = new RegExp(termino, 'i')

    Producto.find({ nombre: regex })
        .populate('category', 'name')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos: productosDB
            })
        })
})
module.exports = app;