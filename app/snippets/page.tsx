"use client";

import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect, useRef, useState } from "react";
import SnippetsPageSkeleton from "./_components/SnippetsPageSkeleton";

import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, Code, Grid, Layers, Search, Tag, X } from "lucide-react";
import SnippetCard from "./_components/SnippetCard";
import { MAX_SNIPPETS_TO_LOAD, METADATA } from "./_constants/snippetsConfig";
import { useDebounce } from "@/hooks/useDebounce";

export default function Snippets() {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 300)
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const { results, status, loadMore } = usePaginatedQuery(
    api.snippets.getSnippets,
    {
        keyword: debouncedSearchQuery || undefined,
        language: selectedLanguage || undefined
    },
    { initialNumItems: MAX_SNIPPETS_TO_LOAD },
  );
  const [view, setView] = useState<"grid" | "list">("grid");
  const pageBottomRef = useRef(null);

  const popularLanguages = useQuery(api.snippets.getTopFiveLanguages);
  const filteredSnippets = results

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && status === "CanLoadMore") {
          loadMore(MAX_SNIPPETS_TO_LOAD); // Load the next 12 items
        }
      },
      { threshold: 1.0 },
    );

    if (pageBottomRef.current) observer.observe(pageBottomRef.current);

    return () => observer.disconnect();
  }, [status, loadMore]);

  if (status == 'LoadingFirstPage') {
    return <SnippetsPageSkeleton />
  }

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-12">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r
             from-light to-purple-500/10 text-sm text-gray-400 mb-6"
        >
          <BookOpen className="w-4 h-4" />
          {METADATA.label}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-100 to-gray-300 text-transparent bg-clip-text mb-6"
        >
          {METADATA.title}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-400 mb-8"
        >
          {METADATA.subtitle}
        </motion.p>
      </div>

      {/* Filters Section */}
      <div className="relative max-w-5xl mx-auto mb-12 space-y-6">
        {/* Search */}
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-highlight/20 to-purple-500/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
          <div className="relative flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search snippets by title or author..."
              className="w-full pl-12 pr-4 py-4 bg-light/80 hover:bg-[#1e1e2e] text-white
                  rounded-xl border border-[#313244] hover:border-[#414155] transition-all duration-200
                  placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-highlight/50"
            />
          </div>
        </div>

        {/* Filters Bar */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
            <Tag className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Languages:</span>
          </div>

          {popularLanguages && (
            <>
              {popularLanguages.map(({ language }) => (
                <button
                  key={language}
                  onClick={() =>
                    setSelectedLanguage(
                      language === selectedLanguage ? null : language,
                    )
                  }
                  className={`
                    group relative px-3 py-1.5 rounded-lg transition-all duration-200
                    ${
                      selectedLanguage === language
                        ? "text-highlight-400 bg-highlight/10 ring-1 ring-highlight/50"
                        : "text-gray-400 hover:text-gray-300 bg-[#1e1e2e] hover:bg-[#262637] ring-1 ring-gray-800"
                    }
                  `}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`/${language}.png`}
                      alt={language}
                      className="w-4 h-4 object-contain"
                    />
                    <span className="text-sm">{language}</span>
                  </div>
                </button>
              ))}
            </>
          )}

          {selectedLanguage && (
            <button
              onClick={() => setSelectedLanguage(null)}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-400 hover:text-gray-300 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear
            </button>
          )}

          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {filteredSnippets.length} snippets found
            </span>

            {/* View Toggle */}
            <div className="flex items-center gap-1 p-1 bg-[#1e1e2e] rounded-lg ring-1 ring-gray-800">
              <button
                onClick={() => setView("grid")}
                className={`p-2 rounded-md transition-all ${
                  view === "grid"
                    ? "bg-highlight-500/20 text-highlight-400"
                    : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"
                }`}
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView("list")}
                className={`p-2 rounded-md transition-all ${
                  view === "list"
                    ? "bg-highlight-500/20 text-highlight-400"
                    : "text-gray-400 hover:text-gray-300 hover:bg-[#262637]"
                }`}
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Snippets Grid */}
      <motion.div
        className={`grid gap-6 ${
          view === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1 max-w-3xl mx-auto"
        }`}
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredSnippets.map((snippet) => (
            <SnippetCard key={snippet._id} snippet={snippet} />
          ))}
        </AnimatePresence>
      </motion.div>

      {/* edge case: empty state */}
      {filteredSnippets.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-md mx-auto mt-20 p-8 rounded-2xl overflow-hidden"
        >
          <div className="text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br 
                from-highlight-500/10 to-purple-500/10 ring-1 ring-white/10 mb-6"
            >
              <Code className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-white mb-3">
              No snippets found
            </h3>
            <p className="text-gray-400 mb-6">
              {searchQuery || selectedLanguage
                ? "Try adjusting your search query or filters"
                : "Be the first to share a code snippet with the community"}
            </p>

            {(searchQuery || selectedLanguage) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLanguage(null);
                }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#262637] text-gray-300 hover:text-white rounded-lg 
                    transition-colors"
              >
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        </motion.div>
      )}

      <div ref={pageBottomRef} className="h-10 w-full flex justify-center items-center">
        {status == 'LoadingMore' && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-highlight-500" />}
      </div>
    </div>
  );
}
