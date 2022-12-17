const router = require('express').Router()


const sliders=require('./controllers/sliders/router')
const admin=require('./controllers/admin/router')
const static=require('./controllers/static/router')
const user =require('./controllers/user/router')

router.use('/slider',sliders)
router.use('/admin',admin)
router.use('/static',static)
router.use('/user',user)
module.exports=router
