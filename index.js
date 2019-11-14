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
    {id: 1, name: 'aaa'},
    {id: 2, name: 'bbb'},
    {id: 3, name: 'ccc'}
]

app.use(logger('dev'))
app.use(mw2)
app.use(errMw)

app.get('/', (req, res) => res.send('Hello Express!!'))

app.get('/users', (req, res) => {
    req.query.limit = req.query.limit || 10
    const limit = parseInt(req.query.limit, 10)

    if(Number.isNaN(limit)) {
        res.status(400).end()
        
    } else {
        res.json(users.slice(0, limit))
    }    
})

module.exports = app