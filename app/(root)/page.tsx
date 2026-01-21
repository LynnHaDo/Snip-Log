import EditorWidget from "./_components/EditorWidget";
import OutputWidget from "./_components/OutputWidget";

export default function Home() {
  return (
    <div className="d-flex flex-column">
      <EditorWidget />
      <OutputWidget />
    </div>
  );
}
