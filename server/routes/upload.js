const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user')
const fs = require('fs')
const path = require('path')
let Producto = require('../models/producto')

// default options
app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', (req, res) => {
    let tipo = req.params.tipo
    let id = req.params.id

    if (!req.files)
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado un archivo'
            }
        });

    //valida tipo
    let tiposValidos = ['productos', 'users']
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son: ' + tiposValidos.join(', ')
            }
        })
    }

    let file = req.files.file;
    let nombreCortado = file.name.split('.')
    let extension = nombreCortado[nombreCortado.length - 1]

    //extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son: ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    //Cambiar nombre al archivo
    let filename = `${ id}-${ new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
    file.mv(`uploads/${ tipo }/${ filename }`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if (tipo === 'users') {
            UserImage(id, res, filename)
        } else {
            productImage(id, res, filename)
        }

    });
})

function UserImage(id, res, filename) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(userDB.img, 'users')

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!userDB) {
            deleteFile(userDB.img, 'users')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'usuario no existe'
                }
            })
        }

        deleteFile(userDB.img, 'users')

        userDB.img = filename

        userDB.save((err, savedUser) => {
            res.json({
                ok: true,
                user: savedUser,
                image: filename
            })
        })
    })
}

function productImage(id, res, fileName) {
    Producto.findById(id, (err, productDB) => {
        if (err) {
            deleteFile(productDB.img, 'productos')

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productDB) {
            deleteFile(productDB.img, 'productos')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            })
        }

        deleteFile(productDB.img, 'productos')

        productDB.img = fileName

        productDB.save((err, savedProduct) => {
            res.json({
                ok: true,
                product: savedProduct,
                image: fileName
            })
        })
    })
}

function deleteFile(imageName, type) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${type}/${imageName}`)
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen)
    }
}

module.exports = app;