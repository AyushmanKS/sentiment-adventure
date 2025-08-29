import React, { useState, useEffect } from "react";
import ReactConfetti from "react-confetti";

const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return size;
};

const ConfettiEffect = () => {
  const [width, height] = useWindowSize();
  const [isRunning, setIsRunning] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsRunning(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  if (!isRunning) return null;

  return (
    <ReactConfetti
      width={width}
      height={height}
      numberOfPieces={500}
      recycle={false}
      gravity={0.15}
      onConfettiComplete={() => setIsRunning(false)}
    />
  );
};

export default ConfettiEffect;
