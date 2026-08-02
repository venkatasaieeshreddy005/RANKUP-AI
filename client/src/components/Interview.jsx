import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash, FaSun, FaMoon } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import axios from "axios";

// Update path relative to where this file lives (e.g., src/components/Step2Interview.jsx)
import femaleVideo from "../assets/videos/female-ai.mp4";
import maleVideo from "../assets/videos/male-ai.mp4";
import Timer from "./Timer";

// Import central server URL from App.jsx
import { serverUrl } from "../App.jsx";

function Step2Interview({ interviewData, onFinish }) {
  const {
    interviewId = "INT-SESSION",
    questions = [],
    userName = "Candidate",
  } = interviewData || {};

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(true);

  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const isMicOnRef = useRef(isMicOn);
  const isAIPlayingRef = useRef(isAIPlaying);
  const isRecognizingRef = useRef(false);
  const finalTranscriptRef = useRef("");

  useEffect(() => {
    isMicOnRef.current = isMicOn;
  }, [isMicOn]);

  useEffect(() => {
    isAIPlayingRef.current = isAIPlaying;
  }, [isAIPlaying]);

  const currentQuestion = questions[currentIndex] || {};
  const totalQuestions = questions.length;

  const getQuestionText = (q) => {
    if (!q) return "";
    if (typeof q === "object") return q.question || "";
    return q;
  };

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;

  // --- Speech Recognition Setup ---
  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPiece = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcriptPiece + " ";
        } else {
          interimTranscript += transcriptPiece;
        }
      }

      setAnswer((finalTranscriptRef.current + interimTranscript).trim());
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isRecognizingRef.current = false;
      if (event.error === "not-allowed") {
        alert("Microphone permission denied. Please enable mic access in your browser settings.");
      }
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      if (isMicOnRef.current && !isAIPlayingRef.current) {
        try {
          recognition.start();
        } catch (e) {}
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onstart = null;
        recognitionRef.current.onresult = null;
        recognitionRef.current.onerror = null;
        recognitionRef.current.onend = null;
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const startMic = () => {
    if (
      recognitionRef.current &&
      !isAIPlayingRef.current &&
      isMicOnRef.current &&
      !isRecognizingRef.current
    ) {
      try {
        recognitionRef.current.start();
      } catch (e) {}
    }
  };

  const stopMic = () => {
    if (recognitionRef.current && isRecognizingRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      isMicOnRef.current = false;
      stopMic();
      setIsMicOn(false);
    } else {
      isMicOnRef.current = true;
      setIsMicOn(true);
      startMic();
    }
  };

  // --- Voice Selection ---
  useEffect(() => {
    const loadVoices = () => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, []);

  // --- Speech Output ---
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (
        typeof window === "undefined" ||
        !window.speechSynthesis ||
        !selectedVoice
      ) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();
      setSubtitle(text);

      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");
      const utterance = new SpeechSynthesisUtterance(humanText);
      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        isAIPlayingRef.current = true;
        setIsAIPlaying(true);
        stopMic();
      };

      utterance.onend = () => {
        isAIPlayingRef.current = false;
        setIsAIPlaying(false);
        setSubtitle("");
        if (isMicOnRef.current) startMic();
        resolve();
      };

      utterance.onerror = () => {
        isAIPlayingRef.current = false;
        setIsAIPlaying(false);
        setSubtitle("");
        if (isMicOnRef.current) startMic();
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;
    let isMounted = true;

    const runFlow = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );
        if (!isMounted) return;

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );
        if (!isMounted) return;

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((r) => setTimeout(r, 600));
        if (!isMounted) return;

        if (currentIndex === totalQuestions - 1 && totalQuestions > 1) {
          await speakText("Alright, this is the final question.");
          if (!isMounted) return;
        }

        const qText = getQuestionText(currentQuestion);
        if (qText) await speakText(qText);
      }
    };

    runFlow();

    return () => {
      isMounted = false;
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [selectedVoice, isIntroPhase, currentIndex]);

  // --- Timer Operations ---
  useEffect(() => {
    if (isIntroPhase || !currentQuestion || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isSubmitting, currentQuestion]);

  useEffect(() => {
    const initialTime = currentQuestion?.timeLimit || 60;
    setTimeLeft(initialTime);
  }, [currentIndex, currentQuestion]);

  // --- Handlers from Images ---
  const finishInterview = async () => {
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/finish`,
        { interviewId },
        { withCredentials: true }
      );
      console.log(result.data);
      if (onFinish) {
        onFinish(result.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    stopMic();
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/submit-answer`,
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: (currentQuestion.timeLimit || 60) - timeLeft,
        },
        { withCredentials: true }
      );

      if (result.data?.feedback) {
        setFeedback(result.data.feedback);
        await speakText(result.data.feedback);
      }

      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting answer:", error);
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    finalTranscriptRef.current = "";

    setTimeout(() => {
      if (isMicOnRef.current) startMic();
    }, 500);
  };

  // Timer auto-submit effect from image_f1de53.jpg
  useEffect(() => {
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      handleSubmit();
    }
  }, [timeLeft]);

  // Clean-up effect on unmount from image_f1de53.jpg
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div
      className={`min-h-screen transition-colors duration-300 flex items-center justify-center p-4 sm:p-6 font-sans ${
        isDarkMode
          ? "bg-[#0b0f17] text-slate-100"
          : "bg-gradient-to-br from-slate-100 via-emerald-50/30 to-slate-100 text-slate-800"
      }`}
    >
      <div
        className={`w-full max-w-[1440px] min-h-[88vh] lg:h-[90vh] rounded-3xl border transition-all duration-300 overflow-hidden flex flex-col lg:flex-row shadow-2xl ${
          isDarkMode
            ? "bg-[#111827]/95 border-slate-800/80 shadow-emerald-950/20"
            : "bg-white/95 backdrop-blur-xl border-slate-200/80 shadow-slate-300/40"
        }`}
      >
        {/* Left Side: Avatar and Controls */}
        <div
          className={`w-full lg:w-[35%] p-5 space-y-4 border-b lg:border-b-0 lg:border-r flex flex-col items-center justify-between ${
            isDarkMode
              ? "border-slate-800/80 bg-[#0f172a]/30"
              : "border-slate-200/70 bg-slate-50/50"
          }`}
        >
          <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-slate-700/40 bg-black flex items-center justify-center">
            <video
              ref={videoRef}
              src={videoSource}
              key={videoSource}
              autoPlay
              loop
              muted
              playsInline
              className="w-full aspect-video object-contain"
            />
            <div
              className={`absolute top-3 left-3 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-medium border flex items-center gap-2 ${
                isDarkMode
                  ? "bg-slate-950/70 border-slate-700/50 text-slate-200"
                  : "bg-white/80 border-gray-200/60 text-slate-700 shadow-sm"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isAIPlaying ? "bg-emerald-500 animate-pulse" : "bg-emerald-400"
                }`}
              />
              {isAIPlaying ? "AI Speaking" : "AI Evaluator Active"}
            </div>
          </div>

          {subtitle && (
            <div
              className={`w-full max-w-md p-3 rounded-xl border text-center transition-all ${
                isDarkMode
                  ? "bg-slate-900/90 border-slate-700/60 text-slate-200"
                  : "bg-slate-100 border-slate-200 text-slate-700"
              }`}
            >
              <p className="text-xs sm:text-sm font-medium leading-relaxed">
                "{subtitle}"
              </p>
            </div>
          )}

          <div
            className={`w-full border rounded-2xl p-3.5 space-y-2.5 ${
              isDarkMode
                ? "bg-[#0b0f17]/80 border-slate-800"
                : "bg-white border-slate-200 shadow-sm"
            }`}
          >
            <div className="flex justify-between items-center text-xs font-medium">
              <span className={isDarkMode ? "text-slate-400" : "text-slate-500"}>
                Interview Status
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  isAIPlaying
                    ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                    : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAIPlaying
                      ? "bg-emerald-500 animate-ping"
                      : "bg-slate-400"
                  }`}
                />
                {isAIPlaying ? "AI Speaking" : "Listening"}
              </span>
            </div>

            <div className={`h-px ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`} />

            <div className="flex justify-center py-1">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
                isDarkMode={isDarkMode}
              />
            </div>

            <div className={`h-px ${isDarkMode ? "bg-slate-800" : "bg-slate-100"}`} />

            <div className="grid grid-cols-2 gap-3 text-center">
              <div
                className={`p-2 rounded-xl border ${
                  isDarkMode
                    ? "bg-[#111827] border-slate-800"
                    : "bg-emerald-50/40 border-emerald-100"
                }`}
              >
                <span className="block text-xl font-bold text-emerald-500">
                  {currentIndex + 1}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Current Question
                </span>
              </div>
              <div
                className={`p-2 rounded-xl border ${
                  isDarkMode
                    ? "bg-[#111827] border-slate-800"
                    : "bg-slate-50 border-slate-200"
                }`}
              >
                <span
                  className={`block text-xl font-bold ${
                    isDarkMode ? "text-slate-200" : "text-slate-700"
                  }`}
                >
                  {totalQuestions}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  Total Questions
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Questions, Answers & Action Panel */}
        <div className="w-full lg:w-[65%] p-6 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <span
              className={`text-xs sm:text-sm font-medium tracking-wide ${
                isDarkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Session ID:{" "}
              <strong className="text-emerald-500 font-semibold">
                #{interviewId}
              </strong>
            </span>

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

          <div
            className={`p-6 sm:p-7 rounded-2xl border transition-all ${
              isDarkMode
                ? "bg-[#0b0f17]/90 border-slate-800"
                : "bg-slate-50/80 border-slate-200/80 shadow-sm"
            }`}
          >
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-emerald-500 mb-2">
              Question {currentIndex + 1} of {totalQuestions}
            </span>

            <p
              className={`text-lg sm:text-xl font-semibold leading-relaxed ${
                isDarkMode ? "text-slate-100" : "text-slate-800"
              }`}
            >
              {isIntroPhase
                ? "Getting session ready..."
                : getQuestionText(currentQuestion) || "No question provided."}
            </p>
          </div>

          <div className="flex-1 flex flex-col min-h-[200px]">
            <textarea
              value={answer}
              onChange={(e) => {
                finalTranscriptRef.current = e.target.value;
                setAnswer(e.target.value);
              }}
              placeholder="Type your response here or speak using the microphone..."
              className={`w-full flex-1 p-5 rounded-2xl resize-none outline-none border transition text-base font-normal ${
                isDarkMode
                  ? "bg-[#0b0f17]/90 border-slate-800 text-slate-100 placeholder-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              }`}
            />
          </div>

          {/* Dynamic Action & Feedback Section from video screenshots */}
          {!feedback ? (
            <div className="flex items-center gap-4 pt-1">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleMic}
                className={`w-14 h-14 flex items-center justify-center rounded-2xl border transition shrink-0 ${
                  isMicOn
                    ? isDarkMode
                      ? "bg-[#0b0f17] border-slate-800 text-emerald-400 hover:bg-slate-800"
                      : "bg-slate-100 border-slate-200 text-emerald-600 hover:bg-slate-200"
                    : "bg-rose-500/10 border-rose-500/30 text-rose-500"
                }`}
                title={isMicOn ? "Mute Microphone" : "Unmute Microphone"}
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-2xl shadow-lg hover:opacity-95 transition font-semibold text-base tracking-wide disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`mt-6 p-5 rounded-2xl border shadow-sm ${
                isDarkMode
                  ? "bg-emerald-950/20 border-emerald-800/40"
                  : "bg-emerald-50 border-emerald-200"
              }`}
            >
              <p className="text-emerald-700 dark:text-emerald-400 font-medium mb-4">
                {feedback}
              </p>

              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1 font-semibold"
              >
                Next Question <BsArrowLeft size={18} className="rotate-180" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;