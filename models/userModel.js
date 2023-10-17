const OTP = require('../models/otpModel')

const {hashData, verifyHashedOTP} = require('../utils/hashData')
const { sendOTP } = require('../controllers/otpController')


const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const sharp = require('sharp')




const validator = require('validator')
const numberValidator =  require('nigeria-phone-number-validator')
const cloudinary = require('../utils/cloudinary')



const Schema = mongoose.Schema


const userSchema = new Schema({
    number:{
        type: String,
        // required: true,
        unique: true
    },
    username:{
        type: String,
        required: true, 
        // unique: true
    },

    email:{
        type: String,
        required: true,
        unique: true,
    
    },
  
    password: {
        type: String,
        required: true
    },
    avater:{
        type: String
    },
    verified:{
        type:Boolean
    }
    
    
})

// static signup method
  userSchema.statics.signup =  async function ( username, email, password){
    //validation
    // console.log('number', number, 'email', email, 'username', username, 'pass', password)
    console.log(validator.isEmail(email))

    if( !username, !email || !password){
        throw Error('All fields must be filled')

    }

    const usernameExists = await this.findOne({username})
    if(usernameExists){
        throw Error('Username must be unique')
    }


    // if(!numberValidator.validatePhoneNumberSync(number).isValid){
    //     throw Error('Not a valid NGA mobile number') 
    // }

    if(!validator.isStrongPassword(password)){
        throw Error('Password not strong enough')
    }
    if(!validator.isEmail(email)){
        throw Error('Email is not valid')
    }

    const exists = await this.findOne({email})

    if(exists){
        throw Error('Email already exists')
    }
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const user = await this.create({
        // number, 
        username, 
        email, 
        password:hashed,
        verified:false
     })
     const OTPDetails = {
        email,
        subject:'Email Verification',
        purpose:'Verify your Email with the code below',
        duration: 1

     }

     const createdOTPRecord = await sendOTP(OTPDetails)

    return {user, createdOTPRecord};

} 
userSchema.statics.login = async function (email, password){
    if(!email || !password){
        throw Error('All fields must be filled')
    }

    const user = await this.findOne({email})

    if(!user){
        throw Error('incorrect email address')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match){
        throw Error('Incorrect password')
    }

    return user; 
}
 
userSchema.statics.verificationOfOTP = async function (email, otp){
    if(!email || !otp){
        throw Error('All fields must be filled')

    }
    const matchedOTPRecord = await OTP.findOne({email})

    if(!matchedOTPRecord){
        throw Error('No OTP record found or Account already verified'); 
    }

     //check if code is expired
     const {expiresAt} = matchedOTPRecord;

     if(expiresAt < Date.now()) {
         await OTP.deleteOne({email})
         throw Error('Code expired, Request a new one')
     }

      // verify code, if not expired
      const hashedOTP = matchedOTPRecord.otp;
      const validOTP = await verifyHashedOTP(otp, hashedOTP);

      if(!validOTP){
          throw Error('Invalid OTP provided')
      }

      await OTP.deleteOne({email})




      return validOTP;

}

userSchema.statics.sendResetVerificationEmail = async function(email){
    if(!email){
        throw Error('Provide a valid email')
    }
    const existingUser = await this.findOne({email})

    if(!existingUser){
        throw Error('No account for the provided email')
    }
    if(!existingUser.verified){
        throw Errror("Email hasn't been verified, check your email")
    }
    const OTPDetails = {
        email,
        subject:'Password Reset',
        purpose:'Enter the Code below to Reset your Password',
        duration: 1

     }

     const createdOTPRecord = await sendOTP(OTPDetails)

     return {createdOTPRecord}
}


userSchema.statics.verifyResetOTP = async function (email, otp, newPassword){
    if(!email || !otp || !newPassword){
        throw Error('All fields required')
    }

    // verify OTP 
    const matchedOTPRecord = await OTP.findOne({email})

    if(!matchedOTPRecord){
        throw Error('No OTP record found or Account already verified'); 
    }

     //check if code is expired
     const {expiresAt} = matchedOTPRecord;

     if(expiresAt < Date.now()) {
         await OTP.deleteOne({email})
         throw Error('Code expired, Request a new one')
     }

      // verify code, if not expired
      const hashedOTP = matchedOTPRecord.otp;
      const validOTP = await verifyHashedOTP(otp, hashedOTP);

      if(!validOTP){
          throw Error('Invalid OTP provided')
      }

      
      if(!validator.isStrongPassword(newPassword)){
        throw Error('Password not strong enough')
    }
    
    const hashedPassword = await hashData(newPassword);

   const user = await this.updateOne({email}, {password : hashedPassword})

   await OTP.deleteOne({email})

      
   return {user}
}
userSchema.statics.updateUserAvater = async function(req, res){
        const {user} = req

        if(!user){
           throw Error('Unauthorized access')
       }
       if(!req.file.buffer){
           throw Error('No Image file attached')
       }
   
       const imageBuffer = req.file.buffer.toString('base64')


       const result = await cloudinary.uploader.upload(`data:${req.file.mimetype};base64,${imageBuffer}`, {
            upload_preset:'userAvater',
            public_id: `${user._id}_avater`,
            transformation:{width:100, height:100, crop:'fill'}

       });
    //    console.log(result)
       // const {width, height} = await sharp(imageBuffer).metadata()
       // const avater = await sharp(imageBuffer).resize(Math.round(width * 0.5), Math.round(height * 0.5)).toBuffer()
   
       // await this.updateOne(user.email, {avater: result.secure_url})
   
    return result.secure_url
        
   
   
}



module.exports = mongoose.model('User', userSchema)

