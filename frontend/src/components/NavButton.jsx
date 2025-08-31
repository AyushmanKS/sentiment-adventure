import { motion } from "framer-motion";

const NavButton = ({ onClick, children, disabled }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex h-16 w-16 items-center justify-center rounded-full
        bg-gradient-to-br from-white/80 to-gray-200/60 
        shadow-lg backdrop-blur-sm
        transition-all duration-300
        ${
          disabled
            ? "cursor-not-allowed opacity-50"
            : "hover:shadow-2xl hover:ring-2 hover:ring-offset-2 hover:ring-[var(--color-teal)]"
        }
      `}
      whileHover={{ scale: disabled ? 1 : 1.1 }}
      whileTap={{ scale: disabled ? 1 : 0.9 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </motion.button>
  );
};

export default NavButton;
