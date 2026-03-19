"use client";

import { Zap } from "lucide-react";
import { motion } from "motion/react";
import { PayPlan, PayPlanFrequency } from "../_constants/plan";
import { useState } from "react";
import { createCheckoutSession } from "@/app/actions/stripe";
import toast from "react-hot-toast";

interface UpgradeButtonProps {
    priceId: string,
    frequency: PayPlanFrequency,
}

export default function UpgradeButton({priceId, frequency}: UpgradeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePay = async () => {
    try {
        setIsLoading(true);

        const checkoutUrl = await createCheckoutSession(priceId, frequency);

        if (checkoutUrl) {
            window.location.href = checkoutUrl; // redirect to external stripe checkout
        }
    } catch (e) {
        console.error("Payment routing failed:", e);
        toast.error("Failed to initiate checkout. Please try again.");
    } finally {
        setIsLoading(false);
    }
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
      {isLoading ? "Redirecting..." : "Select this plan"}
    </motion.button>
  );
}
