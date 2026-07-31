const express = require("express");
const { isAuth } = require("../middleware/isAuth");
const { analyzeResume } = require("../controllers/interview");
const upload = require("../middleware/multer"); // Make sure this path matches where your multer middleware is located

const router = express.Router({ mergeParams: true });

router.post("/resume", isAuth, upload.single("resume"), analyzeResume);

module.exports = router;