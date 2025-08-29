import React, { useState, useEffect } from "react";

const MappingDisplay = ({ step, onAnswer }) => {
  const [isQuestionComplete, setIsQuestionComplete] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [mappings, setMappings] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [results, setResults] = useState({});

  useEffect(() => {
    setIsQuestionComplete(false);
    setShowReset(false);
    setMappings({});
    setSelectedItem(null);
    setResults({});
  }, [step]);

  const handleItemSelect = (itemId) => {
    if (isQuestionComplete || mappings[itemId]) return;
    setSelectedItem(itemId);
  };
  const handleCategorySelect = (category) => {
    if (!selectedItem) return;
    setMappings((prev) => ({ ...prev, [selectedItem]: category }));
    setSelectedItem(null);
  };
  const checkAnswer = () => {
    let allCorrect = true;
    const newResults = {};
    step.items.forEach((item) => {
      if (mappings[item.id] === item.answer) {
        newResults[item.id] = "correct";
      } else {
        newResults[item.id] = "incorrect";
        allCorrect = false;
      }
    });
    setResults(newResults);
    onAnswer(allCorrect);
    if (allCorrect) setIsQuestionComplete(true);
    else setShowReset(true);
  };
  const handleReset = () => {
    setShowReset(false);
    setMappings({});
    setSelectedItem(null);
    setResults({});
  };

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-4">{step.question}</h3>
      <div className="flex justify-between">
        <div className="w-1/2 space-y-3 pr-4">
          {step.items.map((item) => {
            const isSelected = selectedItem === item.id;
            const mappedCategory = mappings[item.id];
            const result = results[item.id];
            let itemStyle = "bg-white/70";
            if (isSelected) itemStyle = "ring-2 ring-blue-500";
            else if (mappedCategory) itemStyle = "bg-gray-300";
            if (isQuestionComplete) {
              if (result === "correct") itemStyle = "bg-green-300";
              else if (result === "incorrect") itemStyle = "bg-red-300";
            }
            return (
              <button
                key={item.id}
                onClick={() => handleItemSelect(item.id)}
                disabled={!!mappedCategory || isQuestionComplete}
                className={`w-full p-3 rounded-xl text-lg font-semibold shadow-md transition-all text-left ${itemStyle}`}
              >
                {" "}
                {item.text}{" "}
                {mappedCategory && (
                  <span className="font-normal text-sm text-blue-800">
                    → {mappedCategory}
                  </span>
                )}{" "}
              </button>
            );
          })}
        </div>
        <div className="w-1/2 space-y-3 pl-4">
          {step.categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategorySelect(cat)}
              disabled={!selectedItem || isQuestionComplete}
              className="w-full p-3 rounded-xl text-lg font-semibold shadow-md transition-all bg-white/70 disabled:opacity-50 hover:bg-white"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
      {showReset ? (
        <button
          onClick={handleReset}
          className="mt-4 p-2 bg-orange-500 text-white rounded-lg font-bold"
        >
          Try Again
        </button>
      ) : (
        Object.keys(mappings).length === step.items.length &&
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

export default MappingDisplay;
