const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const crudSchema = new Schema({
    title:{
        type: String,
        max: 4,
        required: true,
    },
    description:{
        type: String,
        min: 10,
        max: 255,
        required: true,
    },
    postTime:{
        type: Date,
        default: Date.now
    },
    updateTime:{
        type: Date,
        default: Date.now()
    }
})


module.exports = mongoose.model("crud", crudSchema)
