const express = require('express')
const logger = require('morgan')
const app = express()

const mw1 = (req, res, next) => {
    console.log('middleware1...')
    next()
}

const mw2 = (req, res, next) => {
    //throw Error('error!!')
    next()
}

const errMw = (err, req, res, next) => {
    console.log(err.message)
}

const users = [
    {name: 'aaa'},
    {name: 'bbb'}
]

app.use(logger('dev'))
app.use(mw2)
app.use(errMw)

app.get('/', (req, res) => res.send('Hello Express!!'))

app.get('/users', (req, res) => res.json(users))

app.listen(3000, () => console.log('running...'))