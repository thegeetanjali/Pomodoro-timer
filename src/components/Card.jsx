import { motion } from "framer-motion";

export default function Card({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.97 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`bg-white rounded-3xl shadow-xl px-10 py-10 w-full text-center ${className}`}
    >
      {children}
    </motion.div>
  );
}
