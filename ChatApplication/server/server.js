const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const path = require("path");
require('./connection');
const auth = require('./routes/auth')
const userInfo = require('./routes/userInfo')
const chat = require('./routes/chat')
const message = require('./routes/message');
const socketio = require('socket.io')

//middleware
app.use(express.json());
app.use(cors());

//for access folder
app.use("/profile", express.static(path.join(__dirname, '/public/ProfilePicture')));
app.use("/media", express.static(path.join(__dirname, '/public/Media')));

// Add Access Control Allow Origin headers
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://192.168.100.8:3000");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

app.use('/api/auth',auth);
app.use('/api', userInfo)
app.use('/api/chat', chat)
app.use('/api/message', message)

const server = app.listen(process.env.PORT, () => console.log(`Sever running on port ${process.env.PORT}`));
const io = socketio(server, {
    cors: {
        origin: "http://192.168.100.8:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
})
var users = [];
io.on('connection', (socket) => {
   
    socket.on("setup", (userData) => {
        socket.join(userData);
        socket.emit("connected")
    });
    
    //online users
    socket.on("addUser", (usernm) => {
        socket.user = usernm;
        if (!users.includes(usernm)) {
            users.push(usernm);
        }
        io.emit('users', users)
    })

    socket.on("join chat", (room) => {
        socket.join(room);
    });

    socket.on("new message", (newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if (!chat.users) return 
        chat.users.forEach((user) => {
            if (user._id != newMessageRecieved.sender._id) {
                socket.in(user._id).emit("message received", newMessageRecieved);
            }
        });
    });

    socket.on("new Document", (newDocumentRecieved) => {
        var chat = newDocumentRecieved.chat;
        if (!chat.users) return 
        chat.users.forEach((user) => {
            if (user._id == newDocumentRecieved.sender._id) return;
            else {
                socket.in(user._id).emit("Document received", newDocumentRecieved);
            }
        });
    });

    socket.on("typing", (data) => {
        socket.to(data.chatId).emit("typingStarted", data)
    });
    socket.on("stop typing", (data) => {
        socket.to(data.chatId).emit("stop typing", data)
    });

    //when user close the window/tab
    socket.on('disconnect', () => {
        if (socket.user) {
            let position = users.indexOf(socket.user);
            users.splice(position, 1);
            socket.broadcast.emit('users', users);
        }
    })

    socket.on("removeUser", (usernm) => {
        if (users.includes(usernm)) {
            let position = users.indexOf(usernm);
            users.splice(position, 1);
            socket.broadcast.emit('users', users);
        }
        else {
           return
        }
    })
});