import React, { useState, useEffect } from "react";

const FillInTheBlankDisplay = ({ step, onAnswer }) => {
  const [isQuestionComplete, setIsQuestionComplete] = useState(false);
  const [filledWord, setFilledWord] = useState(null);

  useEffect(() => {
    setIsQuestionComplete(false);
    setFilledWord(null);
  }, [step]);

  const handleFillBlank = (word) => {
    if (isQuestionComplete) return;
    setFilledWord(word);
    const isCorrect = word === step.answer;
    onAnswer(isCorrect);
    if (isCorrect) setIsQuestionComplete(true);
  };

  const isCorrect = filledWord === step.answer;
  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-6">{step.question}</h3>
      <div className="bg-white/70 p-6 rounded-xl text-2xl font-semibold mb-6">
        <span>{step.sentenceParts[0]} </span>
        <span
          className={`inline-block px-4 py-1 rounded-lg ${
            filledWord
              ? isCorrect
                ? "bg-green-300"
                : "bg-red-300"
              : "bg-gray-300"
          }`}
        >
          {filledWord || "_______"}
        </span>
        <span> {step.sentenceParts[1]}</span>
      </div>
      <div className="flex justify-center gap-4">
        {step.options.map((option) => (
          <button
            key={option}
            onClick={() => handleFillBlank(option)}
            disabled={isQuestionComplete}
            className="p-3 rounded-xl text-lg font-semibold shadow-md bg-blue-200 hover:bg-blue-300 disabled:opacity-50"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FillInTheBlankDisplay;
