import { motion } from 'framer-motion';

const NavButton = ({ onClick, children }) => {
  return (
    <motion.button
      onClick={onClick}
      className="flex h-16 w-16 items-center justify-center rounded-full bg-white/50 shadow-xl backdrop-blur-sm"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};

export default NavButton;