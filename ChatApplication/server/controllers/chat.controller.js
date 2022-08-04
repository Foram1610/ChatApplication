const UserModel = require('../model/userModel');
const ChatModel = require('../model/chatModel');

exports.createChat = async (req, res) => {
    const { _id } = req.body;
    const data = await ChatModel.find({ users: { $elemMatch: { $eq: _id } } }).select('users').where({ chatName: { $eq: 'sender' } })
    try {
        if (data == "") {
            const chatdata = {
                chatName: 'sender',
                isGroupChat: false,
                users: [req.id, _id],
            };
            const createChat = await ChatModel.create(chatdata);
            const FullChat = await ChatModel.findOne({ _id: createChat._id }).select({ users: { $elemMatch: { $ne: req.id } } })
                .populate('users', '-password -createdAt -updatedAt -__v')
            return res.status(200).json({ message: "Chat Created!!", data: FullChat })
        }
        else {
            return res.status(400).json({ message: 'Already have chat!!' })
        }
    } catch (error) {
        throw new Error(error);
    }
}  // Single chat created

exports.fetchChat = async (req, res) => {
    try {
        const data = await ChatModel.find({ users: { $elemMatch: { $eq: req.id } } })
        // .select({ users: { $elemMatch: { $ne: req.id } } })
            // .populate('isGroupChat')
            .populate('users', '-password -createdAt -updatedAt -__v')
            .populate('groupAdmin', 'username fullname image')
            .populate('latestMessage','sender content')
        // .populate('isGroupChat')
        // .sort({ updatedAt: -1 })
        // .then(async (result) => {
        //     result = await ChatModel.find({})
        //     .where({users: { $elemMatch: { $ne: req.id } }})
        //     .select('users');
        res.status(200).json({ data: data })
        // })
    } catch (error) {
        throw new Error(error)
    }
} // Fetch all the user with chat



exports.createGroup = async (req, res) => {
var user1 = JSON.parse(req.body.users);
    // var user1 = [];
    // user1 = req.body.users;
    if (user1.length < 1) res.status(400).json({ message: 'Please select more than 1 ueser for create the group!!' });
    else {
        user1.push(req.id)
        try {
            console.log("image ==>",req.file);
            if (req.file === undefined) {
                const groupChat = new ChatModel()
                groupChat.chatName = req.body.gname;
                groupChat.users = user1;
                groupChat.isGroupChat = true;
                groupChat.groupAdmin = req.id;
                groupChat.image1 = 'groupdef.png';
                await groupChat.save()
                const FullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
                    .populate('users', '-password')
                    .populate('groupAdmin', '-password')
                res.status(200).json({ message: "Group created successfully!!", data: FullGroupChat })
            }
            else {
                const groupChat = new ChatModel()
                groupChat.chatName = req.body.gname;
                groupChat.users = user1;
                groupChat.isGroupChat = true;
                groupChat.groupAdmin = req.id;
                groupChat.image1 = req.file.filename;
                await groupChat.save()
                const FullGroupChat = await ChatModel.findOne({ _id: groupChat._id })
                    .populate('users', '-password -__v -createdAt -updatedAt')
                    .populate('chatName')
                    .populate('groupAdmin', '-password -__v -createdAt -updatedAt')
                res.status(200).json({ message: "Group created successfully!!", data: FullGroupChat })
            }

        } catch (error) {
            res.status(400).json({ message: "Somthing went wrong!!", data: error })
        }
    }
}  //Groupchat created

exports.groupRename = async (req, res) => {
    const { chatId, gname } = req.body;
    if (!chatId && !gname) {
        res.status(400).json({ message: "Please enter new group name!!" })
    }
    else {
        const updateChat = await ChatModel.findByIdAndUpdate(chatId,
            { chatName: gname }, { new: true }
        )
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
        if (!updateChat) {
            res.status(401).json({ data: 'chat not found!!' });
        }
        else {
            res.status(200).json({ message: "Group renamed successfully!!", data: updateChat })
        }
    }
}  //Rename group

exports.groupRemove = async (req, res) => {
    const { userId, chatId } = req.body;
    const remove = await ChatModel.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!remove) {
        res.status(404).json({ message: "Not Found!!" });
    }
    else {
        res.status(200).json({ message: "User removed from the group successfully!!", data: remove })
    }
}  //Remove from group

exports.groupAdd = async (req, res) => {
    const { userId, chatId } = req.body;
    const adduser = await ChatModel.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")

    if (!adduser) {
        res.status(404).json({ message: "Not Found!!" });
    }
    else {
        res.status(200).json({ message: "User added in the group successfully!!", data: adduser })
    }
}  //Add users in group

exports.updateGroupImage = async (req, res) => {
    const { chatId } = req.body
    const d = await ChatModel.findByIdAndUpdate(chatId, {
        $set: {
            image1: req.file.filename,
        }
    })
    if (d) {
        res.status(200).json({ message: 'Image Updated!!', data: d })
    }
    else {
        res.status(400).json({ message: 'Error', data: d })
    }
} //Change profile picture of group