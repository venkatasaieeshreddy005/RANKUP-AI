import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";
import Home from "./pages/Home.jsx";
import Auth from "./pages/Auth.jsx";
import InterviewPage from "./pages/InterviewPage.jsx";
import Pricing from "./pages/Pricing.jsx";
import interviewHistory from "./pages/interviewHistory.jsx";
import interviewReport from "./pages/interviewReport.jsx";


export const serverUrl = "http://localhost:8000";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/currentuser`, {
          withCredentials: true,
        });

        dispatch(setUserData(result.data));
      } catch (error) {
        console.error(
          "Error fetching current user:",
          error.response?.data || error.message
        );

        dispatch(setUserData(null));
      }
    };

    getCurrentUser();
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/interview" element={<InterviewPage />} />
      <Route path="/report" element={<interviewReport />} />
      <Route path="/history" element={<interviewHistory />} />
      <Route path="/pricing" element={<Pricing />} />
    </Routes>
  );
}

export default App;