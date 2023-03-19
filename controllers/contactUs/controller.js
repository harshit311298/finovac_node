const { commonResponse: response } = require('../../utility/commonResponseHandler');
const statusCode = require('../../utility/statusCode');
const messages = require('../../utility/message')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const service = require('./service')
let userTypeEnum = require('../../enums/userTypes')
let statusEnum = require('../../enums/status')
let commonFunction = require('../../utility/commonFunction')
let mailFunctions = require('../../utility/MailFunction/nodemailer')
const axios = require('axios')
let encryption = require('../../utility/crypto')

module.exports={
        /**
     * @swagger
     * /api/v1/user/signup:
     *   post:
     *     tags:
     *       - USER
     *     description: Check for Social existence and give the access Token 
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: fullName
     *         description: fullName
     *         in: formData
     *         required: true
     *       - name: phoneNo
     *         description: phoneNo
     *         in: formData
     *         required: true
     *       - name: email
     *         description: email
     *         in: formData
     *         required: true
     *       - name: query
     *         description: query
     *         in: formData
     *         required: true
     *     responses:
     *       200:
     *         description: Your signup is successful
     *       404:
     *         description: Invalid credentials
     *       500:
     *         description: Internal Server Error
     */
    contactUs:async(req,res,next)=>{
        try {
            let saveData=await service.addData(req.body)
            return response(res, statusCode.data.SUCCESS, saveData, messages.SuccessMessage.OTP_SEND)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)

        }
    }
}