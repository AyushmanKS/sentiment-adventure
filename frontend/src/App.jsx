import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { story, levelBackgrounds, introduction } from "./constants";
import SidePanel from "./components/SidePanel";
import Hero from "./sections/Hero";
import HamburgerButton from "./components/HamburgerButton";
import ConfettiEffect from "./components/ConfettiEffect";

const API_URL = "http://localhost:5000/api/progress";

const getUserId = () => {
  let userId = localStorage.getItem("sentimentAdventureUserId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem("sentimentAdventureUserId", userId);
  }
  return userId;
};

function App() {
  const [gameState, setGameState] = useState("intro");
  const [unlockedLevel, setUnlockedLevel] = useState(1); // Renamed from userLevel
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [robotState, setRobotState] = useState("intro");
  const [gameData, setGameData] = useState(story);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [userId] = useState(getUserId());

  const totalQuestions = useMemo(
    () =>
      story
        .slice(0, 7)
        .flatMap((level) => level.steps)
        .filter((step) => step.type !== "intro").length,
    []
  );
  const completedQuestions = useMemo(
    () =>
      gameData
        .slice(0, 7)
        .flatMap((level) => level.steps)
        .filter((step) => step.type !== "intro" && step.isComplete).length,
    [gameData]
  );

  // Effect to load progress from backend on startup
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/${userId}`);
        setUnlockedLevel(data.unlockedLevel);
      } catch (error) {
        console.error("Could not fetch progress", error);
      }
    };
    fetchProgress();
  }, [userId]);

  const saveProgress = async (newLevel) => {
    if (newLevel > unlockedLevel) {
      try {
        await axios.post(`${API_URL}/${userId}`, {
          newUnlockedLevel: newLevel,
        });
        setUnlockedLevel(newLevel);
      } catch (error) {
        console.error("Failed to save progress", error);
      }
    }
  };

  useEffect(() => {
    const activeContentData =
      gameState === "intro"
        ? { steps: introduction }
        : gameData.find((l) => l.level === currentLevel);
    const currentStepData = activeContentData.steps[currentStep];
    setRobotState(currentStepData.robot || "thinking");

    const isFinalLevel = currentLevel === 7;
    const isFinalStep = currentStep === story[6].steps.length - 1;
    if (isFinalLevel && isFinalStep) {
      setShowConfetti(true);
      saveProgress(8); // Save that level 8 is now unlocked
    }
  }, [currentStep, currentLevel, gameState]);

  const handleSetCurrentLevel = (level) => {
    setCurrentLevel(level);
    setCurrentStep(0);
    setGameState("playing");
  };
  const handleAnswer = (isCorrect) => {
    const robotEmotion =
      isCorrect === "Positive"
        ? "happy"
        : isCorrect === "Negative"
        ? "sad"
        : "neutral";
    setRobotState(robotEmotion);
    if (isCorrect) {
      const newGameData = JSON.parse(JSON.stringify(gameData));
      const level = newGameData.find((l) => l.level === currentLevel);
      if (level && level.steps[currentStep]) {
        level.steps[currentStep].isComplete = true;
        setGameData(newGameData);
      }
    }
  };

  const handleNext = () => {
    if (gameState === "intro") {
      if (currentStep < introduction.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setGameState("playing");
        setCurrentStep(0);
      }
      return;
    }
    const activeContentData = gameData.find((l) => l.level === currentLevel);
    const isLastStep = currentStep === activeContentData.steps.length - 1;
    if (isLastStep) {
      if (currentLevel < 8) {
        const nextLevel = currentLevel + 1;
        saveProgress(nextLevel); // Save progress when moving to the next level
        setCurrentLevel(nextLevel);
        setCurrentStep(0);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const activeContentData =
    gameState === "intro"
      ? { steps: introduction }
      : gameData.find((l) => l.level === currentLevel);
  const currentStepData = activeContentData.steps[currentStep];
  const isNextDisabled =
    gameState === "playing" &&
    currentStepData.type !== "intro" &&
    !currentStepData.isComplete;
  const background =
    gameState === "intro"
      ? levelBackgrounds[0]
      : levelBackgrounds[currentLevel - 1];

  return (
    <main
      className="w-screen h-screen bg-cover bg-center overflow-hidden transition-all duration-1000"
      style={{ backgroundImage: `url(${background})` }}
    >
      {showConfetti && <ConfettiEffect />}
      {gameState === "playing" && (
        <HamburgerButton onClick={() => setIsSidebarOpen(true)} />
      )}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <SidePanel
              levels={gameData}
              currentLevel={currentLevel}
              userLevel={unlockedLevel}
              setCurrentLevel={handleSetCurrentLevel}
              setIsOpen={setIsSidebarOpen}
            />
          </>
        )}
      </AnimatePresence>
      {activeContentData && (
        <Hero
          levelData={activeContentData}
          currentStep={currentStep}
          currentLevel={currentLevel}
          robotState={robotState}
          onNext={handleNext}
          onPrev={handlePrev}
          onAnswer={handleAnswer}
          isNextDisabled={isNextDisabled}
          isIntro={gameState === "intro"}
          completedQuestions={completedQuestions}
          totalQuestions={totalQuestions}
        />
      )}
    </main>
  );
}

export default App;
