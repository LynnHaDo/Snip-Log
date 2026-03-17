"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { ReactNode } from "react";

interface NavItemProps {
  href?: string;
  title?: string;
  icon?: ReactNode;
  element?: ReactNode;
}

export default function NavItem({ href, title, icon, element }: NavItemProps) {
  return (
    <AnimatePresence>
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`px-4 py-1.5 rounded-lg border mt-2 bg-light/95 backdrop-blur-xl
           rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-gray-700 inset-0 shadow-2xl`}
      >
        {element ?
        <div className="flex items-center gap-2">
            {icon}
            {element}
        </div> : 
        <Link href={href || '/'} className={`flex items-center gap-2`}>
          {icon}
          <span className="text-sm font-medium text-highlight-400/90 hover:text-highlight-300">
            {title}
          </span>
        </Link>}
      </motion.div>
    </AnimatePresence>
  );
}
