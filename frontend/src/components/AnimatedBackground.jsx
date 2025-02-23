import { motion } from "framer-motion";

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated shapes */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          borderRadius: ["20%", "50%", "20%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#FF1493] to-pink-200 opacity-20 blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1, 1.5, 1],
          rotate: [0, -90, 0],
          borderRadius: ["50%", "20%", "50%"],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          delay: 1,
        }}
        className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-pink-200 to-[#FF1493] opacity-20 blur-3xl"
      />
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
    </div>
  );
};

export default AnimatedBackground;
