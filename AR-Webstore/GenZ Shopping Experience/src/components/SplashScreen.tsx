import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < 2) {
        setCurrentStep(currentStep + 1);
      } else {
        onComplete();
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center z-50 overflow-hidden">
      {/* Background Fashion Items */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Top Left - Clothing */}
        <motion.div
          initial={{ opacity: 0, x: -100, y: -100 }}
          animate={{ opacity: currentStep >= 1 ? 0.7 : 0, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute top-8 left-8 w-32 h-32 lg:w-40 lg:h-40"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1660406734595-06458af8e5c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwY2xvdGhpbmclMjBpdGVtc3xlbnwxfHx8fDE3NTc5MTc2NDh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Fashion clothing"
            className="w-full h-full object-cover rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Top Right - Heels */}
        <motion.div
          initial={{ opacity: 0, x: 100, y: -100 }}
          animate={{ opacity: currentStep >= 1 ? 0.7 : 0, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute top-8 right-8 w-32 h-32 lg:w-40 lg:h-40"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1605733513549-de9b150bd70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21lbiUyMHNob2VzJTIwaGVlbHN8ZW58MXx8fHwxNTc5MjU0NTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Women heels"
            className="w-full h-full object-cover rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Bottom Left - Accessories */}
        <motion.div
          initial={{ opacity: 0, x: -100, y: 100 }}
          animate={{ opacity: currentStep >= 1 ? 0.7 : 0, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="absolute bottom-8 left-8 w-32 h-32 lg:w-40 lg:h-40"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1569388330338-53ecda03dfa1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwYWNjZXNzb3JpZXMlMjBqZXdlbHJ5fGVufDF8fHx8MTc1ODAxNDcwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="Fashion accessories"
            className="w-full h-full object-cover rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Bottom Right - Sneakers */}
        <motion.div
          initial={{ opacity: 0, x: 100, y: 100 }}
          animate={{ opacity: currentStep >= 1 ? 0.7 : 0, x: 0, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-8 right-8 w-32 h-32 lg:w-40 lg:h-40"
        >
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1625622176741-a21f738d0756?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMHNuZWFrZXJzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NTgwMTczODd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
            alt="White sneakers"
            className="w-full h-full object-cover rounded-2xl shadow-lg"
          />
        </motion.div>

        {/* Additional floating items for larger screens */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: currentStep >= 1 ? 0.5 : 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="absolute top-1/3 left-1/4 w-20 h-20 hidden lg:block"
        >
          <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 rounded-full shadow-lg"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: currentStep >= 1 ? 0.5 : 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="absolute bottom-1/3 right-1/4 w-16 h-16 hidden lg:block"
        >
          <div className="w-full h-full bg-gradient-to-br from-purple-200 to-pink-200 rounded-full shadow-lg"></div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="text-center z-10 px-4">
        {/* AURAFIT Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-pink-500 via-pink-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-3xl font-bold text-white">A</span>
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-4"
        >
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            <span className="bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              AURAFIT
            </span>
          </h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: currentStep >= 1 ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="text-lg lg:text-xl text-gray-600 font-medium"
          >
            by Team Abhimanyu
          </motion.p>
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: currentStep >= 2 ? 1 : 0, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8"
        >
          <p className="text-gray-500 text-sm lg:text-base max-w-md mx-auto">
            Where Your Style Meets AI - The Future of Fashion Discovery
          </p>
        </motion.div>

        {/* Loading Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 1.5 }}
          className="mt-12"
        >
          <div className="flex justify-center space-x-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Powered by Myntra badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: currentStep >= 2 ? 1 : 0, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
          <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">M</span>
          </div>
          <span className="text-xs text-gray-600 font-medium">Powered by Myntra</span>
        </div>
      </motion.div>
    </div>
  );
}