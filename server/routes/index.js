const express = require('express')
const app = express()

app.use(require('./user'))
app.use(require('./login'))
app.use(require('./category'))
app.use(require('./producto'))
app.use(require('./upload'))
app.use(require('./image'))

module.exports = app;