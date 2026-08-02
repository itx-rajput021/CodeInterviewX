const mongoose = require('mongoose');//this line work as a bridge between node js application and mongodb
const userSchema = new mongoose.Schema({// this is blue print that decide how a user data structured un data base
    name:{
        type: String,
        requried: true
    },

    email:{
        type: String,
        requried: true,
        unique: true
    },
    password:{
        type:String,
        requried:true,



    },
    createedAt:{
        type:Date,
        default:Date.now
    }
});
const User = mongoose.model('User', userSchema);
module.exports = User;