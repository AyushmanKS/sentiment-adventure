import React, { useState, useEffect } from "react";

const SliderDisplay = ({ step, onAnswer }) => {
  const [isQuestionComplete, setIsQuestionComplete] = useState(false);
  const [sliderValue, setSliderValue] = useState(50);

  useEffect(() => {
    setIsQuestionComplete(false);
    setSliderValue(50);
  }, [step]);

  const checkAnswer = () => {
    const [min, max] = step.answerRange;
    const isCorrect = sliderValue >= min && sliderValue <= max;
    onAnswer(isCorrect);
    if (isCorrect) setIsQuestionComplete(true);
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-4">{step.question}</h3>
      <p className="font-semibold text-xl mb-4 p-3 bg-white/70 rounded-lg">
        {step.sentence}
      </p>
      <input
        type="range"
        min="0"
        max="100"
        value={sliderValue}
        onChange={(e) => setSliderValue(e.target.value)}
        disabled={isQuestionComplete}
        className="w-full"
      />
      <div className="flex justify-between w-full text-sm font-bold mt-2">
        <span>{step.labels[0]}</span>
        <span>{step.labels[1]}</span>
        <span>{step.labels[2]}</span>
      </div>
      {!isQuestionComplete && (
        <button
          onClick={checkAnswer}
          className="mt-6 p-2 bg-teal-500 text-white rounded-lg font-bold"
        >
          Submit Rating
        </button>
      )}
    </div>
  );
};

export default SliderDisplay;
