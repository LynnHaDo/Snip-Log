"use client";

import { Editor, EditorProps, Monaco } from "@monaco-editor/react";
import { useClerk } from "@clerk/nextjs";
import {
  DEFAULT_CODE_KEY_PREFIX,
  DEFAULT_EDITOR_FONT_SIZE,
  DEFAULT_EDITOR_FONT_SIZE_KEY,
  DEFAULT_LANGUAGE,
  DEFAULT_MONACO_CODE_CONFIGS,
} from "../_constants/editorConfig";
import { LANGUAGES_CONFIGS } from "../_constants/languageConfig";
import { useEffect, useRef, useState } from "react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import Image from "next/image";
import { RotateCcwIcon, ShareIcon, TypeIcon } from "lucide-react";
import { motion } from "motion/react";
import { defineMonacoThemes } from "../_constants/themeConfig";
import { EditorWidgetSkeleton } from "./EditorWidgetSkeleton";
import ShareSnippetDialog from "./ShareSnippetDialog";
import useMounted from "@/hooks/useMounted";
import { DEFAULT_STYLE } from "../_constants/styleConfig";

export default function EditorWidget() {
  const clerk = useClerk();
  const mounted = useMounted();
  const editorRef = useRef<EditorProps>(null);
  const [isShareDialogOpened, setIsShareDialogOpened] = useState(false);
  const { configs, setFontSize, getLanguageImageSrc } = useCodeEditorStore();

  useEffect(() => {
    const savedCode = localStorage.getItem(
      `${DEFAULT_CODE_KEY_PREFIX}-${configs.language || DEFAULT_LANGUAGE}`
    );
    const currentCode =
      savedCode || LANGUAGES_CONFIGS[configs.language].defaultCode;
    if (editorRef.current) {
      editorRef.current.value = currentCode;
    }
  }, [configs.language, editorRef]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem(DEFAULT_EDITOR_FONT_SIZE_KEY);
    setFontSize(
      savedFontSize != null ? parseInt(savedFontSize) : DEFAULT_EDITOR_FONT_SIZE
    );
  }, [configs.fontSize]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGES_CONFIGS[configs.language].defaultCode;
    if (editorRef.current) editorRef.current.value = defaultCode;
    localStorage.removeItem(`${DEFAULT_CODE_KEY_PREFIX}-${configs.language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value)
      localStorage.setItem(
        `${DEFAULT_CODE_KEY_PREFIX}-${configs.language}`,
        value
      );
  };

  const handleEditorDidMount = (editor: any, monaco: Monaco) => {
    editorRef.current = editor;
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    localStorage.setItem(DEFAULT_EDITOR_FONT_SIZE_KEY, newSize.toString());
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      <div className={`relative bg-[${DEFAULT_STYLE.backgroundColor}]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-[${DEFAULT_STYLE.backgroundColorLight}] ring-1 ring-white/5`}>
              <Image
                src={getLanguageImageSrc()}
                alt="Logo"
                width={DEFAULT_STYLE.languageLogoSize}
                height={DEFAULT_STYLE.languageLogoSize}
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500">
                Write and execute your code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Font Size Slider */}
            <div className={`flex items-center gap-3 px-3 py-2 bg-[${DEFAULT_STYLE.backgroundColorLight}] rounded-lg ring-1 ring-white/5`}>
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={configs.fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(parseInt(e.target.value))
                  }
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {configs.fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className={`p-2 bg-[${DEFAULT_STYLE.backgroundColorLight}] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors`}
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>

            {/* Share Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsShareDialogOpened(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
            >
              <ShareIcon className="size-4 text-white" />
              <span className="text-sm font-medium text-white">Share</span>
            </motion.button>
          </div>
        </div>

        {/* Editor  */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {clerk.loaded ? (
            <Editor 
              height="600px"
              language={LANGUAGES_CONFIGS[configs.language].monacoLanguage}
              onChange={handleEditorChange}
              theme={configs.theme}
              beforeMount={defineMonacoThemes}
              onMount={handleEditorDidMount}
              options={
                DEFAULT_MONACO_CODE_CONFIGS
              }
            />
          ) : (
            <EditorWidgetSkeleton />
          )}
        </div>
      </div>
      {isShareDialogOpened && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpened(false)} />
      )}
    </div>
  );
}
