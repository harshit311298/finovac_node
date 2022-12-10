let local={
    port:'http://localhost:1964',
    swaggerurl:'localhost:1964',
    email_auth: {
        user: "fortestingpurpose0077@gmail.com", // generated ethereal user
        pass: "Mobiloitte@1", // generated ethereal password
      },
},
staging={
    port:'https://finovac-node.onrender.com',
    swaggerurl:'finovac-node.onrender.com',
    email_auth: {
        user: "fortestingpurpose0077@gmail.com", // generated ethereal user
        pass: "Mobiloitte@1", // generated ethereal password
      },
}

module.exports={
    local,staging
}