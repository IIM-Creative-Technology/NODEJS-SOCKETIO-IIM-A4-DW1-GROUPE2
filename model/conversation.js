const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const conversationSchema = new Schema({
    members: {
        type: Array,
        required: true,
        min: 2,
        max: 2
    },
    messages: {
        type: Array,
        required: false,
        sender: Number,
        text: String,
        timestamp: Date.now
    }
})

module.exports = mongoose.model("conversation", conversationSchema)