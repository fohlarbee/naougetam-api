const User = require('../models/userModel')
const jwt = require('jsonwebtoken')
const cloudinary = require('../utils/cloudinary')

const createToken = (_id) => {
     return jwt.sign({_id}, process.env.SECRET, {expiresIn:'3d'} )
}

// login user
const loginUser = async(req, res) => {
    const {email, password} = req.body 

    try {
        const user = await User.login(email, password )
        //create token 
        
        const token = createToken(user._id)

        res.status(200).json({message:'Login Succesful ',email, token})
        
    } catch (error) {
        res.status(404).json({error: error.message})
         
    }}

// signup user
const signupUser = async(req, res) => {
    const { username, email, password} = req.body
    try {
        const user = await User.signup( username, email, password)
        
        const token = createToken(user._id)

        res.status(200).json({message:'Signup Succesful ', email, token})
        
    } catch (error) {
        res.status(404).json({error: error.message})
        
    }

}
 
// verify user
const verifyUser = async (req, res) => {
        const {email, otp} = req.body

    try {
        const verifiedOTP = await User.verificationOfOTP(email, otp)
        const updated = await User.updateOne({email: email}, {$set:{verified: true}})
        // console.log(updated.acknowledged)
        res.status(200).json({message:'OTP verified', verifiedOTP})

        
    } catch (error) {                       
        res.status(400).json({error: error.message})
        
    }
    
    
    


}
const sendPasswordResetEmail = async (req, res) => {
    const {email} = req.body

    try {
        const createdOTPRecord = await User.sendResetVerificationEmail(email)
        res.status(200). json({message:'Reset Email OTP sent', createdOTPRecord})
        
    } catch (error) {
        res.status(400).json({error: error.message})

    }
}
const verifyAndResetUserPassword = async( req, res) => {
    const {email, otp, newPassword} = req.body

    try {
        const newResetDetails = await User.verifyResetOTP(email, otp, newPassword);
        res.status(200). json({message:'Password Reset Succesful', newResetDetails})


        
    } catch (error) {
        res.status(400).json({error: error.message})
    }


}
const updateAvatar = async  (req, res, next) => {
  
    try {
        const avater = await User.updateUserAvater(req, res)
        res.status(200).json({message:'success, avater updated', avater})
     
    } catch (error) {
        res.status(400).json({error: error.message})
        console.log(error)
        
    }
}




module.exports = {
    loginUser,
    signupUser,
    verifyUser,
    sendPasswordResetEmail,
    verifyAndResetUserPassword, 
    updateAvatar
}