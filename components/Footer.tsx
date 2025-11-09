import { SquareCode } from "lucide-react";
import Link from "next/link";
import Logo from "./Logo";

export function Footer({ slogan }: { slogan: string }) {
  return (
    <footer className="relative mt-8">
      <div className="flex items-center lg:justify-between justify-center py-6 mb-4">
        <div className="lg:flex items-center gap-8 text-gray-400">
          <Logo className="size-5" />
          <span>{slogan}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/support"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            Support
          </Link>
          <Link
            href="/privacy"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/terms"
            className="text-gray-400 hover:text-gray-300 transition-colors"
          >
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
