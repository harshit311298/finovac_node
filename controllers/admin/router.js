const router = require('express').Router()
const auth = require('../../middleWare/auth');
const controller = require('./controller');
module.exports = router
.post('/login',controller.login)
.post('/forgotPassword',controller.forgotPassword)

.use(auth.verifyToken)

