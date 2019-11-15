const express = require('express')
const router = express.Router()

let users = [
    {id: 1, name: 'aaa'},
    {id: 2, name: 'bbb'},
    {id: 3, name: 'ccc'}
]

/////////////////////////////////////////////////////////
router.get('/', (req, res) => {
    req.query.limit = req.query.limit || 10
    const limit = parseInt(req.query.limit, 10)

    if(Number.isNaN(limit)) {
        res.status(400).end()

    } else {
        res.json(users.slice(0, limit))
    }    
})
/////////////////////////////////////////////////////////
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10)
    const user = users.filter(user => user.id === id)[0]

    if(Number.isNaN(id)) {
        return res.status(400).end()
    }

    if(!user) {
        return res.status(404).end()
    }
    
    res.json(user)
})
/////////////////////////////////////////////////////////
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id, 10)
    const user = users.filter(user => user.id === id)[0]
    users = users.filter(user => user.id !== id)

    if(Number.isNaN(id)) {
        return res.status(400).end()
    }
    if(!user) {
        return res.status(404).end()
    }
    res.status(204).end()
})
/////////////////////////////////////////////////////////
router.post('/', (req, res) => {
    const name = req.body.name

    if(!name) {
        return res.status(400).end()
    }
    const found = users.filter(user => user.name === name).length
    if(found) {
        return res.status(409).end()
    }
    const id = Date.now()
    const user = {id, name}
    users.push(user)
    res.status(201).json(user)
})

module.exports = router