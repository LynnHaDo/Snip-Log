import ControlWidget from "./_components/ControlWidget";
import EditorWidget from "./_components/EditorWidget";
import OutputWidget from "./_components/OutputWidget";

export default function Home() {
  return (
    <div className="grid justify-items-center w-full">
      <ControlWidget />
      <div className="grid grid-cols-2 py-4 gap-3 w-full">
        <EditorWidget />
        <OutputWidget />
      </div>
    </div>
  );
}
