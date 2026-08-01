const mongoose = require("mongoose");

// Define Embedded Schema for Questions
const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ["easy", "medium", "hard"],
    default: "medium",
  },
  timeLimit: {
    type: Number,
    default: 90,
  },
  answer: {
    type: String,
    default: "",
  },
  confidence: {
    type: Number,
    default: 0,
  },
  communication: {
    type: Number,
    default: 0,
  },
  correctness: {
    type: Number,
    default: 0,
  },
  score: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
    default: "",
  },
});

const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    mode: {
      type: String,
      enum: ["Technical", "HR", "behavioral"], // Added behavioral to match your prompts
      default: "Technical",
    },
    experience: {
      type: String,
      default: "Fresher",
    },
    resumeText: {
      type: String,
      default: "None",
    },
    // Updated to embedded array of question subdocuments
    questions: [questionSchema],

    finalScore: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Incompleted", "completed"],
      default: "Incompleted",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Interview", interviewSchema);