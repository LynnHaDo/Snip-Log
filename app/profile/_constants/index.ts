import { ListVideo, LucideProps, Star } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

export type TabType = "executions" | "starred"

export interface Tab {
    id: TabType,
    label: string,
    icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>
}

export const TABS: Tab[] = [
  {
    id: "executions",
    label: "Code Executions",
    icon: ListVideo,
  },
  {
    id: "starred",
    label: "Starred Snippets",
    icon: Star,
  },
];