import React, { useState, useEffect } from "react";

const OrderDisplay = ({ step, onAnswer }) => {
  const [isQuestionComplete, setIsQuestionComplete] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [items, setItems] = useState(null);

  useEffect(() => {
    setIsQuestionComplete(false);
    setShowReset(false);
    setItems(step.items);
  }, [step]);

  const handleDragStart = (e, item) =>
    e.dataTransfer.setData("item", JSON.stringify(item));
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (e, dropIndex) => {
    const itemJSON = e.dataTransfer.getData("item");
    if (!itemJSON) return;
    const item = JSON.parse(itemJSON);
    const newItems = items.filter((i) => i !== item.id);
    newItems.splice(dropIndex, 0, item.id);
    setItems(newItems);
  };
  const checkAnswer = () => {
    const isCorrect = items.every(
      (item, index) => item === step.correctOrder[index]
    );
    onAnswer(isCorrect);
    if (isCorrect) setIsQuestionComplete(true);
    else setShowReset(true);
  };
  const handleReset = () => {
    setShowReset(false);
    setItems(step.items);
  };

  if (!items) return null;

  return (
    <div className="w-full">
      <h3 className="text-2xl font-bold mb-4">{step.question}</h3>
      <div className="p-4 bg-white/70 rounded-lg min-h-[200px]">
        {items.map((item, index) => (
          <div
            key={item}
            draggable
            onDragStart={(e) => handleDragStart(e, { id: item })}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
            className="p-3 mb-2 bg-blue-200 rounded-lg cursor-grab flex items-center gap-2"
          >
            <span className="font-bold">{index + 1}.</span> {item}
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
        !isQuestionComplete && (
          <button
            onClick={checkAnswer}
            className="mt-4 p-2 bg-teal-500 text-white rounded-lg font-bold"
          >
            Check Order
          </button>
        )
      )}
    </div>
  );
};

export default OrderDisplay;
