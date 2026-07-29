const User=require("../models/user.js");
const getToken=require("./token.js");

module.exports.googleAuth = async (req,res)=>{
    try {
        const {name,email}=req.body;

        let user = await User.findOne({email});

        if(!user){
            user = await User.create({
                name,
                email
            });
        }

        let token = await getToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 7*24*60*60*1000
        });

        return res.status(200).json({user});

    } catch (error) {
        console.log(error); // <-- add this
        return res.status(500).json({
            message:"Google Authentication error",
            error:error.message
        });
    }
};

module.exports.logout=async (req,res)=>{
    try {
        await res.clearCookie("token");
        return res.status(500).json({message:"Logout Successfully"});
    } catch (error) {
        return res.status(500).json({message:"Logout error"});
        
    }
};


