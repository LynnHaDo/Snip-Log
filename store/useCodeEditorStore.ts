import { DEFAULT_CODE_CONFIGS, DEFAULT_EDITOR_FONT_SIZE, DEFAULT_LANGUAGE, DEFAULT_LANGUAGE_KEY, DEFAULT_THEME, DEFAULT_THEME_KEY, DEFAULT_EDITOR_FONT_SIZE_KEY, DEFAULT_CODE_SUBMISSION_URL } from "@/constants/editorConstants";
import { CodeEditorConfigs, CodeEditorState } from "@/types/codeEditor";
import { create } from "zustand";
import { EditorProps } from "@monaco-editor/react";
import { LANGUAGES_CONFIGS } from "@/app/(root)/_constants/languageConfig";

function getInitialCodeConfigs(): CodeEditorConfigs {
    if (typeof window === "undefined") {
        // if we're on the server side
        return DEFAULT_CODE_CONFIGS;
    }

    const selectedLanguage = localStorage.getItem(DEFAULT_LANGUAGE_KEY) || DEFAULT_LANGUAGE;
    const selectedTheme = localStorage.getItem(DEFAULT_THEME_KEY) || DEFAULT_THEME;
    const selectedFontSize = localStorage.getItem(DEFAULT_EDITOR_FONT_SIZE_KEY) || DEFAULT_EDITOR_FONT_SIZE;

    return {
        language: selectedLanguage,
        theme: selectedTheme,
        fontSize: Number(selectedFontSize)
    }
}

export const useCodeEditorStore = create<CodeEditorState>((set, get) => {
    const initialCodeConfigs: CodeEditorConfigs = getInitialCodeConfigs();

    return {
        configs: initialCodeConfigs,
        output: "",
        isRunning: false,
        error: null,
        editor: null,
        executionResult: null,

        setEditor: (editor: EditorProps) => {
            const savedCode = localStorage.getItem(`editor-code-${get().configs.language}`);
            if (savedCode) editor.value = savedCode;

            set({ editor });
        },

        getCode: () => get().editor?.value || "",

        setLanguage: (newLanguage: string) => {
            // Save current language code before switching
            const currentCode = get().editor?.value;

            if (currentCode) {
                localStorage.setItem(`editor-code-${get().configs.language}`, currentCode);
            }

            localStorage.setItem(DEFAULT_LANGUAGE_KEY, newLanguage);

            get().configs.language = newLanguage
            set({
                output: "",
                error: null,
            });
        },

        setTheme: (theme: string) => {
            localStorage.setItem(DEFAULT_THEME_KEY, theme);
            get().configs.theme = theme;
        },

        setFontSize: (fontSize: number) => {
            localStorage.setItem(DEFAULT_EDITOR_FONT_SIZE_KEY, String(fontSize));
            get().configs.fontSize = fontSize;
        },

        runCode: async () => {
            const { configs, getCode } = get();

            const language = configs.language;
            const code = getCode();

            if (!code) {
                set({ error: "Please enter some code" });
                return;
            }

            set({ isRunning: true, error: null, output: "" });

            try {
                const runtime = LANGUAGES_CONFIGS[language].pistonRuntime;
                const response = await fetch(DEFAULT_CODE_SUBMISSION_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        language: runtime.language,
                        version: runtime.version,
                        files: [{ content: code }],
                    }),
                });

                const data = await response.json();

                console.log("Code execution result back from piston:", data);

                // handle API-level erros
                if (data.message) {
                    set({ error: data.message, executionResult: { code, output: "", error: data.message } });
                    return;
                }

                function setError(errorSource: any) {
                    const error = errorSource.stderr || errorSource.output;
                    set({
                        error,
                        executionResult: {
                            code,
                            output: "",
                            error
                        },
                    });
                }

                // handle compilation errors
                if (data.compile && data.compile.code !== 0) {
                    setError(data.compile);
                    return;
                }

                if (data.run && data.run.code !== 0) {
                    setError(data.run);
                    return;
                }

                // if we get here, execution was successful
                const output = data.run.output;

                set({
                    output: output.trim(),
                    error: null,
                    executionResult: {
                        code,
                        output: output.trim(),
                        error: null,
                    },
                });
            } catch (error) {
                console.log("Error running code:", error);
                set({
                    error: "Error running code",
                    executionResult: { code, output: "", error: "Error running code" },
                });
            } finally {
                set({ isRunning: false });
            }
        }
    }
})