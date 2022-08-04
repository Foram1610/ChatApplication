const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    username:
    {
        type: String,
        unique: true,
        require: true
    },
    fullname : String,
    emailid:
    {
        type: String,
        unique: true,
        require: true
    },
    gender: String,
    dob : {
        type:Date,
    },
    password:
    {
        type: String,
        require: true
    },
    image :{
        type:String,
        default:'def.png'
    },
},
{timestamps:true,}
)

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10)
    }
    next();
});

module.exports = mongoose.model('User', userSchema, 'User');