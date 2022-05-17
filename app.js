const express = require('express');
const mongoose = require("mongoose")
const cors = require('cors');
const dotenv = require("dotenv")

const authRoute = require("./routes/auth/auth")
const crudRoute = require("./routes/crud/crud.routes")
const userRoute = require("./routes/user.routes")

dotenv.config()
const app = express();
const server = require('http').Server(app)
const io = require('socket.io')(server)
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoute)
app.use("/api/crud", crudRoute)
app.use("/api/user", userRoute)

app.get('/health', (req, res) => {
    res.send(true)
})

io.on('connect', (socket) => {
    console.log(`Connecté au client ${socket.id}`)
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', { message })
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
