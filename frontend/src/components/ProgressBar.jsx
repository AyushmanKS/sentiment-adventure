import React from "react";
import { motion } from "framer-motion";

const ProgressBar = ({ completed, total }) => {
  const progressPercentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1 text-sm font-bold">
        <span className="text-gray-700">Gloomy's Learning Progress</span>
        <span className="text-gray-600">
          {completed} / {total} Tasks Complete
        </span>
      </div>
      <div className="w-full bg-white/50 rounded-full h-5 p-1 shadow-inner">
        <motion.div
          className="bg-[var(--color-gold)] h-full rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
