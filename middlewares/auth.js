const jwt = require('jsonwebtoken')
const User = require('../models/userModel')

const isAuth = async (req, res, next) => {
    try {
        if(!req.headers.authorization){
            throw Eroor('Unauthorized access')
        }
        const token = req.headers.authorization.split(' ')[1]
        const decode = jwt.verify(token, process.env.SECRET)
    
       const user =  User.findById(decode._id)
       if(user){
        user._id = decode._id
        req.user = user
       }
        if(!user){
            throw Error('Unauthorized access')
        }
    
        next();
        return req.user
        
    } catch (error) {
        res.status(400).json({message:error.message})
        
    }
    

}

module.exports = isAuth