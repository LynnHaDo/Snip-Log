"use client"

import { Editor } from "@monaco-editor/react";

export default function EditorWidget() {
    return (
        <div>
            <Editor height="90vh" defaultLanguage="python" defaultValue="# Hello world!"/>
        </div>
    );
}
