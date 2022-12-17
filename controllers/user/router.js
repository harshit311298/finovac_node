const router = require('express').Router()
const auth = require('../../middleWare/auth');
var multer = require("multer");
var upload = multer({ dest: "uploads/" });

// const { verifyToken } =require('../middleWare/auth')
const controller = require('./controller');
module.exports = router
.post('/uploadFile',upload.array('uploaded_file', 12),controller.uploadFile)
.post('/signup',controller.signup)
.post('/login',controller.login)
.post('/loginVerify',controller.loginVerify)
.post('/resendOtp',controller.resendOtp)
.post('/otpVerifyForPlatform',controller.otpVerifyForPlatform)
.use(auth.verifyToken)
.get('/myProfile',controller.myProfile)
.put('/editProfile',controller.editProfile)