import React, { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { story, levelBackgrounds, introduction } from "./constants";
import SidePanel from "./components/SidePanel";
import Hero from "./sections/Hero";
import HamburgerButton from "./components/HamburgerButton";
import ConfettiEffect from "./components/ConfettiEffect";

const API_BASE_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL 
  : "http://localhost:5000";

const PROGRESS_API_URL = `${API_BASE_URL}/api/progress`;

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
  const [unlockedLevel, setUnlockedLevel] = useState(1); 
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

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const { data } = await axios.get(`${PROGRESS_API_URL}/${userId}`);
        setUnlockedLevel(data.currentLevel);
        setCurrentLevel(data.currentLevel);
      } catch (error) {
        console.error("Could not fetch progress", error);
        setUnlockedLevel(1);
        setCurrentLevel(1);
      }
    };
    if (gameState !== 'intro' || (currentLevel === 1 && currentStep === 0)) {
       fetchProgress();
    }
  }, [userId, gameState]);

  const saveProgress = async (newLevel) => {
    if (newLevel > unlockedLevel) {
      try {
        await axios.post(`${PROGRESS_API_URL}/${userId}`, {
          newLevel: newLevel,
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
    } else {
      setShowConfetti(false); // Hide confetti if not on final step
    }
  }, [currentStep, currentLevel, gameState, gameData]); // Added gameData to dependencies

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
        setCurrentStep(0); // Move to the first step of Level 1
        // After intro, check if we need to set initial level from backend
        if (unlockedLevel > 1) setCurrentLevel(unlockedLevel);
      }
      return;
    }
    const activeContentData = gameData.find((l) => l.level === currentLevel);
    const isLastStep = currentStep === activeContentData.steps.length - 1;
    if (isLastStep) {
      if (currentLevel < 8) { // Max level is now 8
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

  const activeContentDataForRender =
    gameState === "intro"
      ? { steps: introduction }
      : gameData.find((l) => l.level === currentLevel);
  const currentStepDataForRender = activeContentDataForRender.steps[currentStep];
  
  const isNextDisabled =
    gameState === "playing" &&
    currentStepDataForRender.type !== "intro" &&
    !currentStepDataForRender.isComplete;
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
      {activeContentDataForRender && (
        <Hero
          levelData={activeContentDataForRender}
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