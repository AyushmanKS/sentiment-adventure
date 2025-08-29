import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CleanupDisplay = ({ step, onAnswer }) => {
  const [isQuestionComplete, setIsQuestionComplete] = useState(false);
  const [cleanedWords, setCleanedWords] = useState([]);

  useEffect(() => {
    setIsQuestionComplete(false);
    setCleanedWords([]);
  }, [step]);

  const handleCleanupClick = (word) => {
    if (isQuestionComplete) return;
    if (!cleanedWords.includes(word)) {
      const newWords = [...cleanedWords, word];
      setCleanedWords(newWords);
      const allWordsRemoved = step.wordsToRemove.every((w) =>
        newWords.includes(w)
      );
      if (allWordsRemoved) {
        onAnswer(true);
        setIsQuestionComplete(true);
      }
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-6">{step.question}</h3>
      <div className="bg-white/70 p-4 rounded-xl text-xl font-semibold flex flex-wrap gap-x-2 gap-y-2">
        {step.sentence.split(" ").map((word, index) => {
          const shouldBeRemoved = step.wordsToRemove.includes(word);
          const isRemoved = cleanedWords.includes(word);
          if (shouldBeRemoved) {
            return (
              <motion.button
                key={index}
                onClick={() => handleCleanupClick(word)}
                disabled={isQuestionComplete}
                className={`px-2 py-1 rounded-md transition-all ${
                  isRemoved
                    ? "bg-red-200 text-red-500 line-through"
                    : "bg-blue-200 hover:bg-blue-300"
                }`}
                whileTap={{ scale: 0.9 }}
              >
                {word}
              </motion.button>
            );
          }
          return <span key={index}>{word}</span>;
        })}
      </div>
    </div>
  );
};

export default CleanupDisplay;
