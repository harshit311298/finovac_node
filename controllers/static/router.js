const router = require('express').Router()

const auth = require('../../middleWare/auth');
// const { verifyToken } =require('../middleWare/auth')
const controller = require('./controller');
module.exports = router
.post('/listStaticContent',controller.listStaticContent)
.get('/viewStatic',controller.viewStatic)

.use(auth.verifyToken)
.post('/addStatic',controller.addStatic)
.put('/editStatic',controller.editStatic)
.delete('/deleteStatic',controller.deleteStatic)
