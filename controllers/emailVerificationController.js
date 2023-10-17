 const User = require('../models/userModel')

 const sendVerificationOTPEmail = async (email) => {
    // check if user exists
    const existingUser = await User.findOne({email})
    
    if(!existingUser){
        throw Error('User does not exits')
    }

    // preapre OTP details
    const OTPDetails = {
        email,
        subject:'Email Verification',
        purpose:'Proceed to Verify your emeil with the 4 digit code',
        duration: 1


    }
}