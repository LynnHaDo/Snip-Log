import React from "react"

interface LanguageSelectorProps {
    language: string;
    setLanguage: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    language,
    setLanguage
}) => {
    const languages = [
        { id: "python", name: "Python (3.8.1)" },
        { id: "java", name: "Java (OpenJDK 13.0.1)"}
    ]

    return (
        <select 
            value={language} 
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 focus:ring-2 
                      focus:ring-blue-500 focus:outline-none
                      transition-colors duration-200 hover:border-blue-500">
            {
                languages.map((lang) => (
                    <option key={lang.id} value={lang.id} className="bg-gray-800">
                        {lang.name}
                    </option>
                ))
            }
        </select>
    )
}