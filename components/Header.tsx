import { METADATA } from "../app/(root)/_constants/editorConfig";
import Logo from "@/components/Logo";
import useUserSubscriptionStatus from '@/hooks/useUserSubscriptionStatus'
import { BadgeDollarSign, Code2, Sparkles } from "lucide-react";
import Link from "next/link";

import HeaderProfileBtn from "../app/(root)/_components/HeaderProfileBtn";
import NavItem from "../app/(root)/_components/NavItem";

async function Header() {
  const isUserPro = useUserSubscriptionStatus()

  return (
    <div className="relative z-11">
      <div
        className="flex items-center lg:justify-between 
                            justify-center py-6 mb-4 rounded-lg"
      >
        <div className="hidden lg:flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group relative">
            {/* Logo */}
            <div className="relative p-2 rounded-xl ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
              <Logo
                className={`size-6 transform text-logo -rotate-6 group-hover:rotate-0 transition-transform duration-500`}
              />
            </div>

            <div className="flex flex-col">
              <span
                className={`block text-lg text-logo font-semibold bg-clip-text`}
              >
                {METADATA.title as string}
              </span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            <NavItem
              href="/snippets"
              title="Snippets"
              icon={
                <Code2 className="w-4 h-4 text-highlight-400 hover:text-highlight-300" />
              }
            />
            <NavItem
              href="/pricing"
              title="Pricing"
              icon={
                <BadgeDollarSign className="w-4 h-4 text-amber-400 hover:text-amber-300" />
              }
            />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {!!isUserPro && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 bg-gradient-to-r">
              <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
              <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                Pro
              </span>
            </div>
          )}

          <div className="pl-3 border-l border-gray-800">
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
