const router = require('express').Router()

const {verifyToke}= require('../helpers/jwt')

const {cartController} = require('../controller/index')

router.post('/buy', cartController.addCart)
router.post('/checkout', cartController.checkoutCart)
router.post('/cancelpayment', cartController.cancelPayment)
router.post('/successpayment', cartController.successPayment)
router.post('/cartPage', cartController.cart)
router.post('/editProduct', cartController.editCart)
router.post('/deleteproduct', cartController.deleteProduct)
router.post('/waitForPayment',verifyToke, cartController.waitingPayment)


module.exports = router