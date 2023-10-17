const OTP = require('../models/otpModel')
const generateOTP = require('../utils/generateOTP')
const sendEmail = require('../utils/sendEmail')
const {hashData} = require('../utils/hashData')

const {AUTH_EMAIL} = process.env

const sendOTP = async({email, subject, purpose, duration = 1}) => {


    try {
        if(!email || !subject || !purpose){
            throw Error('All field must be provided')
        }
        //clear any old record
        await OTP.deleteOne({email})

        // generate OTP
        const generatedOTP = await generateOTP();
        console.log(generatedOTP)

         // send mail
         const mailOptions = {
            from: AUTH_EMAIL,
            to:email,
            subject,
            html: `<p>${purpose}</p><p style="color:tomato; font-size:25px; letter-spacing:2px;"><b>${generatedOTP}</b></p>
            <p>This code <b>expires in ${duration} hour(s)</b></p>`,
        };

        await sendEmail(mailOptions);

        //hash otp
        const hashedOTP = await hashData(generatedOTP) 

        // create new OTP record
         const newOTP =  new OTP({
                email, 
                otp: hashedOTP,
                createdAt: Date.now(),
                expiresAt: Date.now() + 3600000 * duration
           
            })

        const createdOTPRecord = await newOTP.save()
        return createdOTPRecord;

        
    } catch (error) {
        throw Error('Error in send OTP fuction', error.message)
    }    

}

const deleteOTP = async(email) => {
    try {
        await OTP.deleteOne({email});
        
    } catch (error) {
        throw Error('Unable to delete OTP record')
        
    }

}
module.exports = {sendOTP, deleteOTP}