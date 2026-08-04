const mongoose = require('mongoose');//this line work as a bridge between node js application and mongodb
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["candidate", "interviewer"],
        default: "candidate"
    }
})
const User = mongoose.model('User', userSchema);
module.exports = User;