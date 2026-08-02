import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Timer({ timeLeft = 30, totalTime = 60, isDarkMode = true }) {
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  return (
    <div className="w-20 h-20">
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}`}
        styles={buildStyles({
          textSize: "28px",
          pathColor: "#10b981", // Emerald green progress ring
          textColor: "#ef4444", // Red timer text
          trailColor: isDarkMode ? "#1e293b" : "#e5e7eb", // Adaptive trail
          strokeLinecap: "round",
        })}
      />
    </div>
  );
}

export default Timer;