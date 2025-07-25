const express = require("express");
const router = express.Router();

router.get('/', (req,res)=>{
    // console.log(req.user);
    // console.log("req for login status on app render received");
    if(req.user==null){
        return res.json({message:"Not logged in", success:false});
    }
    const user = req.user;
    return res.status(200).json({message:"Already logged in!", success:true, user})
})


router.post('/logout',(req,res)=>{
    // console.log("logout req received!");
    res.clearCookie("token",{
        httpOnly: true,
        sameSite: "Lax",
        secure: false,
    })
    return res.status(200).json({success:true, message:"Logged out!"});
});

module.exports=router;