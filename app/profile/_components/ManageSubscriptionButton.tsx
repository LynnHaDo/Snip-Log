"use client";

import { useState } from "react";
import { Loader2, Settings } from "lucide-react";
import { createCustomerPortalSession } from "@/app/actions/stripe";
import toast from "react-hot-toast";
import { motion } from "motion/react";

export default function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleManageClick = async () => {
    try {
      setIsLoading(true);
      const portalUrl = await createCustomerPortalSession();
      
      if (portalUrl) {
        window.location.href = portalUrl;
      }
    } catch (error) {
      console.error("Failed to route to Stripe portal:", error);
      toast.error("Could not open billing portal. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleManageClick}
      disabled={isLoading}
      className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white 
        bg-gradient-to-r from-blue-500/10 to-purple-500/10 
        hover:from-blue-500/20 hover:to-purple-500/20 
        rounded-xl transition-all duration-200 border border-gray-800 group"
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-purple-400" />
      ) : (
        <Settings className="w-5 h-5" />
      )}
      {isLoading ? "Loading..." : "Manage Subscription"}
    </motion.button>
  );
}