const express = require('express')
let { verificaToken } = require('../middlewares/authentication')
let app = express()
let Category = require('../models/category')

//Mostrar todas las categorias
app.get('/category', verificaToken, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Category.count({}, (err, conteo) => {

                res.json({
                    ok: true,
                    count: conteo,
                    categories
                })
            })
        })
})

//Mostrar una categoria por ID
app.get('/category/:id', verificaToken, (req, res) => {
    let id = req.params.id
    Category.findById(id, (err, category) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!category) {
            return res.status(404).json({
                ok: true,
                message: 'Usuario no existe'
            })
        } else {
            res.json({
                ok: true,
                category: category.description
            })
        }
    })
})

//Crear nueva categoria
app.post('/newcategory', verificaToken, (req, res) => {
    let body = req.body;
    let user = req.user._id

    let category = new Category({
        description: body.description,
        user: user
    })

    category.save((err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            category: categoryDB
        })
    })
})

app.put('/category/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let desc = { description: req.body.description }
    Category.findByIdAndUpdate(id, desc, { new: true }, (err, categoryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: categoryDB
        })
    })
})

app.delete('/category/:id', verificaToken, (req, res) => {
    let id = req.params.id

    Category.findByIdAndDelete(id, (err, categoryDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else {
            if (!categoryDeleted) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Categoria no encontrada'
                    }
                })
            } else {
                return res.status(200).json({
                    ok: true,
                    user: categoryDeleted
                })
            }
        }
    })
})

module.exports = app