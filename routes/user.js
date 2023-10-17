const express = require('express')


const router = express.Router()
const multer = require('multer')


const {loginUser, 
    signupUser, 
    verifyUser, 
    sendPasswordResetEmail, 
    verifyAndResetUserPassword,  
    updateAvatar, } = require('../controllers/userControllers')

const isAuth = require('../middlewares/auth')

//storage config
const storage = multer.diskStorage({})

const fileFilter = (req, file, cb) => {
    if(file.mimetype.startsWith('image')){
         cb(null, true);
    }else{
        cb('invalid image file', false); 
    }

}

const uploads = multer(storage, fileFilter)
 

// login route
router.post('/login', loginUser)


// signup route
router.post('/signup', signupUser)

// verify user
router.post('/verify', verifyUser)

// send Email for reset password
router.post('/forgot_password', sendPasswordResetEmail)

//verify and reset password
router.post('/reset_password', verifyAndResetUserPassword)

//save profilePicture
router.post('/update_avater', isAuth, uploads.single('image'), updateAvatar)
router.post('setUser')


module.exports = router