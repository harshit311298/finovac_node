const router = require('express').Router()


const sliders=require('./controllers/sliders/router')
const admin=require('./controllers/admin/router')
const static=require('./controllers/static/router')

router.use('/slider',sliders)
router.use('/admin',admin)
router.use('/static',static)
module.exports=router
