const express = require('express')
const app = express()


const sliders=require('./controllers/sliders/router')
const admin=require('./controllers/admin/router')

app.use('/api/v1/slider',sliders)
app.use('/api/v1/admin',admin)
module.exports=app