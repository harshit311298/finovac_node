const router = require('express').Router()


const sliders=require('./controllers/sliders/router')
const admin=require('./controllers/admin/router')

router.use('/slider',sliders)
router.use('/admin',admin)
module.exports=router