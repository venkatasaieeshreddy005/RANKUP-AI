const fs = require("fs");
const pdfParse = require("pdf-parse");

const { buildInterviewMessages } = require("../services/interviewMessage");
const { buildEvaluationMessages } = require("../services/evaluationPrompt");
const { analyzeResumeWithAI, askAi } = require("../services/openRouterService");

const Interview = require("../models/interview");
const User = require("../models/user");

exports.analyzeResume = async (req, res) => {
  let filePath = null;
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No resume uploaded" });
    }

    filePath = req.file.path;
    const buffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(buffer);
    const resumeText = pdfData.text || "";

    const result = await analyzeResumeWithAI(resumeText);

    return res.status(200).json({
      resumeRole: result?.resumeRole || "",
      experience: result?.experience || "",
      projects: result?.projects || [],
      skills: result?.skills || [],
      resumeText,
    });
  } catch (error) {
    console.error("Resume Error:", error.message);

    return res.status(500).json({
      error: error.message || "Failed to process resume",
    });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error("Delete error:", err.message);
      }
    }
  }
};

exports.generateQuestion = async (req, res) => {
  try {
    let { role, experience, mode, resumeText, projects, skills } = req.body;

    role = role?.trim();
    experience = experience?.trim();
    mode = mode?.trim();

    if (!role || !experience || !mode) {
      return res.status(400).json({ message: "Role, Experience and Mode are required." });
    }

    const user = await User.findOneAndUpdate(
      { _id: req.userId, credits: { $gte: 100 } },
      { $inc: { credits: -100 } },
      { returnDocument: "after" }
    );

    if (!user) {
      const existingUser = await User.findById(req.userId);
      if (!existingUser) {
        return res.status(404).json({ message: "User not found." });
      }
      return res.status(400).json({ message: "Not enough credits. Minimum 100 required." });
    }

    const projectText = Array.isArray(projects) && projects.length ? projects.join(", ") : "None";
    const skillsText = Array.isArray(skills) && skills.length ? skills.join(", ") : "None";
    const safeResume = resumeText?.trim() || "None";

    const userPrompt = `
      Role: ${role}
      Experience: ${experience}
      Interview Mode: ${mode}
      Projects: ${projectText}
      Skills: ${skillsText}
      Resume:
      ${safeResume}
    `;

    const messages = buildInterviewMessages(userPrompt);
    let aiResponse;

    try {
      aiResponse = await askAi(messages);
    } catch (aiErr) {
      await User.findByIdAndUpdate(req.userId, { $inc: { credits: 100 } });
      throw aiErr;
    }

    if (!aiResponse || !aiResponse.trim()) {
      await User.findByIdAndUpdate(req.userId, { $inc: { credits: 100 } });
      return res.status(500).json({ message: "AI returned empty response." });
    }

    const questionsArray = aiResponse
      .split("\n")
      .map((q) => q.replace(/^[0-9]+[\.\)]\s*/, "").trim())
      .filter((q) => q.length > 0)
      .slice(0, 6);

    if (questionsArray.length === 0) {
      await User.findByIdAndUpdate(req.userId, { $inc: { credits: 100 } });
      return res.status(500).json({ message: "AI failed to generate questions." });
    }

    const difficulties = ["easy", "medium", "medium", "hard", "medium", "hard"];
    const timeLimits = [60, 90, 90, 120, 90, 120];

    const interview = await Interview.create({
      userId: user._id,
      role,
      experience,
      mode,
      resumeText: safeResume,
      questions: questionsArray.map((q, index) => ({
        question: q,
        difficulty: difficulties[index % difficulties.length],
        timeLimit: timeLimits[index % timeLimits.length],
      })),
    });

    return res.status(200).json({
      interviewId: interview._id,
      creditsLeft: user.credits,
      userName: user.name,
      questions: interview.questions,
    });
  } catch (error) {
    console.error("Generate Question Error:", error);
    return res.status(500).json({ message: error.message || "Failed to generate questions." });
  }
};

