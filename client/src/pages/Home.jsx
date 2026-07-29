import React, { useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import AuthModel from "../components/AuthModel";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { HiSparkles } from "react-icons/hi2";
import { BsRobot, BsMic, BsClock, BsBarChart, BsFileEarmarkText, BsPeople, BsCodeSlash, BsVolumeUp, BsCreditCard } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";

import Footer from "../components/Footer"

const STEPS = [
  {
    icon: <BsRobot />,
    step: "STEP 01",
    title: "Role & Experience Selection",
    desc: "AI adjusts difficulty based on your selected job role.",
  },
  {
    icon: <BsMic />,
    step: "STEP 02",
    title: "Smart Voice Interview",
    desc: "Dynamic follow-up questions generated from your responses.",
  },
  {
    icon: <BsClock />,
    step: "STEP 03",
    title: "Timer-Based Simulation",
    desc: "Real interview pressure paired with active time tracking.",
  },
];

const CAPABILITIES = [
  {
    image: evalImg,
    icon: <BsBarChart size={18} />,
    title: "AI Answer Evaluation",
    desc: "Scores communication, technical accuracy, and confidence in real time.",
  },
  {
    image: resumeImg,
    icon: <BsFileEarmarkText size={18} />,
    title: "Resume-Based Interview",
    desc: "Tailors dynamic, project-specific questions generated directly from your uploaded resume.",
  },
  {
    image: pdfImg,
    icon: <BsFileEarmarkText size={18} />,
    title: "Downloadable PDF Report",
    desc: "Delivers detailed strengths, weaknesses, and targeted improvement insights.",
  },
  {
    image: analyticsImg,
    icon: <BsBarChart size={18} />,
    title: "History & Analytics",
    desc: "Tracks your overall progress with visual performance graphs and deep topic analysis.",
  },
];

const MODES = [
  {
    image: hrImg,
    icon: <BsPeople size={18} />,
    title: "HR Interview Mode",
    desc: "Behavioral and communication based evaluation.",
  },
  {
    image: techImg,
    icon: <BsCodeSlash size={18} />,
    title: "Technical Mode",
    desc: "Deep technical questioning based on selected role.",
  },
  {
    image: confidenceImg,
    icon: <BsVolumeUp size={18} />,
    title: "Confidence Detection",
    desc: "Basic tone and voice analysis insights.",
  },
  {
    image: creditImg,
    icon: <BsCreditCard size={18} />,
    title: "Credits System",
    desc: "Unlock premium interview sessions easily.",
  },
];

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleProtectedNavigate = useCallback(
    (path) => {
      if (!userData) {
        setShowAuth(true);
        return;
      }
      navigate(path);
    },
    [userData, navigate]
  );

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-gray-900">
      <Navbar />

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 pt-8 sm:pt-12 pb-24 max-w-7xl mx-auto w-full">
      
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-5 sm:mb-6"
        >
          <div className="bg-white border border-gray-200/80 text-gray-700 text-xs sm:text-sm px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-xs">
            <HiSparkles className="text-emerald-500 text-sm" />
            <span className="font-semibold tracking-wide">
              AI-Powered Smart Interview Platform
            </span>
          </div>
        </motion.div>

       
        <div className="text-center max-w-3xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-snug sm:leading-tight text-gray-900"
          >
            Practice Interviews with{" "}
            <span className="inline-block mt-1 sm:mt-0">
              <span className="bg-emerald-100/80 text-emerald-800 px-3 sm:px-4 py-0.5 rounded-xl border border-emerald-200/60 font-black">
                AI Intelligence
              </span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-500 mt-3 sm:mt-4 max-w-xl mx-auto text-xs sm:text-base leading-relaxed px-2 font-normal"
          >
            Role-based mock interviews featuring adaptive follow-ups, real-time voice evaluations, and comprehensive performance metrics.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-row items-center justify-center gap-3 mt-6 sm:mt-8"
          >
            <button
              onClick={() => handleProtectedNavigate("/interview")}
              className="bg-black text-white px-6 sm:px-7 py-2.5 sm:py-3 rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold text-xs sm:text-sm shadow-sm active:scale-95 cursor-pointer"
            >
              Start Interview
            </button>

            <button
              onClick={() => handleProtectedNavigate("/history")}
              className="bg-white text-gray-700 border border-gray-200 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-semibold text-xs sm:text-sm shadow-2xs active:scale-95 cursor-pointer"
            >
              View History
            </button>
          </motion.div>
        </div>

       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-14 mb-28 px-2">
          {STEPS.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group relative bg-white border border-gray-200/90 rounded-3xl p-7 shadow-xs hover:border-emerald-300/80 transition-all duration-200 flex flex-col justify-between overflow-hidden"
            >
             
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl">
                <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-100/40 to-emerald-50/20 blur-md" />
              </div>

          
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-xl group-hover:scale-105 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200">
                    {item.icon}
                  </div>

                  <span className="text-[11px] font-bold text-gray-400 bg-gray-50 border border-gray-200/80 px-3 py-1 rounded-lg tracking-wider uppercase group-hover:text-emerald-700 group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-colors duration-200">
                    {item.step}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 text-lg mb-2 tracking-tight group-hover:text-emerald-950 transition-colors">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 leading-relaxed font-normal">
                  {item.desc}
                </p>
              </div>

            
              <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

       
        <div className="w-full mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-gray-900 tracking-tight"
          >
            Advanced AI{" "}
            <span className="text-emerald-600">Capabilities</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full px-2">
            {CAPABILITIES.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-emerald-300/80 transition-all duration-300 overflow-hidden"
              >
                
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-100/40 to-emerald-50/20 blur-md" />
                </div>

              
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                 
                  <div className="w-full md:w-5/12 flex justify-center items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-contain max-h-36 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  
                  <div className="w-full md:w-7/12 flex flex-col justify-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200">
                      {item.icon}
                    </div>

                    <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1.5 tracking-tight group-hover:text-emerald-950 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>

                
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>

        
        <div className="w-full mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl font-extrabold text-center mb-12 text-gray-900 tracking-tight"
          >
            Multiple Interview{" "}
            <span className="text-emerald-600">Modes</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full px-2">
            {MODES.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="group relative bg-white border border-gray-200/90 rounded-2xl p-5 sm:p-6 shadow-xs hover:border-emerald-300/80 transition-all duration-300 overflow-hidden"
              >
               
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-100/40 to-emerald-50/20 blur-md" />
                </div>

                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 sm:gap-6">
                 
                  <div className="w-full md:w-5/12 flex justify-center items-center">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-auto object-contain max-h-36 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>


                  <div className="w-full md:w-7/12 flex flex-col justify-center">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-200">
                      {item.icon}
                    </div>

                    <h3 className="font-bold text-gray-900 text-base sm:text-lg mb-1.5 tracking-tight group-hover:text-emerald-950 transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>

                
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl group-hover:scale-125 transition-transform duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />};
        <Footer/>


    </div>
  );
}

export default Home;