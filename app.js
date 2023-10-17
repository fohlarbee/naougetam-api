const express = require('express')
const cors = require('cors')
const userRoutes = require('./routes/user')
const OTPRoutes = require('./routes/otp')

const mongoose = require('mongoose')

require('dotenv').config()



const app = express()


// middleware
app.use(express.json({limit:'50mb'}))
app.use(express.urlencoded({extended:true, limit:'50mb'}))
// app.use(express.urlencoded())
app.use(cors())


//routes
app.use('/api/user', userRoutes)
app.use('/api/otp', OTPRoutes)


const connectionpOptions = {
    dbName: `nayougetam`,
    useUnifiedTopology: true,
  }

// connect to db
mongoose.connect(process.env.MONGO_URI,  connectionpOptions)
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('listening on port', process.env.PORT)
        })

    })
    .catch((error) => {
        console.log(error)
    })
