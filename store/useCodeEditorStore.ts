import {
  DEFAULT_CODE_CONFIGS,
  DEFAULT_EDITOR_FONT_SIZE,
  DEFAULT_LANGUAGE,
  DEFAULT_LANGUAGE_KEY,
  DEFAULT_THEME,
  DEFAULT_THEME_KEY,
  DEFAULT_EDITOR_FONT_SIZE_KEY,
  DEFAULT_CODE_KEY_PREFIX,
} from "@/app/(root)/_constants/editorConfig";
import { CodeEditorState } from "@/types/codeEditor";
import { create } from "zustand";
import { LANGUAGES_CONFIGS } from "@/app/(root)/_constants/languageConfig";
import { CODE_EXECUTION_API_URL } from "@/constants/api";

function getInitialCodeConfigs() {
  if (typeof window === "undefined") {
    // if we're on the server side
    return DEFAULT_CODE_CONFIGS;
  }

  const selectedLanguage =
    localStorage.getItem(DEFAULT_LANGUAGE_KEY) || DEFAULT_LANGUAGE;
  const selectedTheme =
    localStorage.getItem(DEFAULT_THEME_KEY) || DEFAULT_THEME;
  const selectedFontSize =
    localStorage.getItem(DEFAULT_EDITOR_FONT_SIZE_KEY) ||
    DEFAULT_EDITOR_FONT_SIZE;

  return {
    language: selectedLanguage,
    theme: selectedTheme,
    fontSize: Number(selectedFontSize),
  };
}

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
  const initialCodeConfigs = getInitialCodeConfigs();

  return {
    ...initialCodeConfigs,
    output: "",
    isRunning: false,
    error: null,
    code: "",

    setCode: (code: string) => {
      localStorage.setItem(
        `${DEFAULT_CODE_KEY_PREFIX}-${get().language}`,
        code
      );
      set({ code });
    },

    setLanguage: (newLanguage: string) => {
      // Save current language code before switching
      const currentCode = get().code;

      if (currentCode) {
        localStorage.setItem(
          `${DEFAULT_CODE_KEY_PREFIX}-${get().language}`,
          currentCode
        );
      }

      localStorage.setItem(DEFAULT_LANGUAGE_KEY, newLanguage);

      set({
        language: newLanguage,
        output: "",
        error: null,
      });
    },

    setTheme: (newTheme: string) => {
      localStorage.setItem(DEFAULT_THEME_KEY, newTheme);
      set({
        theme: newTheme,
      });
    },

    setFontSize: (newFontSize: number) => {
      localStorage.setItem(DEFAULT_EDITOR_FONT_SIZE_KEY, String(newFontSize));
      set({
        fontSize: newFontSize,
      });
    },

    getLanguageImageSrc: () => {
      return `/${get().language}.png`;
    },

    runCode: async () => {
      const { language, code } = get();

      if (!code) {
        set({ error: "Please enter some code" });
        return;
      }

      set({ isRunning: true, error: null, output: "" });

      try {
        const runtimeConfig = LANGUAGES_CONFIGS[language].runtimeConfig;
        const response = await fetch(`${CODE_EXECUTION_API_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: code,
            runtimeConfig: runtimeConfig,
          }),
        });

        if (response.ok) {
          const result = await response.json();
          console.log(
            `Successfully completed executing code. Status: ${result.status}`
          );
          set({
            output: result.output.trim() || "",
            error: result.error,
          });
        }
      } catch (error) {
        console.log("Error running code: ", error);
        set({
          error: "There is an issue with the server. Please try again later.",
          output: "",
        });
      } finally {
        set({ isRunning: false });
      }
    },
  };
});

export const getExecutionResult = () => {
    let { code, output, error } = useCodeEditorStore.getState()
    return {
        code: code,
        output: output,
        error: error
    }
};
