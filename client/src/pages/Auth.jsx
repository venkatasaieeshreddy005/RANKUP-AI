import React from "react";
import { RiRobot3Line } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi2";
import { FcGoogle } from "react-icons/fc";

import { signInWithPopup } from "firebase/auth";
import axios from "axios";

import { auth, provider } from "../utils/firebase";
import { serverUrl } from "../App";

import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Auth({ isModal = false }) {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;

      const name = user.displayName;
      const email = user.email;

      const result = await axios.post(
        `${serverUrl}/api/auth/googleauth`,
        { name, email },
        { withCredentials: true }
      );

      
      const userPayload =
        result.data?.user || result.data?.userData || result.data;

      
      dispatch(setUserData(userPayload));
    } catch (error) {
      console.log("Auth Error:", error);
      dispatch(setUserData(null));
    }
  };

  return (
    <div
      className={
        isModal
          ? "w-full"
          : "min-h-screen bg-[#f4f4f4] flex items-center justify-center px-4"
      }
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 sm:p-8 w-full max-w-md">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-black p-3 rounded-2xl">
            <RiRobot3Line className="text-white text-xl" />
          </div>
          <h2 className="font-bold text-xl text-gray-800 tracking-tight">
            Rankup<span className="text-blue-600">.AI</span>
          </h2>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-center text-gray-900 tracking-tight">
          Welcome Back
        </h1>

        <div className="flex justify-center mt-4">
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-200/60 px-4 py-2 rounded-full font-semibold text-xs sm:text-sm">
            <HiSparkles className="text-base" />
            AI Smart Interview Practice
          </div>
        </div>

        <p className="text-center text-gray-500 text-xs sm:text-sm leading-relaxed mt-5">
          Sign in to access AI-powered mock interviews, review continuous
          feedback, and analyze step-by-step performance metrics.
        </p>

        <button
          onClick={handleGoogleAuth}
          className="mt-6 w-full bg-black text-white font-medium rounded-2xl py-3.5 px-4 flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors duration-200 shadow-sm active:scale-95"
        >
          <FcGoogle className="text-xl" />
          Continue with Google
        </button>
      </div>
    </div>
  );
}

export default Auth;