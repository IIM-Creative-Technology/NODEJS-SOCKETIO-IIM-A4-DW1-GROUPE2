const express = require('express');
const mongoose = require("mongoose")
const cors = require('cors');
const dotenv = require("dotenv")

dotenv.config()
const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const uri = process.env.ATLAS_URI;
mongoose.connect(
    uri,
);

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

app.listen(port, () => console.log(`server running on port ${port}`))