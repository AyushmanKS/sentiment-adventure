import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const ContentDisplay = ({ step, onAnswer }) => {
  const [isQuestionComplete, setIsQuestionComplete] = useState(false);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [cleanedWords, setCleanedWords] = useState([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [sortBins, setSortBins] = useState(null);
  const [orderedItems, setOrderedItems] = useState(null);
  const [mappings, setMappings] = useState({});
  const [selectedItem, setSelectedItem] = useState(null);
  const [mappingResults, setMappingResults] = useState({});
  const [showReset, setShowReset] = useState(false);
  const [sentenceWords, setSentenceWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [filledWord, setFilledWord] = useState(null);

  useEffect(() => {
    setIsQuestionComplete(false);
    setWrongAnswers([]);
    setShowReset(false);
    if (step.type === "cleanup") setCleanedWords([]);
    if (step.type === "slider") setSliderValue(50);
    if (step.type === "sort")
      setSortBins({
        [step.bins[0]]: [],
        [step.bins[1]]: [],
        unsorted: step.items,
      });
    if (step.type === "order") setOrderedItems(step.items);
    if (step.type === "mapping") {
      setMappings({});
      setSelectedItem(null);
      setMappingResults({});
    }
    if (step.type === "sandbox") {
      setSentenceWords([]);
      setIsLoading(false);
      setPrediction(null);
      setLoadingProgress(0);
    }
    if (step.type === "fill-in-the-blank") setFilledWord(null);
  }, [step.question]);

  const handleFillBlank = (word) => {
    if (isQuestionComplete) return;
    setFilledWord(word);
    const isCorrect = word === step.answer;
    onAnswer(isCorrect);
    if (isCorrect) setIsQuestionComplete(true);
  };
  const handleQuizSubmit = (option) => {
    if (isQuestionComplete) return;
    const isCorrect = option === step.answer;
    onAnswer(isCorrect);
    if (isCorrect) setIsQuestionComplete(true);
    else if (!wrongAnswers.includes(option))
      setWrongAnswers((prev) => [...prev, option]);
  };
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
  const handleDragStart = (e, item) =>
    e.dataTransfer.setData("item", JSON.stringify(item));
  const handleDragOver = (e) => e.preventDefault();
  const handleSortDrop = (e, targetBin) => {
    const item = JSON.parse(e.dataTransfer.getData("item"));
    const newBins = {
      ...sortBins,
      unsorted: sortBins.unsorted.filter((i) => i.id !== item.id),
    };
    if (!newBins[targetBin].find((i) => i.id === item.id))
      newBins[targetBin].push(item);
    setSortBins(newBins);
  };
  const handleOrderDrop = (e, dropIndex) => {
    const itemJSON = e.dataTransfer.getData("item");
    if (!itemJSON) return;
    const item = JSON.parse(itemJSON);
    const newItems = orderedItems.filter((i) => i !== item.id);
    newItems.splice(dropIndex, 0, item.id);
    setOrderedItems(newItems);
  };
  const checkSortAnswer = () => {
    const isCorrect = step.items.every((item) =>
      sortBins[item.category].find((i) => i.id === item.id)
    );
    onAnswer(isCorrect);
    if (isCorrect) setIsQuestionComplete(true);
    else setShowReset(true);
  };
  const checkOrderAnswer = () => {
    const isCorrect = orderedItems.every(
      (item, index) => item === step.correctOrder[index]
    );
    onAnswer(isCorrect);
    if (isCorrect) setIsQuestionComplete(true);
    else setShowReset(true);
  };
  const checkSliderAnswer = () => {
    const [min, max] = step.answerRange;
    const isCorrect = sliderValue >= min && sliderValue <= max;
    onAnswer(isCorrect);
    if (isCorrect) setIsQuestionComplete(true);
  };
  const handleItemSelect = (itemId) => {
    if (isQuestionComplete || mappings[itemId]) return;
    setSelectedItem(itemId);
  };
  const handleCategorySelect = (category) => {
    if (!selectedItem) return;
    setMappings((prev) => ({ ...prev, [selectedItem]: category }));
    setSelectedItem(null);
  };
  const checkMappingAnswer = () => {
    let allCorrect = true;
    const results = {};
    step.items.forEach((item) => {
      if (mappings[item.id] === item.answer) {
        results[item.id] = "correct";
      } else {
        results[item.id] = "incorrect";
        allCorrect = false;
      }
    });
    setMappingResults(results);
    onAnswer(allCorrect);
    if (allCorrect) setIsQuestionComplete(true);
    else setShowReset(true);
  };
  const handleReset = () => {
    setShowReset(false);
    if (step.type === "sort")
      setSortBins({
        [step.bins[0]]: [],
        [step.bins[1]]: [],
        unsorted: step.items,
      });
    if (step.type === "order") setOrderedItems(step.items);
    if (step.type === "mapping") {
      setMappings({});
      setSelectedItem(null);
      setMappingResults({});
    }
  };

  const handleWordSelect = (word) =>
    setSentenceWords((prev) => [...prev, word]);

  const handleSandboxReset = () => {
    setSentenceWords([]);
    setPrediction(null);
    onAnswer(null); // Resets the robot's emotion
  };

  const handlePredict = () => {
    setIsLoading(true);
    setPrediction(null);
    setLoadingProgress(0);
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + 2;
        if (next >= 100) {
          clearInterval(interval);
          const score = sentenceWords.reduce(
            (acc, word) => acc + word.score,
            0
          );
          let result;

          if (score >= 1) result = "Positive";
          else if (score < 0) result = "Negative";
          else result = "Neutral";

          setPrediction(result);
          onAnswer(result);
          setIsLoading(false);
          return 100;
        }
        return next;
      });
    }, 50);
  };

  const renderContent = () => {
    switch (step.type) {
      case "intro":
        return (
          <p className="text-2xl font-semibold leading-relaxed">{step.text}</p>
        );
      case "quiz":
        return (
          <div className="w-full text-[var(--color-text-heading)]">
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
      case "cleanup":
        return (
          <div className="w-full text-[var(--color-text-heading)]">
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
                          : "bg-blue-200 hover:bg-blue-300 text-gray-800"
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
      case "sort":
        if (!sortBins) return null;
        return (
          <div className="w-full text-[var(--color-text-heading)]">
            <h3 className="text-2xl font-bold mb-4">{step.question}</h3>
            <div className="flex justify-center gap-4 mb-4 min-h-[48px]">
              {sortBins.unsorted.map((item) => (
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
                  onDrop={(e) => handleSortDrop(e, binName)}
                  onDragOver={handleDragOver}
                  className={`w-1/2 p-4 border-2 border-dashed rounded-lg min-h-[100px] ${
                    binName === "Positive"
                      ? "border-green-400"
                      : "border-red-400"
                  }`}
                >
                  <h4 className="font-bold mb-2">{binName}</h4>
                  {sortBins[binName].map((item) => (
                    <div
                      key={item.id}
                      className="p-2 bg-gray-200 rounded-md mb-2"
                    >
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
              sortBins.unsorted.length === 0 &&
              !isQuestionComplete && (
                <button
                  onClick={checkSortAnswer}
                  className="mt-4 p-2 bg-teal-500 text-white rounded-lg font-bold"
                >
                  Check Answer
                </button>
              )
            )}
          </div>
        );
      case "slider":
        return (
          <div className="w-full text-[var(--color-text-heading)]">
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
                onClick={checkSliderAnswer}
                className="mt-6 p-2 bg-teal-500 text-white rounded-lg font-bold"
              >
                Submit Rating
              </button>
            )}
          </div>
        );
      case "order":
        if (!orderedItems) return null;
        return (
          <div className="w-full text-[var(--color-text-heading)]">
            <h3 className="text-2xl font-bold mb-4">{step.question}</h3>
            <div className="p-4 bg-white/70 rounded-lg min-h-[200px]">
              {orderedItems.map((item, index) => (
                <div
                  key={item}
                  draggable
                  onDragStart={(e) => handleDragStart(e, { id: item })}
                  onDrop={(e) => handleOrderDrop(e, index)}
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
                  onClick={checkOrderAnswer}
                  className="mt-4 p-2 bg-teal-500 text-white rounded-lg font-bold"
                >
                  Check Order
                </button>
              )
            )}
          </div>
        );
      case "mapping":
        return (
          <div className="w-full text-[var(--color-text-heading)]">
            <h3 className="text-2xl font-bold mb-4">{step.question}</h3>
            <div className="flex justify-between">
              <div className="w-1/2 space-y-3 pr-4">
                {step.items.map((item) => {
                  const isSelected = selectedItem === item.id;
                  const mappedCategory = mappings[item.id];
                  const result = mappingResults[item.id];
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
                      {item.text}
                      {mappedCategory && (
                        <span className="font-normal text-sm text-blue-800">
                          → {mappedCategory}
                        </span>
                      )}
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
                  onClick={checkMappingAnswer}
                  className="mt-4 p-2 bg-teal-500 text-white rounded-lg font-bold"
                >
                  Check Answer
                </button>
              )
            )}
          </div>
        );
      case "fill-in-the-blank": {
        const isCorrect = filledWord === step.answer;
        return (
          <div className="w-full text-[var(--color-text-heading)]">
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
      }
      case "sandbox":
        return (
          <div className="w-full h-full flex flex-col text-[var(--color-text-heading)]">
            <h3 className="text-2xl font-bold mb-2 text-center">
              {step.question}
            </h3>
            <div className="bg-white/80 p-3 rounded-lg min-h-[80px] text-xl font-semibold mb-3 shadow-inner flex flex-wrap gap-2 items-center">
              {sentenceWords.length > 0 ? (
                sentenceWords.map((word, i) => (
                  <span key={`${word.text}-${i}`}>{word.text}</span>
                ))
              ) : (
                <span className="text-gray-400">
                  Build your sentence here...
                </span>
              )}
            </div>
            <div className="bg-white/50 p-3 rounded-lg flex-grow overflow-y-auto shadow-inner mb-3">
              <div className="flex flex-wrap gap-2">
                {step.wordBank.map((word, i) => (
                  <button
                    key={`${word.text}-${i}`}
                    onClick={() => handleWordSelect(word)}
                    className="p-2 bg-blue-200 rounded-md hover:bg-blue-300"
                  >
                    {word.text}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[60px] flex items-center justify-center gap-4 mt-auto">
              {isLoading ? (
                <div className="w-full text-center">
                  <div className="w-full bg-gray-200 rounded-full h-6 shadow-inner">
                    <div
                      className="bg-teal-500 h-6 rounded-full text-white font-bold"
                      style={{ width: `${loadingProgress}%` }}
                    >
                      {loadingProgress}%
                    </div>
                  </div>
                  <span className="font-bold text-teal-700">Predicting...</span>
                </div>
              ) : prediction ? (
                <div className="text-center">
                  <h4 className="font-bold text-xl">Gloomy's Prediction:</h4>
                  <div className="flex items-center justify-center gap-4 mt-2">
                    <p
                      className={`text-2xl font-extrabold ${
                        prediction === "Positive"
                          ? "text-green-600"
                          : prediction === "Negative"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {prediction}
                    </p>
                    <button
                      onClick={handleSandboxReset}
                      className="p-3 px-6 bg-orange-500 text-white rounded-lg font-bold shadow-md hover:bg-orange-600"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={handlePredict}
                    disabled={sentenceWords.length === 0}
                    className="p-3 px-6 bg-teal-500 text-white rounded-lg font-bold shadow-md hover:bg-teal-600 disabled:bg-gray-400"
                  >
                    Predict
                  </button>
                  <button
                    onClick={handleSandboxReset}
                    disabled={sentenceWords.length === 0}
                    className="p-3 px-6 bg-gray-500 text-white rounded-lg font-bold shadow-md hover:bg-gray-600"
                  >
                    Clear
                  </button>
                </>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isIntroStep = step.type === "intro";
  const containerClasses = `w-full h-full flex flex-col items-center py-8 text-center overflow-y-auto pr-2 ${
    isIntroStep ? "justify-center" : "justify-start"
  }`;

  return <div className={containerClasses}>{renderContent()}</div>;
};

export default ContentDisplay;
