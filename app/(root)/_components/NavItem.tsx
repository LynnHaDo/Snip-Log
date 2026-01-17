"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ReactNode } from "react";
import { DEFAULT_STYLE } from "../_constants/styleConfig";

interface NavItemProps {
  href: string;
  title: string;
  icon: ReactNode;
}

export default function NavItem({ href, title, icon }: NavItemProps) {
  return (
    <AnimatePresence>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`px-4 py-1.5 rounded-lg border mt-2 bg-[${DEFAULT_STYLE.backgroundColorLight}]/95 backdrop-blur-xl
           rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-gray-700 inset-0 shadow-2xl`}
      >
        <Link href={href} className={`flex items-center gap-2`}>
          {icon}
          <span className="text-sm font-medium text-[#41BF9B]-400/90 hover:text-[#41BF9B]-300">
            {title}
          </span>
        </Link>
      </motion.div>
    </AnimatePresence>
  );
}
