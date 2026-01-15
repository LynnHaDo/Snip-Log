import { Id } from "@/convex/_generated/dataModel";

export interface CodeEditorState {
  fontSize: number;
  language: string;
  theme: string;
  output: string;
  isRunning: boolean;
  error: string | null;
  code: string;

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