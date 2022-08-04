const UserModel = require('../model/userModel');
const bcrypt = require('bcryptjs');

exports.updateDetails = (req, res) => {
    const { username, fullname, emailid, gender, dob } = req.body
    UserModel.findByIdAndUpdate(req.id, {
        $set: {
            username: username,
            fullname: fullname,
            emailid: emailid,
            gender: gender,
            dob: dob,
        }
    },(err, d) => {
        if (d) {
            res.status(200).json({ message: 'Data Updated!!', data: d })
        }
        else {
            res.status(400).json({ message: 'Data not Updated!!', data: err })
        }
    })
};

exports.updateImage = async (req, res) => {
    const d = await UserModel.findByIdAndUpdate(req.id, {
        $set: {
            image: req.file.filename,
        }
    })
    res.status(200).json({ message: 'Image Updated!!', data: d })
};

exports.changePassword = async (req, res) => {
    const { password } = req.body;
    if (!password) {
        res.status(400).json({ message: 'Please enter new password!!' })
    }
    else {
        const hashPass = await bcrypt.hash(password, 10)
        const d1 = await UserModel.findByIdAndUpdate(req.id, {
            $set: { password: hashPass }
        })
        res.status(200).json({ message: 'Password changed!!' })
    }
};

exports.serachUsers = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { username: { $regex: req.query.search, $options: 'i' } },
            { fullname: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {};
    const users = await UserModel.find(keyword)
        .find({ _id: { $ne: req.id } })
        .select('username image');
    res.status(200).json({ message: users });
}