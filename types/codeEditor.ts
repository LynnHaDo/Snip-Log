import { EditorProps } from "@monaco-editor/react";
import { Id } from "@/convex/_generated/dataModel";

export interface ExecuteCodeResponse {
  compile?: {
    output: string;
  };
  run?: {
    output: string;
    stderr: string;
  };
}

export interface ExecutionResult {
  code: string;
  output: string;
  error: string | null;
}

export interface CodeEditorConfigs {
    language: string; 
    theme: string;
    fontSize: number;
}

export interface CodeEditorState {
  configs: CodeEditorConfigs;
  output: string;
  isRunning: boolean;
  error: string | null;
  code: string;
  executionResult: ExecutionResult | null;

  setCode: (code: string) => void;
  setLanguage: (language: string) => void;
  setTheme: (theme: string) => void;
  getLanguageImageSrc: () => string;
  setFontSize: (fontSize: number) => void;
  runCode: () => Promise<void>;
}

export interface Snippet {
  _id: Id<"snippets">;
  _creationTime: number;
  userId: string;
  language: string;
  code: string;
  title: string;
  userName: string;
}