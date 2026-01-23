"use client";

import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import { ShareIcon } from "lucide-react";
import RunButton from "./RunButton";
import { motion } from "motion/react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import useUserSubscriptionStatus from "@/hooks/useUserSubscriptionStatus";
import toast from "react-hot-toast";

export default function ControlWidget() {
  const { setIsShareCodeSnippetDialogOpened } = useCodeEditorStore();
  const { isPro, isSignedIn } = useUserSubscriptionStatus();

  const handleShare = () => {
    if (!isSignedIn) {
      toast.error("Please sign in to share your code.");
      console.log("Please sign in to share your code.");
      return;
    }
    setIsShareCodeSnippetDialogOpened(true);
  };

  return (
    <div className="flex items-center gap-3">
      <ThemeSelector />

      <LanguageSelector hasAccess={isPro} />
      <RunButton />

      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleShare}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-highlight opacity-90 hover:opacity-100 transition-opacity`}
      >
        <ShareIcon className="size-4 text-white" />
        <span className="text-sm font-medium text-white">Share</span>
      </motion.button>
    </div>
  );
}
