const nodemailer =require('nodemailer') ;
const mailTemps=require('../MailsTemplates/mailTemplatesExecution')
const enviroment=require('../enviromentVariables')
// let variableused=enviroment.local//beta
let variableused=enviroment.staging//staging
// let variableused=enviroment.production//production
module.exports={
    forgotPassword:async(data)=>{
        let html = mailTemps.forgotPassword.mail(data)
        var transporter = nodemailer.createTransport({
          service: config.get('nodemailer.service'),
          auth: {
            "user": variableused.nodemailer.email,
            "pass": variableused.nodemailer.password
          }
        });
        var mailOptions = {
          from: "<do_not_reply@gmail.com>",
          to: data.email,
          subject:  mailTemps.forgotPassword.subject,
          html: html,
        };
        return await transporter.sendMail(mailOptions);
    }
}