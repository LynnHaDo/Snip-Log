"use client"

import { Editor } from "@monaco-editor/react";
import { useClerk } from "@clerk/nextjs";
import { DEFAULT_CODE_KEY_PREFIX, DEFAULT_EDITOR_FONT_SIZE, DEFAULT_EDITOR_FONT_SIZE_KEY, DEFAULT_LANGUAGE } from "@/constants/editorConstants";
import { LANGUAGES_CONFIGS } from "../_constants/languageConfig";
import { useEffect, useState } from "react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";

export default function EditorWidget() {
    const clerk = useClerk();
    const [isShareDialogOpened, setIsShareDialogOpened] = useState(false);
    const { configs, editor, setFontSize, setEditor } = useCodeEditorStore();

    useEffect(() => {
        const savedCode = localStorage.getItem(`${DEFAULT_CODE_KEY_PREFIX}-${configs.language}`);
        const currentCode = savedCode || LANGUAGES_CONFIGS[configs.language].defaultCode;
        if (editor) {
            editor.defaultValue = currentCode;
        }
    }, [configs.language, editor])

    useEffect(() => {
        const savedFontSize = localStorage.getItem(DEFAULT_EDITOR_FONT_SIZE_KEY);
        setFontSize(savedFontSize != null ? parseInt(savedFontSize) : DEFAULT_EDITOR_FONT_SIZE);
    }, [configs.fontSize])

    const handleRefresh = () => {}
    const handleEditorChange = () => {}
    const handleFontSizeChange = () => {}

    return (
        <div>
            {clerk.loaded && <Editor height="90vh" defaultLanguage={DEFAULT_LANGUAGE} defaultValue={LANGUAGES_CONFIGS[DEFAULT_LANGUAGE].defaultCode}/>}
        </div>
    );
}
