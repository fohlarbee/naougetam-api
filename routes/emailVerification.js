const express = require('express');
const router = express.Router();

//request new verification otp

router.post('/', async(req, res) => {
    const {email} = req.body;

    if(!email){
        res.status(400).json({error: 'Email is required for verification'})
    }


})
