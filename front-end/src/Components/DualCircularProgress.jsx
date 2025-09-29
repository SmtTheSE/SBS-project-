import React from "react";

const DualCircularProgress = ({ studentRate, teacherRate, className }) => {
  const size = 150; // chart size
  const strokeWidth = 5; // circle thickness
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const calcOffset = (percent) =>
    circumference - (percent / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Outer Circle - Students */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E5E7EB" // light gray background
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1E3A8A" // blue color
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={calcOffset(studentRate)}
          strokeLinecap="round"
        />

        {/* Inner Circle - Teachers */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 20}
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius - 20}
          stroke="#F59E0B" // amber/yellow
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={2 * Math.PI * (radius - 20)}
          strokeDashoffset={
            2 * Math.PI * (radius - 20) -
            (teacherRate / 100) * (2 * Math.PI * (radius - 20))
          }
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default DualCircularProgress;
