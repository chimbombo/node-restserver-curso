const express = require('express')
const app = express()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const _ = require('underscore')
const { verificaToken } = require('../middlewares/authentication')
const { verificaAdmin } = require('../middlewares/authentication')


app.get('/', function(req, res) {
    res.send('Hello World rest server')
})

app.get('/users', verificaToken, (req, res) => {
    let desde = Number(req.query.desde) || 0
    let limite = Number(req.query.limite) || 5
    User.find({ status: true }).skip(desde).limit(limite).exec((err, users) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        User.count({ status: true }, (err, conteo) => {

            res.json({
                ok: true,
                count: conteo,
                users
            })
        })
    })
})

app.delete('/user/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id

    // User.findByIdAndDelete(id, (err, userDeleted) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         })
    //     } else {
    //         if (!userDeleted) {
    //             return res.status(400).json({
    //                 ok: false,
    //                 err: {
    //                     message: 'Usuario no encontrado'
    //                 }
    //             })
    //         } else {
    //             return res.status(200).json({
    //                 ok: true,
    //                 user: userDeleted
    //             })
    //         }
    //     }
    // })
    let status = { status: false }
    User.findByIdAndUpdate(id, status, { new: true }, (err, userDeleted) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        } else {
            if (!userDeleted) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Usuario no encontrado'
                    }
                })
            } else {
                return res.status(200).json({
                    ok: true,
                    user: userDeleted
                })
            }
        }
    })
})

app.post('/user', [verificaToken, verificaAdmin], function(req, res) {
    let body = req.body;

    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    })

    user.save((err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
})

app.put('/user/:id', [verificaToken, verificaAdmin], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'status'])

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            user: userDB
        })
    })
})

module.exports = app;