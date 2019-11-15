const express = require('express')
const router = express.Router()
const controller = require('./user.controller')

// controller binding
router.get('/', controller.getAllList)
router.get('/:id', controller.getList)
router.delete('/:id', controller.delUser)
router.post('/', controller.postUser)

module.exports = router