import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { story, levelBackgrounds, introduction } from "./constants";
import SidePanel from "./components/SidePanel";
import Hero from "./sections/Hero";
import HamburgerButton from "./components/HamburgerButton";
import ConfettiEffect from "./components/ConfettiEffect";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PROGRESS_API_ROUTE = `${API_BASE_URL}/api/progress`;

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
  const [isAppInitialized, setIsAppInitialized] = useState(false);

  const userId = getUserId();

  useEffect(() => {
    const initializeApp = async () => {
      if (!userId) {
        setIsAppInitialized(true);
        return;
      }
      try {
        const { data } = await axios.get(`${PROGRESS_API_ROUTE}/${userId}`);
        setUnlockedLevel(data.currentLevel);
        setCurrentLevel(data.currentLevel);
      } catch (error) {
        console.error("Could not fetch progress. Starting fresh.", error);
        setUnlockedLevel(1);
        setCurrentLevel(1);
      } finally {
        setIsAppInitialized(true);
      }
    };
    initializeApp();
  }, [userId]);

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
  const levelProgress = useMemo(() => {
    const progress = {};
    gameData.forEach((level) => {
      if (level.level < 8) {
        const total = level.steps.filter(
          (step) => step.type !== "intro"
        ).length;
        const solved = level.steps.filter(
          (step) => step.type !== "intro" && step.isComplete
        ).length;
        progress[level.level] = { total, solved };
      }
    });
    return progress;
  }, [gameData]);

  const saveProgress = useCallback(
    async (newLevel) => {
      if (!userId || newLevel <= unlockedLevel) return;
      try {
        await axios.post(`${PROGRESS_API_ROUTE}/${userId}`, { newLevel });
        setUnlockedLevel(newLevel);
      } catch (error) {
        console.error("Failed to save progress", error);
      }
    },
    [userId, unlockedLevel]
  );

  const activeContentData = useMemo(() => {
    if (gameState === "intro") return { steps: introduction };
    return gameData.find((l) => l.level === currentLevel);
  }, [gameState, gameData, currentLevel]);

  const currentStepData = useMemo(() => {
    if (!activeContentData?.steps?.[currentStep]) {
      return { robot: "thinking", type: "intro", text: "Loading..." };
    }
    return activeContentData.steps[currentStep];
  }, [activeContentData, currentStep]);

  useEffect(() => {
    setRobotState(currentStepData.robot || "thinking");
    const isFinal =
      currentLevel === 7 && currentStep === story[6]?.steps.length - 1;
    if (isFinal && currentStepData.isComplete) {
      setShowConfetti(true);
      saveProgress(8);
    } else {
      setShowConfetti(false);
    }
  }, [currentStep, currentLevel, gameState, currentStepData, saveProgress]);

  const handleSetCurrentLevel = useCallback((level) => {
    setCurrentLevel(level);
    setCurrentStep(0);
    setGameState("playing");
  }, []);

  const handleAnswer = useCallback(
    (isCorrect) => {
      let newRobotState = "thinking";
      if (isCorrect === true) newRobotState = "happy";
      else if (isCorrect === false) newRobotState = "sad";
      else if (isCorrect)
        newRobotState =
          isCorrect === "Positive"
            ? "happy"
            : isCorrect === "Negative"
            ? "sad"
            : "neutral";

      setRobotState(newRobotState);

      if (isCorrect) {
        const newGameData = JSON.parse(JSON.stringify(gameData));
        const level = newGameData.find((l) => l.level === currentLevel);
        if (level?.steps?.[currentStep]) {
          level.steps[currentStep].isComplete = true;
          setGameData(newGameData);
        }
      }
    },
    [gameData, currentLevel, currentStep]
  );

  const handleNext = useCallback(() => {
    if (
      currentStepData.type !== "intro" &&
      !currentStepData.isComplete &&
      gameState === "playing"
    )
      return;

    if (gameState === "intro") {
      if (currentStep < introduction.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setGameState("playing");
        setCurrentStep(0);
        setCurrentLevel(unlockedLevel);
      }
      return;
    }

    const isLastStep = currentStep === activeContentData?.steps.length - 1;
    if (isLastStep) {
      if (currentLevel < 8) {
        const nextLevel = currentLevel + 1;
        saveProgress(nextLevel);
        setCurrentLevel(nextLevel);
        setCurrentStep(0);
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  }, [
    gameState,
    currentStep,
    unlockedLevel,
    gameData,
    saveProgress,
    currentLevel,
    activeContentData,
    currentStepData,
  ]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  }, [currentStep]);

  const isNextDisabled =
    gameState === "playing" &&
    currentStepData.type !== "intro" &&
    !currentStepData.isComplete;
  const background =
    gameState === "intro"
      ? levelBackgrounds[0]
      : levelBackgrounds[currentLevel - 1];

  if (!isAppInitialized) {
    return (
      <main
        className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${levelBackgrounds[0]})` }}
      >
        <h1 className="text-4xl font-bold text-gray-800">
          Loading Gloomy's Adventure...
        </h1>
      </main>
    );
  }

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
              levelProgress={levelProgress}
            />
          </>
        )}
      </AnimatePresence>
      {activeContentData && activeContentData.steps && (
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
