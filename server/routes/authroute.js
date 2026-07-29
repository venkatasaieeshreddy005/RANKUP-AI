const express=require("express");
const router = express.Router({ mergeParams: true });
const { googleAuth, logout } = require("../controllers/authcontroller");

const multer  = require('multer');

router.post("/googleauth",googleAuth);
router.get("/logout",logout)



module.exports=router;