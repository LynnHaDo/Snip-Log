"use client";
import { useUser } from "@clerk/nextjs";
import { usePaginatedQuery, useQuery } from "convex/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/convex/_generated/api";
import ProfileHeader from "./_components/ProfileHeader";
import ProfileHeaderSkeleton from "./_components/ProfileHeaderSkeleton";
import { ChevronRight, Clock, Code, Loader2, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import StarButton from "@/app/(root)/_components/StarButton";
import CodeBlock from "./_components/CodeBlock";
import OutputBlock from './_components/OutputBlock'
import toast from "react-hot-toast";
import { TABS } from "./_constants";

function Profile() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"executions" | "starred">("executions");
  
  // Wait for Clerk to load the user before querying stats
  const userStats = useQuery(api.codeExecutions.getUserStats, isLoaded && user ? {} : "skip");
  const starredSnippets = useQuery(api.snippets.getStarredSnippets, isLoaded && user ? {} : "skip");

  const {
    results: executions,
    status: executionStatus,
    isLoading: isLoadingExecutions,
    loadMore,
  } = usePaginatedQuery(
    api.codeExecutions.getUserExecutions,
    isLoaded && user ? {} : "skip",
    { initialNumItems: 5 }
  );

  const searchParams = useSearchParams();
  const success = searchParams.get("success");

  useEffect(() => {
    if (success === 'true') {
        toast.success("Payment successful! Welcome to Pro 🎉", {
            duration: 5000
        })
        router.replace("/profile", {scroll: false}) // clean up URL
    }
  }, [success, router])

  const userData = useQuery(api.users.getUser, isLoaded && user ? { userId: user.id } : "skip");

  const handleLoadMore = () => {
    if (executionStatus === "CanLoadMore") loadMore(5);
  };

  if (!user && isLoaded) return router.push("/");

  return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Profile Header */}

        {userStats && userData && (
          <ProfileHeader userStats={userStats} userData={userData} user={user!} />
        )}

        {(userStats === undefined || !isLoaded) && <ProfileHeaderSkeleton />}

        {/* Main content */}
        <div
          className="bg-gradient-to-br from-[#12121a] to-[#1a1a2e] rounded-3xl shadow-2xl 
        shadow-black/50 border border-gray-800/50 backdrop-blur-xl overflow-hidden"
        >
          {/* Tabs */}
          <div className="border-b border-gray-800/50">
            <div className="flex space-x-1 p-6">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`group flex items-center gap-2 px-6 py-2.5 rounded-lg transition-all duration-200 relative overflow-hidden ${
                    activeTab === tab.id ? "text-[#41BF9B]" : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-[#012840] rounded-lg"
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  )}
                  <tab.icon className="w-4 h-4 relative z-10" />
                  <span className="text-sm font-medium relative z-10">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-6"
            >
              {/* ACTIVE TAB IS EXECUTIONS: */}
              {activeTab === "executions" && (
                <div className="space-y-6">
                  {executions?.map((execution) => (
                    <div
                      key={execution._id}
                      className="group rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[#012840] hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between p-4 bg-black/30 border border-gray-800/50 rounded-t-xl">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r to-[#012840]-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
                            <Image
                              src={"/" + execution.language + ".png"}
                              alt=""
                              className="rounded-lg relative z-10 object-cover"
                              width={40}
                              height={40}
                            />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">
                                {execution.language}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-400">
                                {new Date(execution._creationTime).toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-xs px-2 py-0.5 rounded-full ${
                                  execution.error
                                    ? "bg-red-500/10 text-red-400"
                                    : "bg-green-500/10 text-green-400"
                                }`}
                              >
                                {execution.error ? "Error" : "Success"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-black/20 rounded-b-xl border border-t-0 border-gray-800/50">
                        <CodeBlock code={execution.code} language={execution.language} />

                        {(execution.error || execution.output) && 
                          <OutputBlock text={execution.error || execution.output} 
                                       textClassName={execution.error ? "text-red-400" : "text-green-400"}
                                        title="Output"/>
                        }
                      </div>
                    </div>
                  ))}

                  {isLoadingExecutions ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-12 h-12 text-gray-600 mx-auto mb-4 animate-spin" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">
                        Loading code executions...
                      </h3>
                    </div>
                  ) : (
                    executions.length === 0 && (
                      <div className="text-center py-12">
                        <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-400 mb-2">
                          No code executions yet
                        </h3>
                        <p className="text-gray-500">Start coding to see your execution history!</p>
                      </div>
                    )
                  )}

                  {/* Load More Button */}
                  {executionStatus === "CanLoadMore" && (
                    <div className="flex justify-center mt-8">
                      <button
                        onClick={handleLoadMore}
                        className="px-6 py-3 bg-[#012840] hover:bg-blue-500/20 text-[#41BF9B] rounded-lg flex items-center gap-2 
                        transition-colors"
                      >
                        Load More
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* ACTIVE TAB IS STARS: */}
              {activeTab === "starred" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {starredSnippets?.map((snippet) => (
                    <div key={snippet._id} className="group relative">
                      <Link href={`/snippets/${snippet._id}`}>
                        <div
                          className="bg-black/20 rounded-xl border border-gray-800/50 hover:border-gray-700/50 
                          transition-all duration-300 overflow-hidden h-full group-hover:transform
                        group-hover:scale-[1.02]"
                        >
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
                                  <Image
                                    src={`/${snippet.language}.png`}
                                    alt={`${snippet.language} logo`}
                                    className="relative z-10"
                                    width={40}
                                    height={40}
                                  />
                                </div>
                                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-sm">
                                  {snippet.language}
                                </span>
                              </div>
                              <div
                                className="absolute top-6 right-6 z-10"
                                onClick={(e) => e.preventDefault()}
                              >
                                <StarButton snippetId={snippet._id} />
                              </div>
                            </div>
                            <h2 className="text-xl font-semibold text-white mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors">
                              {snippet.title}
                            </h2>
                            <div className="flex items-center justify-between text-sm text-gray-400">
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" />
                                <span>{new Date(snippet._creationTime).toLocaleDateString()}</span>
                              </div>
                              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                          <div className="px-6 pb-6">
                            <div className="bg-black/30 rounded-lg p-4 overflow-hidden">
                              <pre className="text-sm text-gray-300 font-mono line-clamp-3">
                                {snippet.code}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}

                  {(!starredSnippets || starredSnippets.length === 0) && (
                    <div className="col-span-full text-center py-12">
                      <Star className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-400 mb-2">
                        No starred snippets yet
                      </h3>
                      <p className="text-gray-500">
                        Start exploring and star the snippets you find useful!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
  );
}
export default Profile;