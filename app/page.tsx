'use client'

import { useEffect, useState } from "react";

import { CodeEditor } from "@/components/CodeEditor";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ResultPanel } from "@/components/ResultPanel";
import { STARTER_CODE, LANG_IDS } from "./api/execute/route";

import { Play } from "lucide-react";

export default function Home() {
    const [code, setCode] = useState<string>("");
    const [lang, setLang] = useState<string>("python");
    const [output, setOutput] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [isRunning, setIsRunning] = useState<boolean>(false);

    useEffect(() => {
        setCode(STARTER_CODE[lang as keyof typeof STARTER_CODE])
    }, [lang])

    return (
        <></>
    );
}
