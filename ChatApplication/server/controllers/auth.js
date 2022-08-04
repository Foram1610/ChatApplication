const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../model/userModel');
const OtpModel = require('../model/otpModel');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transport = nodemailer.createTransport(sendgridTransport({
    auth: {
        api_key: process.env.SENDGRID_KEY
    }
}))

exports.me = async (req, res) => {
    const data = await UserModel.findById(req.id).select('-password -__v -updatedAt -createdAt');
    if (data) {
        res.status(200).json({ data: data })
    }
    else {
        res.status(400).json({ message: "not found!!" })
    }
}

exports.registration = (req, res) => {
    const { username, fullname, emailid, gender, dob, password } = req.body;
    if(req.file == undefined){  
        UserModel.findOne({ username: username } && { emailid: emailid }, async (err, user) => {
            try {
                if (user) {
                    return res.status(409).json({ message: 'User already exits!!' });
                }
                else {
                    const user1 = new UserModel({
                        username, fullname, emailid, gender, dob, password,
                        image: 'def.png',
                    });
                    const data = await user1.save()
                    console.log("Reg ==> ", data);
                    if (data) {
                        res.status(200).json({ message: 'User Registered!!' })
                    }
                    else {
                        res.status(400).json(err)
                    }
                }
            } catch (error) {
                throw error
            }
        });
    }
    else{
        UserModel.findOne({ username: username } && { emailid: emailid }, async (err, user) => {
            try {
                if (user) {
                    return res.status(409).json({ message: 'User already exits!!' });
                }
                else {
                    const user1 = new UserModel({
                        username, fullname, emailid, gender, dob, password,
                        image: req.file.filename,
                    });
                    const data = await user1.save()
                    console.log("Reg ==> ", data);
                    if (data) {
                        res.status(200).json({ message: 'User Registered!!' })
                    }
                    else {
                        res.status(400).json(err)
                    }
                }
            } catch (error) {
                throw error
            }
        });
    }
};

exports.login = (req, res) => {
    const { uname, password } = req.body;
    UserModel.findOne({ $or: [{ username: { $eq: uname } }, { emailid: { $eq: uname } },] }, async (err, user) => {
        try {
            if (!user) {
                res.status(401).json({ messsage: "Wrong Credentials!!" });
            }
            else {
                const isMatch = await bcrypt.compare(password, user.password)
                if (!isMatch) {
                    res.status(401).json({ code: 'INVALID_PASSWORD', message: "Wrong Password" })
                }
                else {
                    const token = jwt.sign({
                        username: user.username,
                        _id: user._id.toString()
                    }, process.env.SECRET_KEY, { expiresIn: '10h' });
                    res.status(200).json({ token: token, data: "Login sucessfull!!", _id: user._id });
                }
            }
        } catch (error) {
            throw res.status(400).json({ messsage: "Something went wrong!!" });
        }
    });
};

exports.forgotPassLink = (req, res) => {
    const { emailid } = req.body
    UserModel.findOne({ emailid: emailid }, (err, user) => {
        if (user) {
            let otp = Math.floor((Math.random() * 10000) + 1);
            let otpData = new OtpModel({
                emailid: emailid,
                code: otp,
                expireIn: new Date().getTime() + 300 * 1000
            })
            transport.sendMail({
                to: emailid,
                from: 'fparmar986@gmail.com',
                subject: 'Forgot Password OTP!!',
                html: `<h1>Reset your password!!</h1><br />
                        <p>Your otp for Reset password is : ${otp}</p><br /><br />
                        <p>This otp will expire in 5 minutes...</p>`
            })
            const data = otpData.save()
            if (data) {
                res.status(200).json({ message: 'Otp send to your mail!!!' })
            } else {
                res.status(404).json({ message: 'somthing went wrong!!!' })
            }
        }
        else {
            res.status(400).json({ message: 'User does not exixts!!' })
        }
    })
}

exports.forgotPassword = async (req, res) => {
    await OtpModel.findOne({ $and: [{ code: { $eq: req.body.code } }, { emailid: { $eq: req.body.emailid } }] }, async (err, data) => {
        if (data == "") {
            res.status(401).json({ message: 'Otp exprired!!' })
        }
        else {
            if (data.code == req.body.code) {
                let curTime = new Date().getTime();
                let extime = (data.expireIn).getTime();
                let diff = extime - curTime;
                if (diff < 0) {
                    await OtpModel.deleteMany({ code: req.body.code }).where({ emailid: req.body.emailid })
                    res.status(401).json({ message: 'Otp exprired!!' })
                }
                else {
                    await UserModel.findOne({ emailid: req.body.emailid }, async (err, user) => {
                        user.password = req.body.password;
                        const data = await user.save()
                        if (data) {
                            await OtpModel.deleteMany({ code: req.body.code }).where({ emailid: req.body.emailid })
                            res.status(200).json({ message: 'Password Updated!!' })
                            await OtpModel.remove({ emailid: req.body.emailid })
                        }
                        else {
                            res.status(404).json({ message: 'Somthing went wrong!!' })
                        }
                    })
                }
            }
            else {
                const d1 = await OtpModel.remove({ emailid: req.body.emailid })
                res.status(400).json({ message: 'Otp is not valid!!, Please resend the otp!!' })
            }
        }
    })
}