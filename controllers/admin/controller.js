const { commonResponse: response } = require('../../utility/commonResponseHandler');
const statusCode = require('../../utility/statusCode');
const messages = require('../../utility/message')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const service = require('./service')
let userTypeEnum = require('../../enums/userTypes')
let statusEnum = require('../../enums/status')
module.exports = {
/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     tags:
 *       - ADMIN DASHBOARD
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: email
 *         description: email
 *         in: formData
 *         required: true
 *       - name: password
 *         description: password
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
    login: async (req, res) => {
        try {
            let admin = await service.findUser({ $or: [{ email: req.body.email }, { mobileNumber: req.body.email }], userType: userTypeEnum.data.ADMIN, status: statusEnum.data.ACTIVE }).select('-emailOtp -mobileOtp')
            if (!admin) {
                return response(res, statusCode.data.NOT_FOUND, [], messages.ErrorMessage.USER_NOT_FOUND)
            }
            const check = bcrypt.compareSync(req.body.password, admin.password)
            if (check == false) {
                return response(res, statusCode.data.INVALID_CREDENTIAL, [], messages.ErrorMessage.INVALID_CREDENTIAL)
            }
            var token = jwt.sign({ _id: admin._id, iat: Math.floor(Date.now() / 1000) - 30 }, 'finovac', { expiresIn: '365d' });
            let result = {
                userId: admin._id,
                token: token,
                name: admin.name,
                email: admin.email,
                mobileNumber: admin.mobileNumber,
                userType: admin.userType,
            };
            return response(res, statusCode.data.SUCCESS, result, messages.SuccessMessage.LOGIN_SUCCESS)
        }
        catch (error) {
            console.log("============>error",error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },

    forgotPassword:async(req,res)=>{
     try {
        let admin = await service.findUser({ $or: [{ email: req.body.email }, { mobileNumber: req.body.email }], userType: userTypeEnum.data.ADMIN, status: statusEnum.data.ACTIVE })
        if (!admin) {
            return response(res, statusCode.data.NOT_FOUND, [], messages.ErrorMessage.USER_NOT_FOUND)
        }
        
     } catch (error) {
        console.log("============>error",error)
        return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
     }
    }
}