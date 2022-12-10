const jwt = require("jsonwebtoken");
const userModel = require("../model/user");
const statusCode = require('../utility/statusCode');
const messages = require('../utility/message')
module.exports = {
    verifyToken(req, res, next) {
        if (req.headers.token) {
            jwt.verify(req.headers.token, 'finovac', (err, result) => {
                if (err) {
                    if (err.name == "TokenExpiredError") {
                        return res.status(200).send({
                            responseCode: 440,
                            responseMessage: "Session Expired, Please login again.",
                            result: {},
                        });
                    } else {
                        return res.status(500).send({
                            errorCode: 500,
                            responseMessage: "Internal Server error",
                            error: err,
                        });
                    }
                }
                else {
                    console.log(result)
                    userModel.findOne({ _id: result._id }, (error, result2) => {
                        //console.log("17============",result2);
                        if (error) {
                            return next(error)
                        }
                        else if (!result2) {
                            console.log(result2);
                            //throw apiError.notFound(responseMessage.USER_NOT_FOUND);
                            return res.status(404).json({
                                responseCode: 404,
                                responseMessage: "USER NOT FOUND"
                            })
                        }
                        else {
                            if (result2.status == "BLOCKED") {
                                return res.status(403).json({
                                    responseCode: 403,
                                    responseMessage: "You Have been blocked by admin ."
                                })
                            }
                            else if (result2.status == "DELETE") {
                                return res.status(401).json({
                                    responseCode: 401,
                                    responseMessage: "Your account has been deleted by admin ."
                                })
                            }
                            else {
                                req.userId = result._id;
                                req.userDetails = result
                                next();
                            }
                        }
                    })
                }
            })
        } else {
            return res.status(501).send({
                errorCode: 501,
                responseMessage: "Internal Server error",
                error: error,
            });
        }
    }

}