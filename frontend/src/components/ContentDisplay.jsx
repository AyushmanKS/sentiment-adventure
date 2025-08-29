import React from 'react';

import IntroDisplay from './challenges/IntroDisplay';
import QuizDisplay from './challenges/QuizDisplay';
import CleanupDisplay from './challenges/CleanupDisplay';
import SortDisplay from './challenges/SortDisplay';
import SliderDisplay from './challenges/SliderDisplay';
import OrderDisplay from './challenges/OrderDisplay';
import MappingDisplay from './challenges/MappingDisplay';
import FillInTheBlankDisplay from './challenges/FillInTheBlankDisplay';
import SandboxDisplay from './challenges/SandboxDisplay';

const challengeComponents = {
  intro: IntroDisplay,
  quiz: QuizDisplay,
  cleanup: CleanupDisplay,
  sort: SortDisplay,
  slider: SliderDisplay,
  order: OrderDisplay,
  mapping: MappingDisplay,
  'fill-in-the-blank': FillInTheBlankDisplay,
  sandbox: SandboxDisplay,
};

const ContentDisplay = ({ step, onAnswer }) => {
  const ComponentToRender = challengeComponents[step.type] || null;

  const isIntroStep = step.type === 'intro';
  const containerClasses = `w-full h-full flex flex-col items-center py-8 text-center overflow-y-auto pr-2 ${isIntroStep ? 'justify-center' : 'justify-start'}`;

  return (
    <div className={containerClasses}>
      {ComponentToRender && <ComponentToRender step={step} onAnswer={onAnswer} />}
    </div>
  );
};

export default ContentDisplay;