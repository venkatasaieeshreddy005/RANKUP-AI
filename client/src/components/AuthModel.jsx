import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import { motion } from "framer-motion";

import Auth from "../pages/Auth";

function AuthModel({ onClose }) {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) {
      onClose();
    }
  }, [userData, onClose]);

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-md px-3 sm:px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.15 }}
        className="relative w-full max-w-sm sm:max-w-md"
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-20 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center transition-colors duration-150"
        >
          <FaTimes className="text-xs" />
        </button>

        <Auth isModal={true} />
      </motion.div>
    </div>
  );
}

export default AuthModel;