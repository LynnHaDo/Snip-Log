export interface Language {
    id: string,
    label: string,
    logoPath: string,
    monacoLanguage: string,
    defaultCode: string,
    runtimeConfig: LanguageRuntime
}

export interface LanguageRuntime {
    language: string,
    version: string
}