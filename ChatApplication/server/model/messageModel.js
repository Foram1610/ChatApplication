const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    content: {
        type: String,
        trim: true,
    },
    type: String,
    replyType: String,
    reply: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    readBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Message', messageSchema, 'Message')