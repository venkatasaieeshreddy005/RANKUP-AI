const mongoose = require("mongoose");


const questionsSchema = new mongoose.Schema(

{

question:{
    type:String,
    required:true,
    trim:true
},


difficulty:{
    type:String,
    enum:[
        "easy",
        "medium",
        "hard"
    ],
    default:"medium"
},


timeLimit:{
    type:Number,
    required:true,
    min:0
},


answer:{
    type:String,
    default:"",
    trim:true
},


feedback:{
    type:String,
    default:"",
    trim:true
},


score:{
    type:Number,
    default:0,
    min:0
},


confidence: { type: Number, default: 0, min: 0, max: 10 },
communication: { type: Number, default: 0, min: 0, max: 10 },
correctness: { type: Number, default: 0, min: 0, max: 10 },


},

{
timestamps:true
}

);



module.exports = mongoose.model(
"Question",
questionsSchema
);
