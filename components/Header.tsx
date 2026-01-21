import { METADATA } from "../app/(root)/_constants/editorConfig";
import Logo from "@/components/Logo";
import { api } from "@/convex/_generated/api";
import { currentUser } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { Code2, Sparkles } from "lucide-react";
import Link from "next/link";

import HeaderProfileBtn from "../app/(root)/_components/HeaderProfileBtn";
import LanguageSelector from "../app/(root)/_components/LanguageSelector";
import ThemeSelector from "../app/(root)/_components/ThemeSelector";
import NavItem from "../app/(root)/_components/NavItem";

async function Header() {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const user = await currentUser();

  const convexUser = await convex.query(api.users.getUser, {
    userId: user?.id || "",
  });

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
                <Code2 className="w-4 h-4 text-[#41BF9B]-400 hover:text-[#41BF9B]-300" />
              }
            />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <ThemeSelector />
            <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
          </div>

          {!convexUser?.isPro && (
            <Link
              href="/pricing"
              className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
                            to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 
                            transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
              <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
                Pro
              </span>
            </Link>
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
