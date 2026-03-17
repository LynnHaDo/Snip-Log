"use client";

import { Zap } from "lucide-react";
import { motion } from "motion/react";

export default function UpgradeButton() {
  const handlePay = () => {
    console.log("User upgrade");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePay}
      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white 
        bg-gradient-to-r from-blue-500/10 to-purple-500/10 
        hover:from-blue-500/20 hover:to-purple-500/20 
        rounded-xl transition-all duration-200 border border-gray-800 group"
    >
      <Zap className="w-5 h-5" />
      Upgrade to Pro
    </motion.button>
  );
}
