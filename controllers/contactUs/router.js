const router = require('express').Router()

const auth = require('../../middleWare/auth');
// const { verifyToken } =require('../middleWare/auth')
const controller = require('./controller');

module.exports = router
.post('/contactUs',controller.contactUs)
