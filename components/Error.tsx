"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Caught by error.tsx:", error);
  }, [error]);

  // Clean up the error string if it comes from Convex
  const isConvexError = error.message.includes("ConvexError");
  const displayMessage = isConvexError 
    ? error.message.replace(/\[.*?\]\s*ConvexError:\s*/, "") // Strips out the Convex brackets
    : "An unexpected error occurred while loading this page.";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-4 border border-red-500/20">
        <AlertTriangle className="w-12 h-12 text-red-400" />
      </div>
      
      <h2 className="text-2xl font-semibold text-white mb-2">
        Something went wrong
      </h2>
      
      <p className="text-gray-400 mb-8 max-w-md">
        {displayMessage}
      </p>

      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-3 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors border border-blue-500/20"
      >
        <RefreshCcw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}