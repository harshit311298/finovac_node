const router = require('express').Router()

const auth = require('../../middleWare/auth');
// const { verifyToken } =require('../middleWare/auth')
const controller = require('./controller');
module.exports = router
.post('/listSliders',controller.listSliders)
.get('/viewSlider',controller.viewSlider)

.use(auth.verifyToken)
.post('/addSliders',controller.addSliders)
.put('/editSlider',controller.editSlider)
.delete('/deleteSlider',controller.deleteSlider)
