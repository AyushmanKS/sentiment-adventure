import React from "react";
import { motion } from "framer-motion";

const sidebarVariants = {
  closed: { x: "-100%" },
  open: { x: 0 },
};

const LevelButton = ({ level, title, isUnlocked, isActive, onClick }) => {
  const baseStyle =
    "w-full text-left p-3 rounded-lg font-bold transition-all duration-300";
  const activeStyle = "bg-[var(--color-teal)] text-white shadow-md";
  const unlockedStyle = "hover:bg-[var(--color-peach)]";
  const lockedStyle = "bg-gray-300 text-gray-500 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      disabled={!isUnlocked}
      className={`${baseStyle} ${
        isActive ? activeStyle : isUnlocked ? unlockedStyle : lockedStyle
      }`}
    >
      Level {level}: {title}
    </button>
  );
};

const SidePanel = ({
  levels,
  currentLevel,
  userLevel,
  setCurrentLevel,
  setIsOpen,
}) => {
  return (
    <motion.div
      variants={sidebarVariants}
      initial="closed"
      animate="open"
      exit="closed"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 w-80 bg-white/80 backdrop-blur-lg p-6 h-full shadow-2xl z-50"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-extrabold text-[var(--color-teal-dark)]">
          Sentiment Adventure
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 rounded-full hover:bg-black/10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      <div className="space-y-3">
        {levels.map((level) => (
          <LevelButton
            key={level.level}
            level={level.level}
            title={level.title}
            isUnlocked={level.level <= userLevel}
            isActive={level.level === currentLevel}
            onClick={() => {
              if (level.level <= userLevel) {
                setCurrentLevel(level.level);
                setIsOpen(false);
              }
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default SidePanel;
