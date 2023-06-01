const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    age:{
        type: Number,
    },
    email:{
        type:String,
    }
})


const UserModel = mongoose.model("users",UserSchema) // the way to show data
module.exports = UserModel