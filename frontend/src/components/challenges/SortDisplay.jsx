import React, { useState, useEffect } from "react";

const SortDisplay = ({ step, onAnswer }) => {
  const [isQuestionComplete, setIsQuestionComplete] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [bins, setBins] = useState(null);

  useEffect(() => {
    setIsQuestionComplete(false);
    setShowReset(false);
    setBins({ [step.bins[0]]: [], [step.bins[1]]: [], unsorted: step.items });
  }, [step]);

  const handleDragStart = (e, item) =>
    e.dataTransfer.setData("item", JSON.stringify(item));
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, targetBin) => {
    const item = JSON.parse(e.dataTransfer.getData("item"));
    const newBins = {
      ...bins,
      unsorted: bins.unsorted.filter((i) => i.id !== item.id),
    };
    if (!newBins[targetBin].find((i) => i.id === item.id))
      newBins[targetBin].push(item);
    setBins(newBins);
  };
  const checkAnswer = () => {
    const isCorrect = step.items.every((item) =>
      bins[item.category].find((i) => i.id === item.id)
    );
    onAnswer(isCorrect);
    if (isCorrect) setIsQuestionComplete(true);
    else setShowReset(true);
  };
  const handleReset = () => {
    setShowReset(false);
    setBins({ [step.bins[0]]: [], [step.bins[1]]: [], unsorted: step.items });
  };

  if (!bins) return null;

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-4">{step.question}</h3>
      <div className="flex justify-center gap-4 mb-4 min-h-[48px]">
        {bins.unsorted.map((item) => (
          <div
            key={item.id}
            draggable
            onDragStart={(e) => handleDragStart(e, item)}
            className="p-2 bg-blue-200 rounded-md cursor-grab"
          >
            {item.text}
          </div>
        ))}
      </div>
      <div className="flex gap-4">
        {step.bins.map((binName) => (
          <div
            key={binName}
            onDrop={(e) => handleDrop(e, binName)}
            onDragOver={handleDragOver}
            className={`w-1/2 p-4 border-2 border-dashed rounded-lg min-h-[100px] ${
              binName === "Positive" ? "border-green-400" : "border-red-400"
            }`}
          >
            <h4 className="font-bold mb-2">{binName}</h4>
            {bins[binName].map((item) => (
              <div key={item.id} className="p-2 bg-gray-200 rounded-md mb-2">
                {item.text}
              </div>
            ))}
          </div>
        ))}
      </div>
      {showReset ? (
        <button
          onClick={handleReset}
          className="mt-4 p-2 bg-orange-500 text-white rounded-lg font-bold"
        >
          Try Again
        </button>
      ) : (
        bins.unsorted.length === 0 &&
        !isQuestionComplete && (
          <button
            onClick={checkAnswer}
            className="mt-4 p-2 bg-teal-500 text-white rounded-lg font-bold"
          >
            Check Answer
          </button>
        )
      )}
    </div>
  );
};

export default SortDisplay;
