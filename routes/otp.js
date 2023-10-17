const express = require('express')
const { sendOTP, verifyOTP } = require('../controllers/otpController')

const router = express.Router()

router.post('/',  sendOTP)

// router.post('/verify', verifyOTP)


// router.post('/verify', async(req, res) => {
//     const {email, otp} = req.body;

//     try {
//         const validOTP = await verifyOTP({email, otp});
//          res.status(200).json({message:'OTP verified', validOTP})
                
//         } catch (error) {
//          res.status(404).json({error:error.message})
        
//         }


// })

module.exports = router

// async(req, res) => {

//     const {email, subject, message, duration} = req.body

//     try {
//         const createdOTP = await sendOTP({
//             email,
//             subject,
//             message,
//             duration,
//         })
//         res.status(200).json({message:'OTP sent', createdOTP})
        
//     } catch (error) {
//         res.status(404).json({error:'error sending OTP', error})

        
//     }
    
// }

// async(req, res) => {
//     const {email, otp} = req.body
//     try {
//         const validOTP = await verifyOTP({email, otp});
//         res.status(200).json({message:'OTP verified', validOTP})
        
//     } catch (error) {
//         res.status(404).json({error:error.message})
        
//     }

   
// }