import Header from "./_components/Header";
import EditorWidget from "./_components/EditorWidget";
import OutputWidget from "./_components/OutputWidget";

export default function Home() {
    return (
        <div className="min-h-screen">
            <div className="max-w-[1800px] mx-auto p-4">
                <Header />  

                <div className = "grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <EditorWidget />
                    <OutputWidget />
                </div>
            </div>
        </div>
    );
}
