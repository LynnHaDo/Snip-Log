"use client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface OutputBlockProps {
  text: string | undefined;
  textClassName: string;
  title: string;
}

const OutputBlock = ({ title, text, textClassName }: OutputBlockProps) => {
  if (!text) return null;
  
  const [isExpanded, setIsExpanded] = useState(false);
  const lines = text.split("\n");
  const displayText = isExpanded ? text : lines.slice(0, 6).join("\n");
  console.log(lines.length)

  return (
    <div className="mt-4 p-4 rounded-lg bg-black/40 relative">
      <h4 className="text-sm font-medium text-gray-400 mb-2">{title}</h4>
      <pre className={`text-sm ${textClassName}`}>{displayText}</pre>
      {lines.length > 6 && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute bottom-2 right-2 px-2 py-1 bg-[#012840] text-[#41BF9B] rounded text-xs flex items-center 
          gap-1 hover:bg-blue-500/30 transition-colors"
        >
          {isExpanded ? (
            <>
              Show Less <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Show More <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>
      )}
    </div>
  );
};

export default OutputBlock;
