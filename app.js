const express = require('express');
const mongoose = require("mongoose")
const cors = require('cors');
const dotenv = require("dotenv")

const authRoute = require("./routes/auth/auth")
const crudRoute = require("./routes/crud/crud.routes")
const userRoute = require("./routes/user.routes")
const msgRoute = require("./routes/message.routes")
const MessageModel = require('./model/message')

dotenv.config()
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
})
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoute)
app.use("/api/crud", crudRoute)
app.use("/api/user", userRoute)
app.use("/api/msg", msgRoute)

app.get('/health', (req, res) => {
    res.send(true)
})

const usersOnline = [];
io.on('connect', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    socket.on("add-user", (userId) => {
        const data = {
            id: userId,
            socketId: socket.id
        }
        console.log('data', data)
        usersOnline.push(data);
      });
    
    socket.on('send-chat-message', async message => {
        console.log('message', message)
        await MessageModel.create({
            message: { text: message.msg },
            users: [message.from, message.to],
            sender: message.from,
        });
        const sendUserSocket = usersOnline.find(user => user.id === message.to)
        console.log('usersOnline', usersOnline)
        console.log('sendUserSocket', sendUserSocket)
        socket.to(sendUserSocket.socketId).emit("msg-receive", message.msg);
    })
})

const uri = process.env.ATLAS_URI;
mongoose.connect(
    uri,
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

server.listen(port, () => console.log(`server running on port ${port}`))
