import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaUserTie, 
  FaBriefcase, 
  FaFileUpload, 
  FaMicrophoneAlt, 
  FaChartLine 
} from 'react-icons/fa';
import axios from 'axios';
import { setUserData } from '../redux/userSlice';
import { serverUrl } from "../App";

function Step1SetUp({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [resumeRole, setResumeRole] = useState("");
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");

  const [resumeFile, setResumeFile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;

    setAnalyzing(true);

    const formdata = new FormData();
    formdata.append("resume", resumeFile);

    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/resume`,
        formdata,
        { withCredentials: true }
      );

      const data = result.data.data || result.data;

      setResumeRole(data.resumeRole || "");
      setExperience(data.experience || "");
      setProjects(data.projects || []);
      setSkills(data.skills || []);
      setResumeText(data.resumeText || "");

      if (data.resumeRole) {
        setRole(data.resumeRole);
      }

      setAnalysisDone(true);
    } catch (error) {
      console.error("Resume Upload Failed:", error);
      alert("Failed to analyze resume. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    if (!role || !experience) {
      alert("Please enter both Role and Experience.");
      return;
    }

    setLoading(true);

    // Normalize projects and skills so the backend receives clean string arrays
    const formattedProjects = projects.map((p) =>
      typeof p === "object" ? p.name || JSON.stringify(p) : String(p)
    );
    const formattedSkills = skills.map((s) =>
      typeof s === "object" ? s.name || JSON.stringify(s) : String(s)
    );

    const payload = {
      role: role.trim(),
      experience: experience.trim(),
      mode,
      resumeText: resumeText || "",
      projects: formattedProjects,
      skills: formattedSkills,
    };

    try {
      const result = await axios.post(
        `${serverUrl}/api/interview/generate-questions`,
        payload,
        { withCredentials: true }
      );

      if (userData && result.data?.creditsLeft !== undefined) {
        dispatch(
          setUserData({
            ...userData,
            credits: result.data.creditsLeft,
          })
        );
      }

      onStart(result.data);
    } catch (error) {
      console.error("Error generating questions:", error);
      const serverMessage =
        error.response?.data?.message ||
        "Failed to start interview. Server error (500). Check backend logs.";
      alert(serverMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4"
    >
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl grid md:grid-cols-2 overflow-hidden">
        
        {/* Left Column */}
        <motion.div
          initial={{ x: -80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-br from-green-50 to-green-100 p-12 flex flex-col justify-center"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            Start Your AI Interview
          </h2>
          <p className="text-gray-600 mb-10">
            Practice real interview scenarios powered by AI.
            Improve communication, technical skills, and confidence.
          </p>

          <div className="space-y-5">
            {[
              {
                icon: <FaUserTie className="text-green-600 text-xl" />,
                text: "Choose Role & Experience",
              },
              {
                icon: <FaMicrophoneAlt className="text-green-600 text-xl" />,
                text: "Smart Voice Interview",
              },
              {
                icon: <FaChartLine className="text-green-600 text-xl" />,
                text: "Performance Analytics",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.15 }}
                whileHover={{ scale: 1.03 }}
                className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm cursor-pointer"
              >
                {item.icon}
                <span className="text-gray-700 font-medium">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Column / Setup Form */}
        <motion.div
          initial={{ x: 80, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="p-12 bg-white flex flex-col justify-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Interview Setup
          </h2>

          <div className="space-y-6">
            {/* Role Input */}
            <div className="relative">
              <FaUserTie className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Enter role (e.g. Full Stack Developer)"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                onChange={(e) => setRole(e.target.value)}
                value={role}
              />
            </div>

            {/* Experience Input */}
            <div className="relative">
              <FaBriefcase className="absolute top-4 left-4 text-gray-400" />
              <input
                type="text"
                placeholder="Experience (e.g. 2 years)"
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition"
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
              />
            </div>

            {/* Mode Selection */}
            <div>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition bg-white"
              >
                <option value="Technical">Technical Interview</option>
                <option value="HR">HR Interview</option>
              </select>
            </div>

            {/* Resume Upload Area */}
            {!analysisDone && (
              <motion.div
                whileHover={{ scale: 1.02 }}
                onClick={() => document.getElementById("resumeUpload").click()}
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-green-500 hover:bg-green-50 transition flex flex-col items-center justify-center"
              >
                <FaFileUpload className="text-4xl text-green-600 mb-3" />
                <input
                  type="file"
                  accept="application/pdf"
                  id="resumeUpload"
                  className="hidden"
                  onChange={(e) => setResumeFile(e.target.files[0])}
                />
                <p className="text-gray-600 font-medium">
                  {resumeFile ? resumeFile.name : "Click to upload resume (Optional)"}
                </p>

                {/* Analyze Resume Button */}
                {resumeFile && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUploadResume();
                    }}
                    disabled={analyzing}
                    className="mt-4 bg-gray-900 text-white px-5 py-2 rounded-xl hover:bg-gray-800 transition font-medium text-sm disabled:opacity-50"
                  >
                    {analyzing ? "Analyzing..." : "Analyze Resume"}
                  </motion.button>
                )}
              </motion.div>
            )}

            {/* Resume Analysis Result Output */}
            {analysisDone && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-4"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  Resume Analysis Result
                </h3>

                {resumeRole && (
                  <div>
                    <p className="font-medium text-gray-700 mb-2">
                      Resume Profile:
                    </p>
                    <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold">
                      {resumeRole}
                    </span>
                  </div>
                )}

                {projects.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Projects:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {projects.map((p, i) => (
                        <li key={i}>
                          <span className="font-medium">
                            {typeof p === 'object' ? p.name : p}
                          </span>
                          {typeof p === 'object' && p.category && (
                            <span className="text-gray-500"> ({p.category})</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {skills.length > 0 && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((s, i) => (
                        <span 
                          key={i} 
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {typeof s === 'object' ? s.name || JSON.stringify(s) : s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Start Button */}
            <motion.button
              onClick={handleStart}
              disabled={!role || !experience || loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-full text-lg font-semibold transition duration-300 shadow-md"
            >
              {loading ? "Starting..." : "Start Interview"}
            </motion.button>
          </div>
        </motion.div>

      </div>
    </motion.div>
  );
}

export default Step1SetUp;