if(process.env.NODE_ENV!="production"){
    require("dotenv").config();
}
const express=require("express");
const connectdb=require("./config/connectdb.js");
const cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter=require("./routes/authroute.js");
const userRoute=require("./routes/userroute.js");


connectdb();

const app=express();

app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true
    }
))

const PORT=process.env.PORT;




app.listen(PORT,()=>{
    console.log(`server is running at port ${PORT}`);
});



app.use(express.json());
app.use(cookieParser());



app.use("/api/auth",authRouter);
app.use("/api/user",userRoute);


// app.get("/",(req,res)=>{
//     res.send("hi welcome");
// });