exports.submitAnswer = async (req, res) => {
  try {
    const { interviewId, questionIndex, answer, timeTaken } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const question = interview.questions[questionIndex];

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    if (!answer) {
      question.answer = "";
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.score = 0;
      question.feedback = "You did not submit an answer.";

      await interview.save();
      return res.status(200).json({ feedback: question.feedback });
    }

    if (timeTaken > question.timeLimit) {
      question.answer = answer;
      question.confidence = 0;
      question.communication = 0;
      question.correctness = 0;
      question.score = 0;
      question.feedback = "Time limit exceeded. Answer not evaluated.";

      await interview.save();
      return res.status(200).json({ feedback: question.feedback });
    }

    const messages = buildEvaluationMessages(question, answer);
    const aiResponse = await askAi(messages);

    const cleanedJson = aiResponse.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleanedJson);

    question.answer = answer;
    question.confidence = parsed.confidence || 0;
    question.communication = parsed.communication || 0;
    question.correctness = parsed.correctness || 0;
    question.score = parsed.finalScore || 0;
    question.feedback = parsed.feedback || "";

    await interview.save();

    return res.status(200).json({
      feedback: parsed.feedback,
      score: parsed.finalScore,
    });
  } catch (error) {
    console.error("Submit Answer Error:", error);
    return res.status(500).json({ message: "Failed to submit answer" });
  }
};

exports.finishInterview = async (req, res) => {
  try {
    const { interviewId } = req.body;

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found." });
    }

    const totalQuestions = interview.questions.length;

    let totalScore = 0;
    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((question) => {
      totalScore += Number(question.score || 0);
      totalConfidence += Number(question.confidence || 0);
      totalCommunication += Number(question.communication || 0);
      totalCorrectness += Number(question.correctness || 0);
    });

    const finalScore = Number((totalQuestions ? totalScore / totalQuestions : 0).toFixed(1));
    const avgConfidence = Number((totalQuestions ? totalConfidence / totalQuestions : 0).toFixed(1));
    const avgCommunication = Number((totalQuestions ? totalCommunication / totalQuestions : 0).toFixed(1));
    const avgCorrectness = Number((totalQuestions ? totalCorrectness / totalQuestions : 0).toFixed(1));

    interview.finalScore = finalScore;
    interview.status = "completed";

    await interview.save();

    return res.status(200).json({
      finalScore,
      confidence: avgConfidence,
      communication: avgCommunication,
      correctness: avgCorrectness,

      questionWiseScore: interview.questions.map((question) => ({
        question: question.question,
        answer: question.answer,
        score: question.score || 0,
        confidence: question.confidence || 0,
        communication: question.communication || 0,
        correctness: question.correctness || 0,
        feedback: question.feedback || "",
      })),
    });
  } catch (error) {
    console.error("Finish Interview Error:", error);
    return res.status(500).json({ message: error.message || "Failed to finalize interview." });
  }
};

exports.getMyInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ userId: req.userId })
      .sort({ createdAt: -1 })
      .select("role experience mode finalScore status createdAt");

    if (!interview) {
      return res.status(404).json({
        message: "No interview found for this user",
      });
    }

    return res.status(200).json(interview);
  } catch (error) {
    return res.status(500).json({
      message: `Failed to find current user interview: ${error.message}`,
    });
  }
};

exports.getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    const totalQuestions = interview.questions.length;

    let totalConfidence = 0;
    let totalCommunication = 0;
    let totalCorrectness = 0;

    interview.questions.forEach((q) => {
      totalConfidence += q.confidence || 0;
      totalCommunication += q.communication || 0;
      totalCorrectness += q.correctness || 0;
    });

    const avgConfidence = totalQuestions ? totalConfidence / totalQuestions : 0;
    const avgCommunication = totalQuestions ? totalCommunication / totalQuestions : 0;
    const avgCorrectness = totalQuestions ? totalCorrectness / totalQuestions : 0;

    return res.json({
      finalScore: interview.finalScore,
      confidence: Number(avgConfidence.toFixed(1)),
      communication: Number(avgCommunication.toFixed(1)),
      correctness: Number(avgCorrectness.toFixed(1)),
      questionWiseScore: interview.questions,
    });
  } catch (error) {
    return res.status(500).json({
      message: `Failed to find currentUser Interview: ${error.message}`,
    });
  }
};