import type { Metadata } from "next";

export const DEFAULT_LANGUAGE_KEY = "editor-language";
export const DEFAULT_LANGUAGE = "python";

export const DEFAULT_THEME_KEY = "editor-theme";
export const DEFAULT_THEME = "vs-dark";

export const DEFAULT_EDITOR_FONT_SIZE_KEY = "editor-font-size";
export const DEFAULT_EDITOR_FONT_SIZE = 16;

export const DEFAULT_CODE_KEY_PREFIX = "editor-code";

export const DEFAULT_CODE_CONFIGS = {
  language: DEFAULT_LANGUAGE,
  theme: DEFAULT_THEME,
  fontSize: DEFAULT_EDITOR_FONT_SIZE,
};

export const METADATA: Metadata = {
  title: "SnipLog",
  description: "code diary for leetcode procrastinators",
};

export const MONACO_RENDER_WHITESPACE = "selection" as const;
export const DEFAULT_MONACO_CURSOR_BLINKING = "smooth" as const;
export const DEFAULT_MONACO_RENDER_LINE_HIGHLIGHT = "all" as const;
export const DEFAULT_MONACO_EDITOR_FONT_FAMILY =
  '"Fira Code", "Cascadia Code", Consolas, monospace';

export const DEFAULT_MONACO_CODE_CONFIGS = {
  minimap: { enabled: false },
  automaticLayout: true,
  scrollBeyondLastLine: false,
  padding: { top: 16, bottom: 16 },
  renderWhitespace: MONACO_RENDER_WHITESPACE,
  fontFamily: DEFAULT_MONACO_EDITOR_FONT_FAMILY,
  fontLigatures: true,
  cursorBlinking: DEFAULT_MONACO_CURSOR_BLINKING,
  smoothScrolling: true,
  contextmenu: true,
  renderLineHighlight: DEFAULT_MONACO_RENDER_LINE_HIGHLIGHT,
  lineHeight: 1.6,
  letterSpacing: 0.5,
  roundedSelection: true,
  scrollbar: {
    verticalScrollbarSize: 8,
    orizontalScrollbarSize: 8,
  },
};

export const STATIC_MONACO_CODE_CONFIGS = {
  minimap: { enabled: false },
  readOnly: true,
  automaticLayout: true,
  scrollBeyondLastLine: false,
  padding: { top: 16 },
  renderWhitespace: MONACO_RENDER_WHITESPACE,
  fontFamily: DEFAULT_MONACO_EDITOR_FONT_FAMILY,
  fontLigatures: true,
};
