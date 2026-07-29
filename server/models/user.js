const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema=new Schema({

    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    credits:{
        type:Number,
        default:100
    }

},{timestamps:true});

const User=mongoose.model("User",userSchema);
module.exports= User;
