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
            return response(res, statusCode.data.SUCCESS, data, messages.SuccessMessage.OTP_SEND)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
 * @swagger
 * /api/v1/user/myProfile:
 *   post:
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
*   post:
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
                fullName: req.body.fullName
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
            return response(res, { mediaUrl: imageFiles.secure_url, mediaType: imageFiles.resource_type }, responseMessage.UPLOAD_SUCCESS);
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
    otpVerifyForPlatform:async(req,res,next)=>{
        try {
            let userFind = await service.findUser({ _id: req.query._id })
            if (!userFind) {
                return response(res, statusCode.data.NOT_FOUND, {}, messages.ErrorMessage.NOT_FOUND)
            }
            if ((userFind.mobOtpExpireTime+30*60*60*1000)<Date.now()) {
                return response(res, statusCode.data.FORBIDDEN, {},messages.ErrorMessage.OTP_EXPIRED)
            }
            if (userFind.mobileOtp==req.body.otp) {
                return response(res, statusCode.data.FORBIDDEN, {},"Incorrect otp.")
            }
            var token = jwt.sign({ _id: userFind._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'finovac', { expiresIn: '365d' });

            let obj = {
                _id:userFind._id,
                mobileOtpVerified: true,
                token:token
            }
            let update = await service.updateUser({ _id: userFind._id }, { $set: obj })
            console.log("update", update)
            return response(res, statusCode.data.SUCCESS, obj, messages.SuccessMessage.UPDATE_SUCCESS)

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
    resendOtp:async(req,res,next)=>{
        try {
            let userFind = await service.findUser({ mobileNumber: encryption.encrypt(req.body.mobileNumber), userType: userTypeEnum.data.USER, status: { $ne: statusEnum.data.DELETED } })
            if (!userFind) {
                return response(res, statusCode.data.NOT_FOUND, {}, messages.ErrorMessage.NOT_FOUND)
            }
            let obj={
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

    loginVerify:async(req,res,next)=>{
        try {
            let userFind = await service.findUser({ _id: req.query._id })
            if (!userFind) {
                return response(res, statusCode.data.NOT_FOUND, {}, messages.ErrorMessage.NOT_FOUND)
            }
            if ((userFind.mobOtpExpireTime+30*60*60*1000)<Date.now()) {
                return response(res, statusCode.data.FORBIDDEN, {},messages.ErrorMessage.OTP_EXPIRED)
            }
            if (userFind.mobileOtp==req.body.otp) {
                return response(res, statusCode.data.FORBIDDEN, {},"Incorrect otp.")
            }
            var token = jwt.sign({ _id: userFind._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'finovac', { expiresIn: '365d' });

            let obj = {
                _id:userFind._id,
                mobileOtpVerified: true,
                token:token
            }
            return response(res, statusCode.data.SUCCESS, obj, messages.SuccessMessage.UPDATE_SUCCESS)
        } catch (error) {
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    }

}