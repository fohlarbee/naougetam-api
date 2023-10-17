const nodemailer = require('nodemailer')

require('dotenv').config()


const {AUTH_EMAIL, AUTH_PASS} = process.env

let transporter = nodemailer.createTransport({
    // host:'smtp-mail.outlook.com',
    service:'gmail',
    // port:587,
    // secure:false,
    auth:{
        user:AUTH_EMAIL,
        pass:AUTH_PASS
    },
    debug:true

}) 


//test tranporter
transporter.verify((error, success) => {
    if(error)
        console.log('error preparing transporter',error)
    else{
        console.log('Ready for messages')
    }
})

const sendEmail = async (mailOptions) => {
     try {
        await transporter.sendMail(mailOptions).then(() => console.log('message sent'))
        return
     } catch (error) {
        throw error;
        
     }
}

module.exports =  sendEmail