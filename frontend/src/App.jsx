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
      (story || [])
        .slice(0, 7)
        .flatMap((level) => level.steps || [])
        .filter((step) => step.type !== "intro").length,
    []
  );
  const completedQuestions = useMemo(
    () =>
      (gameData || [])
        .slice(0, 7)
        .flatMap((level) => level.steps || [])
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
    fetchProgress();
  }, [userId]);

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

  const activeContentData = useMemo(() => {
    if (gameState === "intro") return { steps: introduction };
    return (gameData || []).find((l) => l.level === currentLevel);
  }, [gameState, gameData, currentLevel]);

  const currentStepData = useMemo(() => {
    if (!activeContentData || !activeContentData.steps) {
        return { robot: 'thinking', type: 'intro', text: 'Loading content...' };
    }
    if (currentStep < 0 || currentStep >= activeContentData.steps.length) {
        return { robot: 'thinking', type: 'intro', text: 'Content not found...' };
    }
    return activeContentData.steps[currentStep];
  }, [activeContentData, currentStep]);


  // --- CRITICAL FIX 1: This useEffect now ONLY sets the default robot state for a step ---
  useEffect(() => {
    // Only set default robot if we're not currently showing happy/sad from an answer
    // or if the step specifically defines a robot and we're not waiting for an answer.
    if (currentStepData.robot && !currentStepData.isComplete) {
      setRobotState(currentStepData.robot);
    } else if (currentStepData.type === 'intro' && currentStepData.robot) {
      setRobotState(currentStepData.robot);
    } else if (!currentStepData.robot) {
       setRobotState('thinking'); // Default if not specified
    }
    setShowConfetti(false); // Reset confetti on new step
  }, [currentStep, currentLevel, gameState, currentStepData]);


  // --- CRITICAL FIX 2: Moved confetti logic to a separate useEffect for better control ---
  useEffect(() => {
    const isFinalLevel = currentLevel === 7;
    const isFinalStep = story[6] && currentStep === story[6].steps.length - 1;
    
    if (isFinalLevel && isFinalStep && currentStepData.isComplete) { // Only show confetti when final step is COMPLETE
      setShowConfetti(true);
      saveProgress(8);
    }
  }, [currentLevel, currentStep, currentStepData.isComplete, saveProgress]);


  const handleSetCurrentLevel = (level) => {
    setCurrentLevel(level);
    setCurrentStep(0);
    setGameState("playing");
  };

  // --- CRITICAL FIX 3: Redefined handleAnswer to explicitly set robot state ---
  const handleAnswer = (isCorrect) => {
    let newRobotState;
    if (isCorrect === true) {
      newRobotState = "happy";
    } else if (isCorrect === false) {
      newRobotState = "sad";
    } else { // For sandbox where isCorrect can be 'Positive', 'Negative', 'Neutral'
      newRobotState = (isCorrect === 'Positive') ? 'happy' : ((isCorrect === 'Negative') ? 'sad' : 'neutral');
    }
    setRobotState(newRobotState); // Set robot emotion based on answer

    if (isCorrect === true || isCorrect === 'Positive' || isCorrect === 'Negative' || isCorrect === 'Neutral') {
      const newGameData = JSON.parse(JSON.stringify(gameData));
      const level = newGameData.find((l) => l.level === currentLevel);
      if (level && level.steps && level.steps[currentStep]) {
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
        if (unlockedLevel > 1) setCurrentLevel(unlockedLevel);
      }
      return;
    }

    const currentActiveLevelData = (gameData || []).find((l) => l.level === currentLevel);
    if (!currentActiveLevelData || !currentActiveLevelData.steps) return;

    const isLastStep = currentStep === currentActiveLevelData.steps.length - 1;
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
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
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