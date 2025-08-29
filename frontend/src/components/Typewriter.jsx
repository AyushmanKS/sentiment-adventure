import React from "react";
import { TypeAnimation } from "react-type-animation";

const Typewriter = ({ text }) => {
  return (
    <TypeAnimation
      sequence={[text, 5000]} 
      wrapper="p"
      speed={50} 
      className="text-2xl font-semibold leading-relaxed"
      cursor={true}
      repeat={0} 
    />
  );
};

export default Typewriter;
