import React from "react";
import { BsRobot } from "react-icons/bs";

function Footer() {
  return (
    <footer className="w-full bg-[#f8f9fa] py-12 px-4 flex justify-center">
      <div className="w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200/80 py-8 px-6 text-center">
        <div className="flex justify-center items-center gap-3 mb-3">
          <div className="bg-black text-white p-2 rounded-xl flex items-center justify-center">
            <BsRobot size={16} />
          </div>
          <h2 className="font-bold text-gray-900 text-base">Rankup.AI</h2>
        </div>
        <p className="text-gray-500 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
          AI-powered interview preparation platform designed to improve
          communication skills, technical depth and professional confidence.
        </p>
      </div>
    </footer>
  );
}

export default Footer;