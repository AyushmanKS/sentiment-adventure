import React from 'react';

const HamburgerButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed top-6 left-6 z-50 p-3 rounded-full bg-white/50 backdrop-blur-sm text-[var(--color-text-heading)] shadow-md transition-transform hover:scale-110"
      aria-label="Open menu"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  );
};

export default HamburgerButton;