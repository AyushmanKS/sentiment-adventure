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

// --- CRITICAL FIX 1: Define API_BASE_URL robustly outside the component ---
// This ensures it's resolved during build time and stable.
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

  // Initialize userId as state for re-renders if it changes (though it shouldn't often)
  const [userId, setUserId] = useState(null); // Initialize as null
  const [isAppInitialized, setIsAppInitialized] = useState(false); // Manages loading state

  // --- CRITICAL FIX 2: userId setup and initial data fetch ---
  useEffect(() => {
    // 1. Get/Set userId
    const storedUserId = getUserId();
    setUserId(storedUserId);

    // 2. Fetch progress once userId is stable
    const fetchProgress = async (id) => {
      try {
        const { data } = await axios.get(`${PROGRESS_API_ROUTE}/${id}`);
        setUnlockedLevel(data.currentLevel);
        setCurrentLevel(data.currentLevel); // Start game at user's highest level
      } catch (error) {
        console.error("Could not fetch progress from backend", error);
        // Default to level 1 on error or if no progress found
        setUnlockedLevel(1);
        setCurrentLevel(1);
      } finally {
        setIsAppInitialized(true); // Mark app as initialized once fetch attempt is done
      }
    };

    if (storedUserId) {
      // Only fetch if userId is actually available
      fetchProgress(storedUserId);
    } else {
      // If for some reason userId couldn't be generated, still initialize app
      setIsAppInitialized(true);
      console.error("Failed to generate or retrieve userId.");
    }
  }, []); // Runs only once on component mount

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

  const levelProgress = useMemo(() => {
    const progress = {};
    (gameData || []).forEach((level) => {
      if (level.level < 8) {
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

  const saveProgress = useCallback(
    async (newLevel) => {
      if (!isAppInitialized || !userId || newLevel <= unlockedLevel) return; // Only save if initialized and userId is present

      try {
        await axios.post(`${PROGRESS_API_ROUTE}/${userId}`, {
          newLevel: newLevel,
        });
        setUnlockedLevel(newLevel);
      } catch (error) {
        console.error("Failed to save progress", error);
      }
    },
    [isAppInitialized, userId, unlockedLevel]
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
    const isQuestionChallenge = currentStepData.type !== "intro";
    // --- CRITICAL FIX 3: Strict check for completion before proceeding ---
    if (
      gameState === "playing" &&
      isQuestionChallenge &&
      !currentStepData.isComplete
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
        setCurrentLevel(unlockedLevel); // Transition from intro to user's unlocked level
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
    currentStepData,
  ]);

  const handlePrev = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  // isNextDisabledVisually is for the button's disabled prop only
  const isNextDisabledVisually =
    gameState === "playing" &&
    currentStepData.type !== "intro" &&
    !currentStepData.isComplete;

  const background =
    gameState === "intro"
      ? levelBackgrounds[0]
      : levelBackgrounds[currentLevel - 1];

  // --- CRITICAL FIX 4: App-wide loading screen ---
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
      {activeContentData &&
        activeContentData.steps && ( // Ensure data is ready for Hero
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
