const enviroment=require('./enviromentVariables')
// let variableused=enviroment.local//beta
let variableused=enviroment.staging//staging
// let variableused=enviroment.production//production
const AWS = require('aws-sdk');
const Sender = require('aws-sms-send');
var aws_topic = 'arn:aws:sns:us-east-1:729366371820:coinbaazar';
const jwt =require('jsonwebtoken');
const nodemailer =require('nodemailer') ;
const cloudinary =require('cloudinary') ;

cloudinary.config({
  cloud_name: variableused.cloudinary.cloud_name,
  api_key: variableused.cloudinary.api_key,
  api_secret: variableused.cloudinary.api_secret
});
var aws_topic = 'arn:aws:sns:us-east-1:729366371820:coinbaazar';

var config2 = {
  AWS: {
    accessKeyId: variableused.acess_key,
    secretAccessKey: variableused.secret_access_key,
    region: "ap-south-1"
  },
  topicArn: aws_topic,
};
var sender = new Sender(config2);

module.exports = {

  getOTP() {
    var otp = Math.floor(1000 + Math.random() * 900000);
    return otp;
  },

  sendSms: (number,body) => {
    return new Promise(async (resolve, reject) => {
      sender.sendSms(`${body}`, "nodesms", false, number)
        .then(function (response) {
          ////console.log("Response======>", response);
          return resolve(response);
        })
        .catch(function (err) {
          console.log("err======>", err);
          return reject(err);
        })
    }
    )
  },

  getToken: async (payload) => {
    var token = jwt.sign(payload, config.get('jwtsecret'))
    return token;
  },

  adminSendMail: async (to, name, otp) => {
    let html = `<div style="font-size:15px">
                <p>Hello ${name},</p>
                <p>Your OTP is ${otp}>
                  Set a new password now
                </a>
                    If you did not request this, please ignore this email and your password will remain unchanged.
                </p> 
                <p>
                    Thanks<br>
                </p>
            </div>`

    var transporter = nodemailer.createTransport({
      pool: true,
      maxMessages: Infinity,
      // service: config.get('nodemailer.service'),
      auth: {
        "user": config.get('nodemailer.email'),
        "pass": config.get('nodemailer.password')
      },
      host: config.get('nodemailer.host'),
      secure: false,
      port: 587

    });
    var mailOptions = {
      from: config.get('nodemailer.email'),
      to: to,
      subject: 'OTP for Verification',
      html: html
    };
    return await transporter.sendMail(mailOptions)
  },

  getImageUrl: async (files) => {
    var result = await cloudinary.v2.uploader.upload(files[0].path, { resource_type: "auto", transformation: { duration: 30 } })
    console.log("82", result)
    return result;
  },

  getImageUrlPhase2: async (files) => {
    var result = await cloudinary.v2.uploader.upload(files, { resource_type: "auto", transformation: { duration: 30 } })
    console.log("82", result)
    return result;
  },

  genBase64: async (data) => {
    return await qrcode.toDataURL(data);
  },

  getSecureUrl: async (base64) => {
    var result = await cloudinary.v2.uploader.upload(base64);
    return result.secure_url;
  },

  contactUs: async (to, email,message) => {
    let html = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <title></title>
    </head>
    
    <body>
        <div class="card" style=" box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
        transition: 0.3s;
        width: 100%; margin: auto; min-height:15em;margin-top: 25px;">
            <div class="main" style="background-image: url('');">
                <div class="main-container" style="text-align: center;">
                    <h1 style="padding-top: 30px;"> <strong>STORM STREET</strong></h1>
                    <img  src="https://res.cloudinary.com/mobiloitte-testing1/image/upload/v1638252186/xekr1m6n5ar96nii7wrj.png" style="width: 30%;" alt="logo">
                    
                    <div style="width: 90%;margin: auto; text-align: left;">
                        <h4 style="color: #1f1f20; margin-bottom: 0px;"><strong>HI Admin</strong></h4><br><br>
                        <p style="color: #5b5858;font-size: 18px;margin-top: 0px;">${email}</p>
                        <p style="color: #5b5858;font-size: 18px;">${message}</p>
                        <p style="color: #5b5858;font-size: 18px;">Regards,<br>Team STORM STREET.</p>
    
    
                        <!-- <p><strong style="color: #596BD3;">Email :</strong> <strong>tanveer12@mailinator.com</strong>
                            <p>Upon sign-in in, you will be able to access other sevices.</p> -->
                    </div>
                    <!-- <div style="width: 90%;margin: auto; text-align: center;">
     <hr>
    <h4 style="color: #596BD3"><strong>IMPORTANT</strong></h4>
    <p style="color: #5b5858;font-size: 18px;">Please do not reply to this email</p>
    
                    </div> -->
                </div>
    
            </div>
        </div>
     
    </body>
    
    </html>`

    var transporter = nodemailer.createTransport({
      pool: true,
      maxMessages: Infinity,
      // service: config.get('nodemailer.service'),
      auth: {
        "user": config.get('nodemailer.email'),
        "pass": config.get('nodemailer.password')
      },
      host: config.get('nodemailer.host'),
      secure: false,
      port: 587

    });
    var mailOptions = {
      from: config.get('nodemailer.email'),
      to: to,
      subject: 'Queries Related to Website ',
      html: html
    };
    return await transporter.sendMail(mailOptions)
  },
}
