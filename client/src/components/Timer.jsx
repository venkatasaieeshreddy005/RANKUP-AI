import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer({ timeLeft = 0, totalTime = 60 }) {
  // Prevent division by zero if totalTime isn't loaded yet
  const percentage = totalTime > 0 ? (timeLeft / totalTime) * 100 : 0;

  return (
    <div className="w-20 h-20">
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}`}
        styles={buildStyles({
          textSize: "28px",
          pathColor: "#10b981",  // Emerald green progress track
          textColor: "#ef4444",  // Red countdown text
          trailColor: "#e5e7eb", // Light gray background ring
        })}
      />
    </div>
  );
}

export default Timer;