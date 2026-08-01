import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaMoon, FaSun } from "react-icons/fa";
import femaleVideo from "../assets/videos/female-ai.mp4";
import Timer from "./Timer";

function Interview({ interviewData, onFinish }) {
  const {
    interviewId = "INT-2026-X",
    questions = [
      "Tell me about a challenging technical project you recently completed.",
      "How do you handle performance optimization in React applications?",
      "Explain the key differences between SQL and NoSQL databases.",
      "What strategies do you use for error handling in asynchronous code?",
      "How do you ensure data security and privacy in your web apps?",
      "Do you have any questions for us regarding the engineering team or company culture?"
    ]
  } = interviewData || {};

  const totalQuestions = questions.length;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setAnswer("");
    } else if (onFinish) {
      onFinish();
    }
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex items-center justify-center p-4 sm:p-6 font-sans ${
        isDarkMode
          ? "bg-[#0b0f17] text-slate-100"
          : "bg-gradient-to-br from-slate-100 via-emerald-50/30 to-slate-100 text-slate-800"
      }`}
    >
      {/* Outer Shell - Scaled up for laptop display */}
      <div
        className={`w-full max-w-[1440px] min-h-[88vh] lg:h-[90vh] rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col lg:flex-row shadow-2xl ${
          isDarkMode
            ? "bg-[#111827]/95 border-slate-800/80 shadow-emerald-950/20"
            : "bg-white/95 backdrop-blur-xl border-slate-200/80 shadow-slate-300/40"
        }`}
      >
        {/* ================= LEFT SIDE: VIDEO & TIMER ================= */}
        <div
          className={`w-full lg:w-[35%] p-6 space-y-6 border-b lg:border-b-0 lg:border-r flex flex-col items-center justify-between ${
            isDarkMode
              ? "border-slate-800/80 bg-[#0f172a]/30"
              : "border-slate-200/70 bg-slate-50/50"
          }`}
        >
          {/* AI Avatar Video Frame */}
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-700/40 bg-black/5">
            <video
              src={femaleVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-[220px] sm:h-[260px] lg:h-[280px] object-cover"
            />
            <div
              className={`absolute top-3 left-3 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium border flex items-center gap-2 ${
                isDarkMode
                  ? "bg-slate-950/70 border-slate-700/50 text-slate-200"
                  : "bg-white/80 border-gray-200/60 text-slate-700 shadow-sm"
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              AI Evaluator Active
            </div>
          </div>

          {/* Timer & Status Area */}
          <div
            className={`w-full border rounded-2xl p-5 space-y-4 ${
              isDarkMode
                ? "bg-[#0b0f17]/80 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex justify-between items-center text-xs font-medium">
              <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
                Status
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Listening
              </span>
            </div>

            <div className={`h-px ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`} />

            {/* Circular Timer */}
            <div className="flex justify-center py-2">
              <Timer timeLeft={30} totalTime={60} />
            </div>

            <div className={`h-px ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`} />

            {/* Questions Counter Stats */}
            <div className="grid grid-cols-2 gap-4 text-center">
              <div
                className={`p-3 rounded-xl border ${
                  isDarkMode
                    ? "bg-[#111827] border-slate-800"
                    : "bg-emerald-50/40 border-emerald-100"
                }`}
              >
                <span className="block text-2xl font-bold text-emerald-500">
                  {currentQuestionIndex + 1}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Current Question
                </span>
              </div>
              <div
                className={`p-3 rounded-xl border ${
                  isDarkMode
                    ? "bg-[#111827] border-slate-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <span
                  className={`block text-2xl font-bold ${
                    isDarkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {totalQuestions}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  Total Questions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE: QUESTION & TEXTAREA ================= */}
        <div className="w-full lg:w-[65%] p-6 sm:p-8 flex flex-col justify-between space-y-5">
          
          {/* Header Row: Session ID on Left | Light/Dark Mode on Right */}
          <div className="flex items-center justify-between">
            <span
              className={`text-xs sm:text-sm font-medium tracking-wide ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Session ID: <strong className="text-emerald-500 font-semibold">#{interviewId}</strong>
            </span>

            {/* Top-Right Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`px-3.5 py-1.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-semibold shadow-sm ${
                isDarkMode
                  ? "bg-slate-900 border-slate-700 text-amber-400 hover:bg-slate-800"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isDarkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
              <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
            </button>
          </div>

          {/* Question Display Card */}
          <div
            className={`p-6 sm:p-7 rounded-2xl border transition-all ${
              isDarkMode
                ? "bg-[#0b0f17]/90 border-slate-800"
                : "bg-slate-50/80 border-slate-200/80 shadow-sm"
            }`}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>

            <p
              className={`text-lg sm:text-xl font-semibold leading-relaxed ${
                isDarkMode ? "text-slate-100" : "text-slate-800"
              }`}
            >
              {questions[currentQuestionIndex]}
            </p>
          </div>

          {/* Expanded Textarea Input */}
          <div className="flex-1 flex flex-col min-h-[220px]">
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your response here or click the microphone button below to record..."
              className={`w-full flex-1 p-5 rounded-2xl resize-none outline-none border transition text-base font-normal ${
                isDarkMode
                  ? "bg-[#0b0f17]/90 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              }`}
            />
          </div>

          {/* Bottom Action Bar */}
          <div className="flex items-center gap-4 pt-1">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`w-14 h-14 flex items-center justify-center rounded-2xl border transition shrink-0 ${
                isDarkMode
                  ? "bg-[#0b0f17] border-slate-800 text-emerald-400 hover:bg-slate-800"
                  : "bg-slate-100 border-slate-200 text-emerald-600 hover:bg-slate-200"
              }`}
              title="Mic Toggle"
            >
              <FaMicrophone size={20} />
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl shadow-lg hover:opacity-95 transition font-semibold text-base tracking-wide"
            >
              {currentQuestionIndex === totalQuestions - 1
                ? "Finish Interview"
                : "Submit & Next Question →"}
            </motion.button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default Interview;