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
module.exports = {
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
     *       - name: mobileNumber
     *         description: mobileNumber
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
    signup: async (req, res, next) => {
        try {
            if (!req.body.mobileNumber) {
                return response(res, statusCode.data.BAD_REQUEST, {}, "Please provide mobile number.")
            }
            let userFind = await service.findUser({ mobileNumber: encryption.encrypt(req.body.mobileNumber), userType: userTypeEnum.data.USER, status: { $ne: statusEnum.data.DELETED } })
            if (userFind) {
                return response(res, statusCode.data.ALREADY_EXIST, {}, messages.ErrorMessage.ALREADY_EXIST)
            }
            let dataSaved = {
                mobileNumber: encryption.encrypt(req.body.mobileNumber),
                fullName: req.body.fullName,
                mobileOtp: commonFunction.getOTP(),
                mobOtpExpireTime: Date.now()
            }
            let save = await service.createUser(dataSaved)
            let result = {
                _id: save,
                mobileOtp: save.mobileOtp
            }
            let body = `Hello user,\nYour OTP for verification is ${save.mobileOtp}. It is only valid for 30 minutes. Do not share OTP with others for any purpose\nThanks and regards,\nTeam Finovac`
            let sendOtp = await commonFunction.sendSms2(req.body.mobileNumber, body)
            return response(res, statusCode.data.SUCCESS, result, messages.SuccessMessage.ACCOUNT_CREATION)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
     * @swagger
     * /api/v1/user/login:
     *   post:
     *     tags:
     *       - USER
     *     description: Check for Social existence and give the access Token 
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: mobileNumber
     *         description: mobileNumber
     *         in: formData
     *         required: true
     *     responses:
     *       200:
     *         description: Your login is successful
     *       404:
     *         description: Invalid credentials
     *       500:
     *         description: Internal Server Error
     */
    login: async (req, res, next) => {
        try {
            let userFind = await service.findUser({ mobileNumber: encryption.encrypt(req.body.mobileNumber), userType: userTypeEnum.data.USER, status: { $ne: statusEnum.data.DELETED } })
            if (!userFind) {
                return response(res, statusCode.data.NOT_FOUND, {}, messages.ErrorMessage.NOT_FOUND)
            }
            let otp = commonFunction.getOTP()
            let update = await service.updateUser({ _id: userFind._id }, { $set: { loginOtp: otp, loginExpireTime: Date.now() } })
            let data = {
                _id: update._id,
                otp: otp
            }
            let body = `Hello user,\nYour OTP for login is ${otp}. It is only valid for 30 minutes. Do not share OTP with others for login\nThanks and regards,\nTeam Finovac`
            // let sendOtp = await commonFunction.sendSms2(req.body.mobileNumber, body)
            // console.log("=====>", sendOtp)
            return response(res, statusCode.data.SUCCESS, data, messages.SuccessMessage.OTP_SEND)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
 * @swagger
 * /api/v1/user/myProfile:
 *   get:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: Your login is successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
    myProfile: async (req, res, next) => {
        try {
            let userFind = await service.findUser({ _id: req.userId, userType: userTypeEnum.data.USER })
            if (!userFind) {
                return response(res, statusCode.data.NOT_FOUND, {}, messages.ErrorMessage.NOT_FOUND)
            }
            let obj = {
                mobileNumber: encryption.decrypt(userFind.mobileNumber),
                fullName: userFind.fullName,
                _id: userFind._id,
                createdAt: userFind.createdAt,
                profilePic: userFind.profilePic == undefined ? "" : userFind.profilePic
            }
            return response(res, statusCode.data.SUCCESS, obj, messages.SuccessMessage.DATA_FOUND)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
* @swagger
* /api/v1/user/editProfile:
*   put:
*     tags:
*       - USER
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: header
*         required: true
*       - name: profilePic
*         description: profilePic
*         in: formData
*         required: false
*       - name: fullName
*         description: fullName
*         in: formData
*         required: false
*       - name: email
*         description: email
*         in: formData
*         required: false
*     responses:
*       200:
*         description: Your login is successful
*       404:
*         description: Invalid credentials
*       500:
*         description: Internal Server Error
*/
    editProfile: async (req, res, next) => {
        try {
            let userFind = await service.findUser({ _id: req.userId })
            if (!userFind) {
                return response(res, statusCode.data.NOT_FOUND, {}, messages.ErrorMessage.NOT_FOUND)
            }
            let obj = {
                profilePic: req.body.profilePic,
                fullName: req.body.fullName,
                email: encryption.encrypt(req.body.email)
            }
            let update = await service.updateUser({ _id: userFind._id }, { $set: obj })
            console.log("update", update)
            return response(res, statusCode.data.SUCCESS, obj, messages.SuccessMessage.UPDATE_SUCCESS)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
     * @swagger
     * /api/v1/user/uploadFile:
     *   post:
     *     tags:
     *       - UPLOAD-FILE
     *     description: uploadFile
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: uploaded_file
     *         description: uploaded_file
     *         in: formData
     *         type: file
     *         required: true
     *     responses:
     *       200:
     *         description: Upload successful.
     *       401:
     *         description: Invalid file format
     */
    uploadFile: async (req, res, next) => {
        try {
            const { files } = req;
            console.log("493", files)
            const imageFiles = await commonFunction.getImageUrl(files);
            return response(res, statusCode.data.SUCCESS, { mediaUrl: imageFiles.secure_url, mediaType: imageFiles.resource_type }, messages.SuccessMessage.DETAIL_GET);
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
* @swagger
* /api/v1/user/otpVerifyForPlatform:
*   post:
*     tags:
*       - USER
*     description: Check for Social existence and give the access Token 
*     produces:
*       - application/json
*     parameters:
*       - name: _id
*         description: _id
*         in: query
*         required: true
*       - name: otp
*         description: otp
*         in: formData
*         required: true
*     responses:
*       200:
*         description: Your login is successful
*       404:
*         description: Invalid credentials
*       500:
*         description: Internal Server Error
*/
    otpVerifyForPlatform: async (req, res, next) => {
        try {
            let userFind = await service.findUser({ _id: req.query._id })
            if (!userFind) {
                return response(res, statusCode.data.NOT_FOUND, {}, messages.ErrorMessage.NOT_FOUND)
            }
            if ((userFind.mobOtpExpireTime + 30 * 60 * 60 * 1000) < Date.now()) {
                return response(res, statusCode.data.FORBIDDEN, {}, messages.ErrorMessage.OTP_EXPIRED)
            }
            if (userFind.mobileOtp != req.body.otp) {
                return response(res, statusCode.data.FORBIDDEN, {}, "Incorrect otp.")
            }
            var token = jwt.sign({ _id: userFind._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'finovac', { expiresIn: '365d' });

            let obj = {
                _id: userFind._id,
                mobileOtpVerified: true,
                token: token
            }
            let update = await service.updateUser({ _id: userFind._id }, { $set: obj })
            console.log("update", update)
            return response(res, statusCode.data.SUCCESS, obj, "User created successfully.")

        } catch (error) {
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
 * @swagger
 * /api/v1/user/resendOtp:
 *   post:
 *     tags:
 *       - USER
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: mobileNumber
 *         description: mobileNumber
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Your login is successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
    resendOtp: async (req, res, next) => {
        try {
            console.log("resendOtp==========req.body========>", req.body)
            let userFind = await service.findUser({ mobileNumber: encryption.encrypt(req.body.mobileNumber), userType: userTypeEnum.data.USER, status: { $ne: statusEnum.data.DELETED } })
            if (!userFind) {
                return response(res, statusCode.data.NOT_FOUND, {}, messages.ErrorMessage.NOT_FOUND)
            }
            let obj = {
                mobileOtp: commonFunction.getOTP(),
                mobOtpExpireTime: Date.now()
            }
            let update = await service.updateUser({ _id: userFind._id }, { $set: obj })
            let data = {
                _id: update._id,
                otp: update.mobileOtp
            }
            return response(res, statusCode.data.SUCCESS, data, messages.SuccessMessage.OTP_SEND)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }

    },
    /**
     * @swagger
     * /api/v1/user/loginVerify:
     *   post:
     *     tags:
     *       - USER
     *     description: Check for Social existence and give the access Token 
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: _id
     *         description: _id
     *         in: query
     *         required: true
     *       - name: otp
     *         description: otp
     *         in: formData
     *         required: true
     *     responses:
     *       200:
     *         description: Your login is successful
     *       404:
     *         description: Invalid credentials
     *       500:
     *         description: Internal Server Error
     */

    loginVerify: async (req, res, next) => {
        try {
            let userFind = await service.findUser({ _id: req.query._id })
            if (!userFind) {
                return response(res, statusCode.data.NOT_FOUND, {}, messages.ErrorMessage.NOT_FOUND)
            }
            if ((userFind.loginExpireTime + 30 * 60 * 60 * 1000) < Date.now()) {
                return response(res, statusCode.data.FORBIDDEN, {}, messages.ErrorMessage.OTP_EXPIRED)
            }
            if (userFind.loginOtp != req.body.otp) {
                return response(res, statusCode.data.FORBIDDEN, {}, "Incorrect otp.")
            }
            var token = jwt.sign({ _id: userFind._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'finovac', { expiresIn: '365d' });

            let obj = {
                _id: userFind._id,
                mobileOtpVerified: true,
                token: token
            }
            return response(res, statusCode.data.SUCCESS, obj, messages.SuccessMessage.UPDATE_SUCCESS)
        } catch (error) {
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
 * @swagger
 * /api/v1/user/linkAccountToFinovac:
 *   get:
 *     tags:
 *       - USER
 *     summary: to get consent request parameter
 *     description: linkAccountToFinovac? to get consent request parameter 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         description: userId
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: Your login is successful
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
    linkAccountToFinovac: async (req, res, next) => {
        try {
            console.log("=============>", req.query)
            let userFind = await service.findUser({ _id: req.query.userId })
            if (!userFind) {
                return response(res, statusCode.data.NOT_FOUND, {}, messages.ErrorMessage.NOT_FOUND)
            }
            let apiResult = await axios({
                url: "https://finovac.fiu.finfactor.in/finsense/API/V1/User/Login",
                method: "post",
                data: {
                    "header": {
                        "rid": "42c06b9f-cc5b-4a53-9119-9ca9d8e9acdb",
                        "ts": new Date().toISOString(),
                        "channelId": "finsense"
                    },
                    "body": {
                        "userId": "channel@dhanaprayoga",
                        "password": "7777"
                    }
                }

            })
            let consentRaise = await axios({
                url: "https://finovac.fiu.finfactor.in/finsense/API/V1/ConsentRequestEncrypt",
                method: "post",
                headers: {
                    Authorization: `${apiResult.data.body.token}`
                },
                data: {
                    "header": {
                        "ts": new Date().toISOString(),
                        "channelId": "finsense",
                        "rid": "445e7f8c-22eb-4c09-b6d9-677ef59dbc29"
                    },
                    "body": {
                        "custId": `${encryption.decrypt(userFind.mobileNumber)}@finvu`,
                        "consentDescription": "Wealth Management Service",
                        "templateName": "FINVUDEMO_TESTING",
                        "userSessionId": "sessionid123"
                    }
                }
            })
            console.log("=======>", consentRaise.data)
            let update = await service.updateUser({ _id: userFind._id }, { $set: { consentRequest: consentRaise.data.body } })
            console.log("======update=====>", update)
            return response(res, statusCode.data.SUCCESS, consentRaise.data, messages.SuccessMessage.DATA_FOUND)

        } catch (error) {
            console.log("-====>", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
* @swagger
* /api/v1/user/deleteAccount:
*   delete:
*     tags:
*       - USER
*     summary: to delete a user account
*     description: deleteAccount? to delete a user account
*     produces:
*       - application/json
*     parameters:
*       - name: token
*         description: token
*         in: header
*         required: true
*     responses:
*       200:
*         description: Your account is deleted successful
*       404:
*         description: Invalid credentials
*       500:
*         description: Internal Server Error
*/
    deleteAccount: async (req, res, next) => {
        try {
            let userFind = await service.findUser({ _id: req.userId })
            if (!userFind) {
                return response(res, statusCode.data.NOT_FOUND, {}, messages.ErrorMessage.NOT_FOUND)
            }
            let update = await service.updateUser({ _id: userFind._id }, { $set: { status: statusEnum.data.DELETED } })
            console.log("update", update)
            let obj = {
                userId: userFind._id,
                deleted: true
            }
            return response(res, statusCode.data.SUCCESS, obj, messages.SuccessMessage.DELETE_SUCCESS)
        } catch (error) {
            console.log("-====>", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    }


}