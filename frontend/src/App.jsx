import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
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
  const userIdRef = useRef(getUserId());
  const [isAppInitialized, setIsAppInitialized] = useState(false);

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

  // --- CRITICAL FIX 1: Calculate per-level progress ---
  const levelProgress = useMemo(() => {
    const progress = {};
    (gameData || []).forEach((level) => {
      if (level.level < 8) {
        // Only levels 1-7 have solvable questions
        const total = (level.steps || []).filter(
          (step) => step.type !== "intro"
        ).length;
        const solved = (level.steps || []).filter(
          (step) => step.type !== "intro" && step.isComplete
        ).length;
        progress[level.level] = { total, solved };
      }
    });
    return progress;
  }, [gameData]);

  useEffect(() => {
    const initializeApp = async () => {
      if (!userIdRef.current) {
        console.warn("userId not available, cannot fetch progress.");
        setIsAppInitialized(true);
        return;
      }

      try {
        const { data } = await axios.get(
          `${PROGRESS_API_ROUTE}/${userIdRef.current}`
        );
        setUnlockedLevel(data.currentLevel);
        setCurrentLevel(data.currentLevel);
        // --- Restore gameData completion status from backend ---
        // This is a placeholder as backend only stores 'currentLevel'.
        // For a full persistence, gameData (step completion) would also be saved/loaded.
        // For now, we'll assume only `unlockedLevel` dictates what the user can access.
      } catch (error) {
        console.error("Could not fetch progress from backend", error);
        setUnlockedLevel(1);
        setCurrentLevel(1);
      } finally {
        setIsAppInitialized(true);
      }
    };

    initializeApp();
  }, []);

  const saveProgress = useCallback(
    async (newLevel) => {
      if (!isAppInitialized || !userIdRef.current || newLevel <= unlockedLevel)
        return;

      try {
        await axios.post(`${PROGRESS_API_ROUTE}/${userIdRef.current}`, {
          newLevel: newLevel,
        });
        setUnlockedLevel(newLevel);
      } catch (error) {
        console.error("Failed to save progress", error);
      }
    },
    [isAppInitialized, unlockedLevel]
  );

  const activeContentData = useMemo(() => {
    if (gameState === "intro") return { steps: introduction };
    return (gameData || []).find((l) => l.level === currentLevel);
  }, [gameState, gameData, currentLevel]);

  const currentStepData = useMemo(() => {
    if (!activeContentData || !activeContentData.steps) {
      return { robot: "thinking", type: "intro", text: "Loading content..." };
    }
    if (currentStep < 0 || currentStep >= activeContentData.steps.length) {
      return { robot: "thinking", type: "intro", text: "Content not found..." };
    }
    return activeContentData.steps[currentStep];
  }, [activeContentData, currentStep]);

  useEffect(() => {
    setRobotState(currentStepData.robot || "thinking");
    setShowConfetti(false);
  }, [currentStep, currentLevel, gameState, currentStepData.robot]);

  useEffect(() => {
    const isFinalLevel = currentLevel === 7;
    const isFinalStep = story[6] && currentStep === story[6].steps.length - 1;

    if (isFinalLevel && isFinalStep && currentStepData.isComplete) {
      setShowConfetti(true);
      saveProgress(8);
    }
  }, [currentLevel, currentStep, currentStepData.isComplete, saveProgress]);

  const handleSetCurrentLevel = useCallback((level) => {
    setCurrentLevel(level);
    setCurrentStep(0);
    setGameState("playing");
  }, []);

  const handleAnswer = useCallback(
    (isCorrect) => {
      let newRobotState;
      if (isCorrect === true) {
        newRobotState = "happy";
      } else if (isCorrect === false) {
        newRobotState = "sad";
      } else if (isCorrect === null) {
        newRobotState = "neutral";
      } else {
        newRobotState =
          isCorrect === "Positive"
            ? "happy"
            : isCorrect === "Negative"
            ? "sad"
            : "neutral";
      }
      setRobotState(newRobotState);

      if (
        isCorrect === true ||
        isCorrect === "Positive" ||
        isCorrect === "Negative" ||
        isCorrect === "Neutral"
      ) {
        const newGameData = JSON.parse(JSON.stringify(gameData));
        const level = newGameData.find((l) => l.level === currentLevel);
        if (level && level.steps && level.steps[currentStep]) {
          level.steps[currentStep].isComplete = true;
          setGameData(newGameData);
        }
      }
    },
    [gameData, currentLevel, currentStep]
  );

  const handleNext = useCallback(() => {
    // --- CRITICAL FIX 2: Strict disabling of Next button ---
    // Prevent navigation if the current step is a challenge AND not yet complete
    if (
      currentStepData.type !== "intro" &&
      !currentStepData.isComplete &&
      gameState === "playing"
    ) {
      console.warn("Cannot proceed: current question not answered correctly.");
      return;
    }

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

    const currentActiveLevelData = (gameData || []).find(
      (l) => l.level === currentLevel
    );
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
  }, [
    gameState,
    currentStep,
    currentLevel,
    introduction,
    unlockedLevel,
    gameData,
    saveProgress,
    currentStepData.type,
    currentStepData.isComplete,
  ]); // Add currentStepData dependencies

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // This `isNextDisabled` prop is only for *visual* disabling of the button
  // The actual logic for preventing navigation is now in `handleNext`
  const isNextDisabledVisually =
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
              levelProgress={levelProgress} // Pass level progress here
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
          isNextDisabled={isNextDisabledVisually}
          isIntro={gameState === "intro"}
          completedQuestions={completedQuestions}
          totalQuestions={totalQuestions}
        />
      )}
    </main>
  );
}

export default App;
