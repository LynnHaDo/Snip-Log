"use client"

import { Editor } from "@monaco-editor/react";
import { useClerk } from "@clerk/nextjs";
import { DEFAULT_LANGUAGE } from "@/constants/editorConstants";
import { LANGUAGES_CONFIGS } from "../_constants/languageConfig";

export default function EditorWidget() {
    const clerk = useClerk();

    return (
        <div>
            {clerk.loaded && <Editor height="90vh" defaultLanguage={DEFAULT_LANGUAGE} defaultValue={LANGUAGES_CONFIGS[DEFAULT_LANGUAGE].defaultCode}/>}
        </div>
    );
}
