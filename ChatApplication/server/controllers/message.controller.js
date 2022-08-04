const ChatModel = require('../model/chatModel');
const MessageModel = require('../model/messageModel')
const UserModel = require('../model/userModel')

exports.sendMessage = async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId) {
        res.status(400).json({ message: 'Please enter the message 1st!!' })
    }
    else {
        var newMessage = {
            sender: req.id,
            content: content,
            type: 'text',
            chat: chatId
        }
        try {
            var message = await MessageModel.create(newMessage)
            message = await message.populate('sender', 'username image');
            message = await message.populate('chat');
            message = await UserModel.populate(message, {
                path: 'chat.users',
                select: 'username image emailid',
            });
            const d1 = await ChatModel.findByIdAndUpdate(req.body.chatId, {
                latestMessage: message,
            })
            if (d1) {
                res.status(200).json({ message: message })
            }
            else {
                res.status(400).json({ message: "Somthing went wrong!!" })
            }
        } catch (error) {
            throw error
        }
    }
} //for sending message

exports.fetchMessage = async (req, res) => {
    try {
        const message = await MessageModel.find({ chat: req.params.chatid })
            .populate("sender", "username image emailid")
            .populate("chat")
            .populate("reply")
        res.status(200).json({ message: message })
    } catch (error) {
        throw (error)
    }
} // fetch message for single chat

exports.sendFiles = async (req, res) => {
    const { chatId } = req.body
    const type = req.file
    console.log(type);
    if (req.file.mimetype == 'image/png' || req.file.mimetype == 'image/jpeg' || req.file.mimetype == 'image/svg' || req.file.mimetype == 'image/gif' || req.file.mimetype == 'image/webp') {
        var newMessage = {
            sender: req.id,
            content: req.file.filename,
            type: 'image',
            chat: chatId
        }
    }
    else if (req.file.mimetype == 'video/mp4') {
        var newMessage = {
            sender: req.id,
            content: req.file.filename,
            type: 'video',
            chat: chatId
        }
    }
    else {
        var newMessage = {
            sender: req.id,
            content: req.file.filename,
            type: 'file',
            chat: chatId
        }
    }
    try {
        var message = await MessageModel.create(newMessage)
        message = await message.populate('sender', 'username image');
        message = await message.populate('chat');
        message = await UserModel.populate(message, {
            path: 'chat.users',
            select: 'username image emailid',
        });
        await ChatModel.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        })
        res.status(200).json({ message: message })
    } catch (error) {
        throw error
    }
}//file/video/image share

exports.replyMessage = async (req, res) => {
    const { content, chatId, reply } = req.body;
    var newMessage = {
        sender: req.id,
        content: content,
        type: 'text',
        replyType: 'textreply',
        reply: reply,
        chat: chatId
    }
    try {
        var message = await MessageModel.create(newMessage)
        message = await message.populate('sender', 'username image');
        message = await message.populate('reply', 'content');
        message = await message.populate('chat', 'users');
        message = await UserModel.populate(message, {
            path: 'chat.users',
            select: 'username image',
        });
        const d1 = await ChatModel.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        })
        if (d1) {
            res.status(200).json({ message: message })
        }
        else {
            res.status(400).json({ message: "Somthing went wrong!!" })
        }
    } catch (error) {
        throw error
    }
}// reply to a paticular message


exports.searchMessage = async (req, res) => {
    const { chatId } = req.body
    const keyword = req.query.search ? {
        $or: [
            { content: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {};
    const msg = await MessageModel.find(keyword)
        .where({ chat: chatId })
        .select('content');
    res.status(200).json({ message: msg });
}