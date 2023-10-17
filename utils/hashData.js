const bcrypt = require('bcrypt')

const hashData = async (data, saltRounds = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRounds)
        return hashedData
    } catch (error) {
        throw Error('Error while hasing data', error)
        
    }
}

const verifyHashedOTP =  async (unhashed, hashed) => {
    try {
        const match = await bcrypt.compare(unhashed, hashed);
        return match;
    } catch (error) {
        throw Error('Unable to verify hashed data')
        
    }
}
module.exports = {hashData, verifyHashedOTP}