import CopyButton from "./CopyButton";
import { Editor } from "@monaco-editor/react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { defineMonacoThemes } from "@/app/(root)/_constants/themeConfig";
import { STATIC_MONACO_CODE_CONFIGS } from "@/app/(root)/_constants/editorConfig";

const CodeBlock = ({ language, code }: { language: string; code: string }) => {
  const trimmedCode = code
    .split("\n") // split into lines
    .map((line) => line.trimEnd()) // remove trailing spaces from each line
    .join("\n"); // join back into a single string
  
  const { theme, fontSize } = useCodeEditorStore();

  return (
    <div className="my-4 bg-[#0a0a0f] rounded-lg overflow-hidden border border-[#ffffff0a]">
      {/* header bar showing language and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#ffffff08]">
        {/* language indicator with icon */}
        <div className="flex items-center gap-2">
          <img src={`/${language}.png`} alt={language} className="size-4 object-contain" />
          <span className="text-sm text-gray-400">{language || "plaintext"}</span>
        </div>
        {/* button to copy code to clipboard */}
        <CopyButton code={trimmedCode} />
      </div>

      {/* code block with syntax highlighting */}
      <div className="relative">
        <Editor
            height="600px"
            language={language}
            value={trimmedCode}
            theme={theme}
            beforeMount={defineMonacoThemes}
            options={{
              fontSize: fontSize,
              ...STATIC_MONACO_CODE_CONFIGS,
            }}
          />
      </div>
    </div>
  );
};

export default CodeBlock;