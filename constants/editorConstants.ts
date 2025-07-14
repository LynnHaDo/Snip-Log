import { CodeEditorConfigs } from "@/types/codeEditor";

export const DEFAULT_LANGUAGE_KEY = "editor-language";
export const DEFAULT_LANGUAGE = "python"

export const DEFAULT_THEME_KEY = "editor-theme";
export const DEFAULT_THEME = "vs-dark"

export const DEFAULT_EDITOR_FONT_SIZE_KEY = "editor-font-size";
export const DEFAULT_EDITOR_FONT_SIZE = 16;

export const DEFAULT_CODE_CONFIGS: CodeEditorConfigs = {
    language: DEFAULT_LANGUAGE,
    theme: DEFAULT_THEME,
    fontSize: DEFAULT_EDITOR_FONT_SIZE
}

export const DEFAULT_CODE_SUBMISSION_URL = "https://emkc.org/api/v2/piston/execute"