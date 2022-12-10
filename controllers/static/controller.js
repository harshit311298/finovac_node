const { commonResponse: response } = require('../../utility/commonResponseHandler');
const statusCode = require('../../utility/statusCode');
const messages = require('../../utility/message')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const service = require('./service')
let userTypeEnum = require('../../enums/userTypes')
let statusEnum = require('../../enums/status')
const adminService = require('../admin/service')
module.exports = {
    /**
     * @swagger
     * /api/v1/static/addStatic:
     *   post:
     *     tags:
     *       - STATIC CONTENT MANAGEMENT
     *     description: Check for Social existence and give the access Token 
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: token
     *         description: token of admin login
     *         in: header
     *         required: true
     *       - name: title
     *         description: title
     *         in: formData
     *         required: true
     *       - name: description
     *         description: description
     *         in: formData
     *         required: false
     *       - name: type
     *         description: type
     *         in: formData
     *         required: true
     *       - name: link
     *         description: link
     *         in: formData
     *         required: false
     *     responses:
     *       200:
     *         description: Data saved is successful
     *       404:
     *         description: Invalid credentials
     *       500:
     *         description: Internal Server Error
     */
    addStatic: async (req, res, next) => {
        try {
            let admin = await adminService.findUser({ _id: req.userId, userType: userTypeEnum.data.ADMIN })
            if (!admin) {
                return response(res, statusCode.data.NOT_FOUND, [], messages.ErrorMessage.NOT_FOUND)
            }
            let saveData = await service.addData(req.body)
            return response(res, statusCode.data.SUCCESS, saveData, messages.SuccessMessage.DATA_SAVED)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
 * @swagger
 * /api/v1/static/listStaticContent:
 *   post:
 *     tags:
 *       - STATIC CONTENT MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         description: page
 *         in: query
 *         required: false
 *       - name: limit
 *         description: limit
 *         in: query
 *         required: false
 *       - name: search
 *         description: search by description or title
 *         in: formData
 *         required: false
 *     responses:
 *       200:
 *         description: Data found successfully.
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
    listStaticContent: async (req, res, next) => {
        try {
            let query = { status: { $ne: statusEnum.data.DELETED } }
            if (req.body.search) {
                query.$or = [
                    { description: { $regex: req.body.search, $options: 'i' } },
                    { title: { $regex: req.body.search, $options: 'i' } }
                ]
            }
            let sliders = await service.findAllData(query)
            if (req.query.page && req.query.page) {
                let options = {
                    page: Number(req.query.page) || 1,
                    limit: Number(req.query.limit) || 10,
                    sort: { "slideNumber": 1 }
                };
                let result = await service.paginateData(query, options)
                return response(res, statusCode.data.SUCCESS, result, messages.SuccessMessage.DATA_FOUND)
            }
            return response(res, statusCode.data.SUCCESS, { docs: sliders }, messages.SuccessMessage.DATA_FOUND)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
    /**
 * @swagger
 * /api/v1/slider/viewStatic:
 *   get:
 *     tags:
 *       - STATIC CONTENT MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: _id
 *         description: _id
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: Data found successfully.
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
    viewStatic: async (req, res, next) => {
        try {
            let result = await service.findOneData({ _id: req.query._id })
            if (!result) {
                return response(res, statusCode.data.NOT_FOUND, [], messages.ErrorMessage.NOT_FOUND)
            }
            return response(res, statusCode.data.SUCCESS, result, messages.SuccessMessage.DATA_FOUND)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)

        }
    },
    /**
 * @swagger
 * /api/v1/slider/editStatic:
 *   put:
 *     tags:
 *       - STATIC CONTENT MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token of admin login
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id
 *         in: query
 *         required: true
 *       - name: title
 *         description: title
 *         in: formData
 *         required: true
 *       - name: description
 *         description: description
 *         in: formData
 *         required: true
 *       - name: slideNumber
 *         description: slideNumber
 *         in: formData
 *         required: true
 *     responses:
 *       200:
 *         description: Data updated is successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
    editStatic: async (req, res, next) => {
        try {
            let admin = await adminService.findUser({ _id: req.userId, userType: userTypeEnum.data.ADMIN })
            if (!admin) {
                return response(res, statusCode.data.NOT_FOUND, [], messages.ErrorMessage.NOT_FOUND)
            }
            let result = await service.findOneData({ _id: req.query._id })
            if (!result) {
                return response(res, statusCode.data.NOT_FOUND, [], messages.ErrorMessage.NOT_FOUND)
            }
            let update = await service.editData({ _id: result._id }, { $set: req.body })
            return response(res, statusCode.data.SUCCESS, update, messages.SuccessMessage.UPDATE_SUCCESS)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    },
        /**
 * @swagger
 * /api/v1/slider/deleteStatic:
 *   delete:
 *     tags:
 *       - STATIC CONTENT MANAGEMENT
 *     description: Check for Social existence and give the access Token 
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: token
 *         description: token of admin login
 *         in: header
 *         required: true
 *       - name: _id
 *         description: _id
 *         in: query
 *         required: true
 *     responses:
 *       200:
 *         description: Data updated is successfully
 *       404:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
    deleteStatic: async (req, res, next) => {
        try {
            let admin = await adminService.findUser({ _id: req.userId, userType: userTypeEnum.data.ADMIN })
            if (!admin) {
                return response(res, statusCode.data.NOT_FOUND, [], messages.ErrorMessage.NOT_FOUND)
            }
            let result = await service.findOneData({ _id: req.query._id })
            if (!result) {
                return response(res, statusCode.data.NOT_FOUND, [], messages.ErrorMessage.NOT_FOUND)
            }
            let update = await service.editData({ _id: result._id }, { $set: {status:statusEnum.data.DELETED} })
            return response(res, statusCode.data.SUCCESS, update, messages.SuccessMessage.DELETE_SUCCESS)
        } catch (error) {
            console.log("============>error", error)
            return response(res, statusCode.data.SOMETHING_WRONG, error, messages.ErrorMessage.SOMETHING_WRONG)
        }
    }

}