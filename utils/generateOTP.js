const  generateOTP = async () => {
    let otp;
    try {

        return (otp = `${Math.floor(1000 + Math.random() * 9000 )}`)
        console.log(otp)
        
    } catch (error) {
        throw error
        
    }
}
module.exports = generateOTP;