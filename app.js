const express = require('express');
const mongoose = require("mongoose")
const cors = require('cors');
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');


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

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
/*app.get("/uploads/!*", (req, res) => res.sendFile(req.url, {root: './'}))
app.use(express.static(__dirname+'/uploads'));*/
app.use("/api/auth", authRoute)
app.use("/api/crud", crudRoute)
app.use("/api/user", userRoute)
app.use("/api/msg", msgRoute)

app.get('/health', (req, res) => {
    res.send(true)
})

let usersOnline = [];
io.on('connect', (socket) => {
    console.log(`${socket.id} connected`)
    socket.on("add-user", (userId) => {
        const data = {
            id: userId,
            socketId: socket.id
        }
        if (usersOnline.length > 0) {
            usersOnline.forEach(user => {
                if (user.id !== data.id) {
                    usersOnline.push(data)
                }
                if (user.id === data.id) {
                    user.socketId = data.socketId
                }
            })
        }
        usersOnline.push(data);
    });

    socket.on('send-chat-message', async message => {
        const sendUserSocket = usersOnline.find(user => user.id === message.to)
        if (sendUserSocket) {
            socket.to(sendUserSocket.socketId).emit("msg-receive", message.msg);
        }
        await MessageModel.create({
            message: { text: message.msg },
            users: [message.from, message.to],
            sender: message.from,
        });
    })

    socket.on('disconnect-user', (userId) => {
        usersOnline = usersOnline.filter(user => user.id !== userId)
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
