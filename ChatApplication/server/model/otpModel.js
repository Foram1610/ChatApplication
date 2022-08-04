const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    emailid : String,
    code : String,
    expireIn :  Date
},{timestamps:true,})

module.exports = mongoose.model('Otp', otpSchema, 'Otp');