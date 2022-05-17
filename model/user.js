const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema({
    dateCreation: {
        type: Date,
        default: Date.now
    },
    dateUpdate: {
        type: Date,
        default: Date.now
    },
    username: {
        type: String,
        required: true,
        min: 2,
        max: 255
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 255
    },
    conversation_id: Array,
})

module.exports = mongoose.model("user", userSchema)