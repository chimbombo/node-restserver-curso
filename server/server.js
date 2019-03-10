require('./config/config')

const express = require('express')
const app = express()
const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', function(req, res) {
    res.send('Hello World')
})

app.post('/usuario', function(req, res) {
    let body = req.body;

    if (body.name === undefined) {
        res.status(400).json({
            ok: false,
            message: 'El nombre es requerido'
        })
    } else {
        res.json({
            persona: body
        })
    }
})

app.listen(process.env.PORT, () => {
    console.log('escuchando en el puerto: ', process.env.PORT);
})