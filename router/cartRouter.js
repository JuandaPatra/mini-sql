const router = require('express').Router()

const {verifyToke}= require('../helpers/jwt')

const {cartController} = require('../controller/index')

//add to Cart 
router.post('/buy', cartController.addCart)

//checkout Cart (Buy Product)
router.post('/checkout', verifyToke, cartController.checkoutCart)

//cancel waiting payment Product
router.post('/cancelpayment',verifyToke, cartController.cancelPayment)

//get cart
router.post('/cartPage',verifyToke, cartController.cart)

//checkout Cart to waiting for payment
router.post('/cartToPayment',verifyToke, cartController.checkoutToPayment)

//edit Quantity at Cart Page
router.post('/editProduct',verifyToke, cartController.editCart)

//delete Product at Cart Page
router.post('/deleteproduct', verifyToke, cartController.deleteProduct)

//get Waiting for payment item page
router.post('/waitForPayment', verifyToke, cartController.waitingPayment)


module.exports = router