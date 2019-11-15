const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const app = express()
const user = require('./api/user')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use(logger('dev'))

app.use('/users', user)

module.exports = app