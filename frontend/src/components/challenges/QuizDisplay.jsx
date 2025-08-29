import React, { useState, useEffect } from "react";

const QuizDisplay = ({ step, onAnswer }) => {
  const [isQuestionComplete, setIsQuestionComplete] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);

  useEffect(() => {
    setIsQuestionComplete(false);
    setWrongAnswers([]);
  }, [step]);

  const handleQuizSubmit = (option) => {
    if (isQuestionComplete) return;
    const isCorrect = option === step.answer;
    onAnswer(isCorrect);
    if (isCorrect) {
      setIsQuestionComplete(true);
    } else {
      if (!wrongAnswers.includes(option)) {
        setWrongAnswers((prev) => [...prev, option]);
      }
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-6">{step.question}</h3>
      <div className="space-y-3">
        {step.options.map((option) => {
          const isCorrectAnswer = option === step.answer;
          const wasChosenWrong = wrongAnswers.includes(option);
          let buttonStyle = "bg-white/70 hover:bg-white";
          if (isQuestionComplete && isCorrectAnswer) {
            buttonStyle = "bg-green-300";
          } else if (wasChosenWrong) {
            buttonStyle = "bg-red-300";
          }
          return (
            <button
              key={option}
              onClick={() => handleQuizSubmit(option)}
              disabled={isQuestionComplete}
              className={`block w-full p-3 rounded-xl text-lg font-semibold shadow-md transition-all ${buttonStyle}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizDisplay;
