import { motion } from "framer-motion";
import { robotImages } from "../constants";
import NavButton from "../components/NavButton";
import ContentDisplay from "../components/ContentDisplay";
import ProgressBar from "../components/ProgressBar";

const Hero = ({
  levelData,
  currentStep,
  currentLevel,
  robotState,
  onNext,
  onPrev,
  onAnswer,
  isNextDisabled,
  isIntro,
  completedQuestions,
  totalQuestions,
  theme, // New theme prop
}) => {
  const step = levelData.steps[currentStep];

  // --- NEW: Dynamic Styles ---
  const containerStyle = {
    backgroundColor: theme.bg,
    color: theme.text,
    boxShadow: `0 10px 15px -3px ${theme.shadow}, 0 4px 6px -2px ${theme.shadow}`,
  };

  return (
    <section className="min-h-screen w-full flex items-center justify-center p-8">
      <div className="flex w-full items-center justify-center space-x-8">
        <NavButton onClick={onPrev} disabled={isIntro || currentStep === 0}>
          <svg
            className="h-8 w-8 text-[var(--color-text-heading)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </NavButton>

        <div
          className="soft-container w-full max-w-5xl h-[580px] flex flex-col p-6"
          style={containerStyle} // Apply dynamic styles
        >
          {!isIntro && (
            <ProgressBar
              completed={completedQuestions}
              total={totalQuestions}
            />
          )}

          <div className="flex-grow grid grid-cols-2 gap-8 items-center mt-2">
            <div className="h-full flex justify-center items-center">
              <motion.img
                key={robotState}
                src={robotImages[robotState]}
                alt="Gloomy the Robot"
                className="max-h-full object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.35)] -translate-y-12"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 150, damping: 20 }}
              />
            </div>
            <ContentDisplay step={step} onAnswer={onAnswer} />
          </div>
        </div>

        <NavButton onClick={onNext} disabled={isNextDisabled}>
          <svg
            className="h-8 w-8 text-[var(--color-text-heading)]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </NavButton>
      </div>
    </section>
  );
};

export default Hero;
