const router = require('express').Router()

const {productController} = require('../controller/index')

router.get('/getProduct', productController.getAll)
router.get('/getProductbyId/:id', productController.getProd)

module.exports= router