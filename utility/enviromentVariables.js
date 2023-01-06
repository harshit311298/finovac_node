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
    acess_key:"AKIAY45TKYDD55REBNXP",
    secret_access_key:"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"
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
    acess_key:"AKIAY45TKYDD55REBNXP",
    secret_access_key:"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"

}

module.exports={
    local,staging
}