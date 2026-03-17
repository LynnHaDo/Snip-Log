"use client"
import { motion } from "motion/react";
import { ReactNode } from "react";

interface HeroProps {
  icon?: ReactNode;
  label?: string;
  title: string;
  subtitle: string;
}

const Hero = ({ icon, label, title, subtitle }: HeroProps) => {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r
             from-light to-purple-500/10 text-sm text-gray-400 mb-6"
      >
        {icon}
        {label}
      </motion.div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-lg text-gray-400 mb-8"
      >
        {subtitle}
      </motion.p>
    </div>
  );
};

export default Hero;
