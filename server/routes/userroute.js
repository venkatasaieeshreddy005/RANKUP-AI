const express=require("express");
const { isAuth } = require("../middleware/isAuth");
const { getCurrentUser } = require("../controllers/usercontroller");
const router = express.Router({ mergeParams: true });

router.get("/currentuser",isAuth,getCurrentUser);

module.exports=router;