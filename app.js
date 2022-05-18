const express = require('express');
const mongoose = require("mongoose")
const cors = require('cors');
const dotenv = require("dotenv");
const fileUpload = require('express-fileupload');


const authRoute = require("./routes/auth/auth")
const crudRoute = require("./routes/crud/crud.routes")

dotenv.config()
const app = express();
const port = process.env.PORT || 4000;

app.use(fileUpload({
    createParentPath: true
}));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.get("/uploads/*", (req, res) => res.sendFile(req.url, {root: './'}))
app.use(express.static(__dirname+'/uploads'));
app.use("/api/auth", authRoute)
app.use("/api/crud", crudRoute)

app.get('/health', (req, res) => {
    res.send(true)
})

const uri = process.env.ATLAS_URI;
mongoose.connect(
    uri,
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

app.listen(port, () => console.log(`server running on port ${port}`))
