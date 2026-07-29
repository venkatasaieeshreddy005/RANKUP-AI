import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { BsCoin } from "react-icons/bs";
import { RiRobot3Line } from "react-icons/ri";
import { FaUserAstronaut, FaHistory } from "react-icons/fa";
import { HiOutlineLogout, HiSparkles, HiShoppingBag } from "react-icons/hi";

import AuthModel from "./AuthModel";
import { setUserData } from "../redux/userSlice";
import { serverUrl } from "../App";

function Navbar() {
  const { userData } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const creditRef = useRef(null);
  const userRef = useRef(null);

  // Close popups when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (creditRef.current && !creditRef.current.contains(event.target)) {
        setShowCreditPopup(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync user session on initial mount if Redux is empty
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(`${serverUrl}/api/auth/me`, {
          withCredentials: true,
        });
        const currentUser =
          response.data?.user || response.data?.userData || response.data;
        if (currentUser && currentUser.email) {
          dispatch(setUserData(currentUser));
        }
      } catch (error) {
        // User not logged in
      }
    };

    if (!userData) {
      fetchCurrentUser();
    }
  }, [dispatch, userData]);

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
    } catch (error) {
      console.log("Logout error:", error);
    } finally {
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
    }
  };

  return (
    <>
      <div className="bg-[#f8f9fa] flex justify-center px-3 sm:px-6 pt-3 relative z-40">
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-6xl bg-white/95 backdrop-blur-md rounded-2xl border border-gray-100 shadow-sm px-4 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center"
        >
          {/* LOGO */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5 cursor-pointer group select-none"
          >
            <div className="bg-black p-2 sm:p-2.5 rounded-xl group-hover:scale-105 transition-transform duration-200">
              <RiRobot3Line className="text-white text-base sm:text-lg" />
            </div>
            <h1 className="font-extrabold text-base sm:text-xl tracking-tight text-gray-900">
              Rankup<span className="text-blue-600">.AI</span>
            </h1>
          </div>

          {/* RIGHT NAVIGATION */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* CREDITS BADGE & POPUP */}
            <div className="relative" ref={creditRef}>
              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  setShowCreditPopup((prev) => !prev);
                  setShowUserPopup(false);
                }}
                className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100/80 border border-amber-200/70 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full transition-all duration-200 shadow-2xs active:scale-95"
              >
                <BsCoin className="text-amber-500 text-sm sm:text-base animate-pulse" />
                <span className="font-bold text-amber-950 text-xs sm:text-sm">
                  {userData?.credits ?? 0}
                </span>
                <span className="hidden sm:inline text-xs font-semibold text-amber-800">
                  Credits
                </span>
              </button>

              <AnimatePresence>
                {showCreditPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-2 w-52 sm:w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-3.5 z-50 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1 bg-amber-100 text-amber-600 rounded-md">
                        <HiSparkles className="text-xs" />
                      </div>
                      <span className="font-bold text-gray-800 text-xs">
                        Need More Credits?
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 leading-relaxed mb-2.5">
                      Get extra credits to unlock unlimited AI mock interviews & instant evaluations.
                    </p>

                    <button
                      onClick={() => {
                        setShowCreditPopup(false);
                        navigate("/pricing");
                      }}
                      className="w-full bg-black text-white text-xs font-semibold py-2 rounded-lg hover:bg-gray-800 transition-colors duration-200 flex items-center justify-center gap-1.5 shadow-2xs active:scale-95"
                    >
                      <HiShoppingBag className="text-xs" />
                      Buy More Credits
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* USER PROFILE & POPUP */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  setShowUserPopup((prev) => !prev);
                  setShowCreditPopup(false);
                }}
                className="w-8 h-8 sm:w-9.5 sm:h-9.5 rounded-full bg-gradient-to-tr from-gray-900 to-gray-700 text-white flex items-center justify-center shadow-2xs hover:shadow-xs hover:scale-105 transition-all duration-200 active:scale-95 border border-white"
              >
                {userData?.name ? (
                  <span className="font-bold text-xs sm:text-sm">
                    {userData.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <FaUserAstronaut className="text-xs sm:text-sm" />
                )}
              </button>

              <AnimatePresence>
                {showUserPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.95 }}
                    transition={{ duration: 0.12 }}
                    className="absolute right-0 mt-2 w-52 sm:w-56 bg-white rounded-xl shadow-xl border border-gray-100 p-1.5 z-50"
                  >
                    {/* User Info Header */}
                    <div className="px-2.5 py-1.5 border-b border-gray-100 mb-1">
                      <p className="font-bold text-gray-900 text-xs truncate">
                        {userData?.name || "User"}
                      </p>
                      {userData?.email && (
                        <p className="text-[10px] text-gray-400 truncate">
                          {userData.email}
                        </p>
                      )}
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-0.5">
                      <button
                        onClick={() => {
                          setShowUserPopup(false);
                          navigate("/history");
                        }}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100/80 transition-colors duration-150"
                      >
                        <FaHistory className="text-gray-400 text-xs" />
                        Interview History
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors duration-150"
                      >
                        <HiOutlineLogout className="text-red-500 text-xs" />
                        Logout
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* AUTH MODAL */}
      <AnimatePresence>
        {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      </AnimatePresence>
    </>
  );
}

export default Navbar;