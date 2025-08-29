import React, { useState, useEffect } from "react";

const SandboxDisplay = ({ step, onAnswer }) => {
  const [sentenceWords, setSentenceWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    setSentenceWords([]);
    setIsLoading(false);
    setPrediction(null);
    setLoadingProgress(0);
  }, [step]);

  const handleWordSelect = (word) =>
    setSentenceWords((prev) => [...prev, word]);
  const handleReset = () => {
    setSentenceWords([]);
    setPrediction(null);
    onAnswer(null);
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

  return (
    <div className="w-full h-full flex flex-col">
      <h3 className="text-2xl font-bold mb-2 text-center">{step.question}</h3>
      <div className="bg-white/80 p-3 rounded-lg min-h-[80px] text-xl font-semibold mb-3 shadow-inner flex flex-wrap gap-2 items-center">
        {sentenceWords.length > 0 ? (
          sentenceWords.map((word, i) => (
            <span key={`${word.text}-${i}`}>{word.text}</span>
          ))
        ) : (
          <span className="text-gray-400">Build your sentence here...</span>
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
                onClick={handleReset}
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
              onClick={handleReset}
              disabled={sentenceWords.length === 0}
              className="p-3 px-6 bg-gray-500 text-white rounded-lg font-bold shadow-md hover:bg-gray-600 disabled:bg-gray-400"
            >
              Clear
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SandboxDisplay;
