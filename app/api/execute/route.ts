import { NextResponse } from 'next/server'

const LANG_IDS = {
    python: 71,
    java: 62
}

const JUDGE0_API_URL = process.env.JUDGE0_API_URL
const RAPID_API_KEY = process.env.RAPID_API_KEY
const RAPID_API_HOST = process.env.RAPID_API_HOST

async function submitCode(sourceCode: string, languageId: number) {
    const response = await fetch(`${JUDGE0_API_URL}/submissions`, {
        method: "POST",
        headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": RAPID_API_KEY!,
            "X-RapidAPI-Host": RAPID_API_HOST!,
        },
        body: JSON.stringify({
            source_code: sourceCode,
            language_id: languageId,
            stdin: ""
        })
    })

    const data = await response.json()
    return data.token 
}