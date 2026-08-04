const express = require("express");
const multer = require("multer");

const {
  analyzeResume,
  generateQuestion,
  submitAnswer,
  finishInterview,
  getMyInterview,
  getInterviewReport,
} = require("../controllers/interview");

const { isAuth } = require("../middleware/isAuth");

const router = express.Router();

const upload = multer({
  storage: multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
});

router.post("/resume", isAuth, upload.single("resume"), analyzeResume);
router.post("/generate-questions", isAuth, generateQuestion);
router.post("/submit-answer", isAuth, submitAnswer);
router.post("/finish", isAuth, finishInterview);

// Endpoints matching frontend calls
router.get("/my-interview", isAuth, getMyInterview);
router.get("/report/:id", isAuth, getInterviewReport);

module.exports = router;