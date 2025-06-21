import { Cloud, Github, Laptop, Moon, Sun } from "lucide-react";
import { siGithub } from "simple-icons";

const THEME_ICONS: Record<string, React.ReactNode> = {
  "vs-dark": <Moon className="size-4" />,
  "vs-light": <Sun className="size-4" />,
  "github-dark": <div className="size-4">{siGithub.svg}</div>,
  monokai: <Laptop className="size-4" />,
  "solarized-dark": <Cloud className="size-4" />,
};

export default function ThemeSelector() {
    return <></>
}