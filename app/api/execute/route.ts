import { NextResponse } from 'next/server'

export const LANG_IDS = {
    python: 71,
    java: 62
}

export const STARTER_CODE = {
    python: '# Example:\nprint("Hello, World!")',
    java: '// Example:\nSystem.out.println("Hello, World!")'
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

async function getResult(token: string) {
    const response = await fetch(`${JUDGE0_API_URL}/submissions/${token}`, {
        method: "GET",
        headers: {
            "X-RapidAPI-Key": RAPID_API_KEY!,
            "X-RapidAPI-Host": RAPID_API_HOST!
        }
    })

    return await response.json()
}

export async function POST(request: Request) {
    try {
        const { code, language } = await request.json()

        // Get language ID 
        const languageId = LANG_IDS[language as keyof typeof LANG_IDS]

        if (!languageId) {
            return NextResponse.json(
                { error: "Unsupported Language"},
                { status: 400 }
            )
        }

        let sourceCode = code;
        if (language == "java") {
             // Wrap Java code in Main class
             sourceCode = `
                public class Main {
                    public static void main(String[] args) {
                        ${code}
                    }
                }
             `
        }

        // Submit code for execution
        const token = await submitCode(sourceCode, languageId)

        // Wait for result 
        let result;
        for (let i = 0; i < 10; i++) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            result = await getResult(token);
            if (result.status.id !== 1 && result.status.id !== 2) {
                break;
            }
        }

        if (result.status.id === 3) {
            // Accepted
            return NextResponse.json({
                output: result.stdout || "Code executed successfully with no output.",
                error: null
            })
        } 
        else if (result.status.id === 6) {
            // Compilation Error
            return NextResponse.json({
                output: null,
                error: result.compile_output
            })
        }
        else if (result.stderr) {
            return NextResponse.json({
                output: null,
                error: result.stderr 
            })
        }
        else {
            return NextResponse.json({
                output: null,
                error: result.status.description
            })
        }
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        )
    }
}