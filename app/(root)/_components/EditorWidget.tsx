"use client";

import { Editor, Monaco } from "@monaco-editor/react";
import { editor } from "monaco-editor";
import { useClerk } from "@clerk/nextjs";
import {
  DEFAULT_CODE_KEY_PREFIX,
  DEFAULT_EDITOR_FONT_SIZE,
  DEFAULT_EDITOR_FONT_SIZE_KEY,
  DEFAULT_LANGUAGE,
  DEFAULT_MONACO_CODE_CONFIGS,
} from "../_constants/editorConfig";
import { LANGUAGES_CONFIGS } from "../_constants/languageConfig";
import { useEffect, useRef } from "react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import Image from "next/image";
import { defineMonacoThemes } from "../_constants/themeConfig";
import { EditorWidgetSkeleton } from "./EditorWidgetSkeleton";
import ShareSnippetDialog from "./ShareSnippetDialog";
import useMounted from "@/hooks/useMounted";
import { DEFAULT_STYLE } from "../_constants/styleConfig";
import { motion } from "motion/react";
import { RotateCcwIcon, TypeIcon } from "lucide-react";

export default function EditorWidget() {
  const clerk = useClerk();
  const mounted = useMounted();
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);
  const {
    fontSize,
    language,
    theme,
    setFontSize,
    getLanguageImageSrc,
    setCode,
    isShareCodeSnippetDialogOpened,
    setIsShareCodeSnippetDialogOpened
  } = useCodeEditorStore();

  useEffect(() => {
    const savedCode = localStorage.getItem(
      `${DEFAULT_CODE_KEY_PREFIX}-${language || DEFAULT_LANGUAGE}`,
    );
    const currentCode = savedCode || LANGUAGES_CONFIGS[language].defaultCode;
    if (editorRef.current) {
      editorRef.current.setValue(currentCode);
    }
    setCode(currentCode);
  }, [language, editorRef]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem(DEFAULT_EDITOR_FONT_SIZE_KEY);
    setFontSize(
      savedFontSize != null
        ? parseInt(savedFontSize)
        : DEFAULT_EDITOR_FONT_SIZE,
    );
  }, [fontSize]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGES_CONFIGS[language].defaultCode;
    if (editorRef.current) editorRef.current.setValue(defaultCode);
    localStorage.removeItem(`${DEFAULT_CODE_KEY_PREFIX}-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value && value !== "")
      localStorage.setItem(`${DEFAULT_CODE_KEY_PREFIX}-${language}`, value);
    setCode(value!);
  };

  const handleEditorDidMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
  ) => {
    editorRef.current = editor;
  };

  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    localStorage.setItem(DEFAULT_EDITOR_FONT_SIZE_KEY, newSize.toString());
  };

  if (!mounted) return null;

  return (
    <div className="relative">
      <div
        className={`relative bg-dark/90 backdrop-blur rounded-xl border border-white/[0.05] p-6`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-lg bg-dark ring-1 ring-white/5`}
            >
              <Image
                src={getLanguageImageSrc()}
                alt="Logo"
                width={DEFAULT_STYLE.languageLogoSize}
                height={DEFAULT_STYLE.languageLogoSize}
              />
            </div>
            <div>
              <h2 className="text-sm font-medium text-gray-300">Code Editor</h2>
              <p className="text-xs text-gray-500">
                Write and execute your code
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Font Size Slider */}
            <div
              className={`flex items-center gap-3 px-3 py-2 bg-dark rounded-lg ring-1 ring-white/5`}
            >
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(parseInt(e.target.value))
                  }
                  className="w-20 h-1 range-slider"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className={`px-3 py-2.5 bg-dark hover:bg-light rounded-lg ring-1 ring-white/5 transition-colors`}
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>
          </div>
        </div>

        {/* Editor  */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {clerk.loaded ? (
            <Editor
              height="600px"
              language={LANGUAGES_CONFIGS[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={handleEditorDidMount}
              options={{
                fontSize: fontSize,
                ...DEFAULT_MONACO_CODE_CONFIGS,
              }}
            />
          ) : (
            <EditorWidgetSkeleton />
          )}
        </div>
      </div>
      {isShareCodeSnippetDialogOpened && (
        <ShareSnippetDialog onClose={() => setIsShareCodeSnippetDialogOpened(false)} />
      )}
    </div>
  );
}
