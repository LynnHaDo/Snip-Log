import Header from "./_components/Header";
import EditorWidget from "./_components/EditorWidget";
import OutputWidget from "./_components/OutputWidget";
import { Footer } from "@/components/Footer";
import { METADATA } from "./_constants/editorConfig";

export default function Home() {
    return (
        <div className="min-h-screen h-100">
            <div className="max-w-[1800px] mx-auto p-4 d-flex flex-column">
                <Header />  

                <div className = "grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <EditorWidget />
                    <OutputWidget />
                </div>

                <Footer slogan={METADATA.description as string}/>
            </div>
        </div>
    );
}
