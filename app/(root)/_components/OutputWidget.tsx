"use client";

import useMounted from "@/hooks/useMounted";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { AlertTriangle, CheckCircle, Clock, Terminal } from "lucide-react";
import { OutputPanelSkeleton } from "./EditorWidgetSkeleton";
import { DEFAULT_STYLE } from "../_constants/styleConfig";

export default function OutputWidget() {
  const mounted = useMounted();
  const { output, isRunning, error } = useCodeEditorStore();

  if (!mounted) return null;

  return (
    <div className={`relative bg-[${DEFAULT_STYLE.backgroundColor}]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-[${DEFAULT_STYLE.backgroundColorLight}] ring-1 ring-white/5`}>
            <Terminal className={`w-4 h-4 text-logo`}/>
          </div>
          <span className="text-sm font-medium text-gray-300">Output</span>
        </div>
      </div>

      {/* Output Area */}
      <div className="relative">
        <div
          className="relative bg-[#1e1e2e]/50 backdrop-blur-sm border border-[#313244] 
        rounded-xl p-4 h-[600px] overflow-auto font-mono text-sm"
        >
          {isRunning ? (
            <OutputPanelSkeleton />
          ) : error ? (
            <div className="flex items-start gap-3 text-red-400">
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-1" />
              <div className="space-y-1">
                <div className="font-medium">Execution Error</div>
                <pre className="whitespace-pre-wrap text-red-400/80">
                  {error}
                </pre>
              </div>
            </div>
          ) : output ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 mb-3">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Execution Successful</span>
              </div>
              <pre className="whitespace-pre-wrap text-gray-300">{output}</pre>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-500">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 ring-1 ring-gray-700/50 mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <p className="text-center">
                Run your code to see the output...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
