const express = require('express')
const fs = require('fs')
const path = require('path')
let app = express()
const { verificaTokenImg } = require('../middlewares/authentication')

app.get('/image/:type/:img', verificaTokenImg, (req, res) => {
    let type = req.params.type
    let img = req.params.img

    let pathImagen = path.resolve(__dirname, `../../uploads/${type}/${img}`)

    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen)
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg')
        res.sendFile(noImagePath)
    }
})

module.exports = app