import React from "react"

interface OutputPanelProps {
    output: string;
    error: string
}

export const ResultPanel: React.FC<OutputPanelProps> = ({ output, error }) => {
    return (
        <div className="rounded-lg bg-gray-800 border border-gray-700 p-4 h-full overflow-auto">
            <div className="text-sm font-mono">
                {
                    error ? (
                        <div className="text-red-400 bg-red-900/20 rounded-lg border border-red-800">
                            {error}
                        </div>
                    ) : (
                        <pre className="whitespace-pre-wrap text-gray-100">{output}</pre>
                    )
                }
            </div>
        </div>
    )
}