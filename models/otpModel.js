const User = require('../models/userModel')

const mongoose = require('mongoose')


const generateOTP = require('../utils/generateOTP')
const sendEmail = require('../utils/sendEmail')
const {hashData, verifyHashedOTP} = require('../utils/hashData')




const {AUTH_EMAIL} = process.env


const Schema = mongoose.Schema;

const OTPSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    otp: String,
    createdAt: Date,
    expiredAt: Date
});

OTPSchema.statics.generateOTP = async function (email, subject, purpose, duration = 1 ){
    if(!email || !subject || !purpose){
        throw Error('All fields must be filled')
    }
    //cler any old record
    await this.deleteOne({email})

     // generate OTP
     const generatedOTP = await generateOTP();
     console.log(generatedOTP)

      // send mail
      const mailOptions = {
        from: AUTH_EMAIL,
        to:email,
        subject,
        html: `<p>${purpose}</p><p style="color:tomato; font-size:25px; letter-spacing:2px;"><b>${generatedOTP}</b></p>
        <p>This code <b>expires in ${duration} hou(s)</b></p>`,
    };

    await sendEmail(mailOptions);

    //hash otp
    const hashedOTP = await hashData(generatedOTP) 

    const createdOTPRecord = await this.create({
        email, 
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000 * duration
    })
    
    return createdOTPRecord


}

OTPSchema.statics.verificationOfOTP = async function (email, otp){
    if(!email || !otp){
        throw Error('All fields must be filled')

    }
    const matchedOTPRecord = await this.findOne({email})

    if(!matchedOTPRecord){
        throw Error('No OTP record found'); 
    }

     //chexk if code is expired
     const {expiresAt} = matchedOTPRecord;

     if(expiresAt < Date.now()) {
         await this.deleteOne({email})
         throw Error('Code expired, Request a new one')
     }

      // verify code, if not expired
      const hashedOTP = matchedOTPRecord.otp;
      const validOTP = await verifyHashedOTP(otp, hashedOTP);

      if(!validOTP){
          throw Error('Invalid OTP provided')
      }

    //   await this.deleteOne({email})




      return validOTP;

}


module.exports = mongoose.model('OTP', OTPSchema)