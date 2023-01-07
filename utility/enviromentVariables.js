let local={
    port:'http://localhost:1964',
    swaggerurl:'localhost:1964',
    "nodemailer": {
        "service": "gmail",
        "email": "fortestingpurpose0077@gmail.com",
        "password": "bztzdeyoecetitik"
    },
    cloudinary:{
        cloud_name: "mobilloite",
        api_key: "467986128519276",
        api_secret: "1w0A-gMtLQz6XMHMutGYayTTJV8"
    },
    DATA_ENCRYPTION:"finovac",
    acess_key:"AKIAY45TKYDDVZXJA6EK",
    secret_access_key:"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",
    fast2smsapiKeys:"PZxqiBMXYVJQTopS3tFhNEeaOwk8ucCmUvIldy6RGrDz5b0jW9xpDfVE6Wh5iNP4z3jm7BaS2OZnMrYL"
},
staging={
    port:'https://finovac-node.onrender.com',
    swaggerurl:'finovac-node.onrender.com',
    "nodemailer": {
        "service": "gmail",
        "email": "fortestingpurpose0077@gmail.com",
        "password": "bztzdeyoecetitik"
    },
    cloudinary:{
        cloud_name: "mobilloite",
        api_key: "467986128519276",
        api_secret: "1w0A-gMtLQz6XMHMutGYayTTJV8"
    },
    DATA_ENCRYPTION:"finovac",
    acess_key:"AKIAY45TKYDDVZXJA6EK",
    secret_access_key:"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",
    fast2smsapiKeys:"PZxqiBMXYVJQTopS3tFhNEeaOwk8ucCmUvIldy6RGrDz5b0jW9xpDfVE6Wh5iNP4z3jm7BaS2OZnMrYL"
}

module.exports={
    local,staging
}