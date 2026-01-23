"use client";

import useUserSubscriptionStatus from "@/hooks/useUserSubscriptionStatus";
import LanguageSelector from "./LanguageSelector";
import ThemeSelector from "./ThemeSelector";
import { ShareIcon } from "lucide-react";
import RunButton from "./RunButton";
import { motion } from "motion/react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";

export default function ControlWidget() {
  //const isUserPro = useUserSubscriptionStatus();
  const { setIsShareCodeSnippetDialogOpened } = useCodeEditorStore();

  return (
    <div className="flex items-center gap-3">
      <ThemeSelector />
      <LanguageSelector hasAccess={Boolean(true)} />
      <RunButton />

      {/* Share Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsShareCodeSnippetDialogOpened(true)}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-highlight opacity-90 hover:opacity-100 transition-opacity`}
      >
        <ShareIcon className="size-4 text-white" />
        <span className="text-sm font-medium text-white">Share</span>
      </motion.button>
    </div>
  );
}
