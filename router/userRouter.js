const router = require('express').Router()

const {userController} = require('../controller')
const {verifyToke} = require('../helpers/jwt')

const {upload}= require('../helpers/multer')
const uploader = upload()

router.post('/login', userController.login)
router.post('/keeplogin', verifyToke, userController.keeplogin)
router.post('/upload/:iduser', uploader,userController.uploadPhoto)

module.exports = router