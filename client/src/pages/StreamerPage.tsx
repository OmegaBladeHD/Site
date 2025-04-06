import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaTwitch, FaYoutube, FaTiktok, FaExternalLinkAlt } from "react-icons/fa";
import ContentCard from "@/components/ContentCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { getStreamer, getTwitchContent, getYoutubeContent, getTiktokContent } from "@/lib/api";
import NotFound from "./error-404";

export default function StreamerPage() {
  const { slug } = useParams();

  const { data: streamer, isLoading: isLoadingStreamer, error } = useQuery({
    queryKey: [`/api/streamers/${slug}`],
    queryFn: () => getStreamer(slug || ''),
    enabled: !!slug
  });

  const { data: twitchContent, isLoading: isLoadingTwitch } = useQuery({
    queryKey: [`/api/streamers/${slug}/twitch`],
    queryFn: () => getTwitchContent(slug || ''),
    enabled: !!slug && !!streamer?.twitchUsername
  });

  const { data: youtubeContent, isLoading: isLoadingYoutube } = useQuery({
    queryKey: [`/api/streamers/${slug}/youtube`],
    queryFn: () => getYoutubeContent(slug || ''),
    enabled: !!slug && !!streamer?.youtubeChannel
  });



  // Handle 404 case
  if (error) {
    return <NotFound />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="py-8 md:py-12 relative"
    >
      <motion.div 
              className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary/30 dark:bg-primary/20 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.2, 0.3],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-primary/20 dark:bg-primary/10 blur-3xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.1, 0.2],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
      <div className="container mx-auto px-4">
        {/* Banner and Profile */}
        {isLoadingStreamer ? (
          <div className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8 shadow-lg">
            <Skeleton className="w-full h-full" />
          </div>
        ) : (
          <motion.div 
            className="relative h-64 md:h-80 rounded-xl overflow-hidden mb-8 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img src={streamer?.bannerImage} alt={`${streamer?.name} Banner`} className="w-full h-full object-cover" />
            <img src={streamer?.profileImage} alt={`${streamer?.name} Profile`} className="absolute bottom-6 left-6 w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white dark:border-primary" />
          </motion.div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: About and Social */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            {isLoadingStreamer ? (
              <>
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="grid grid-cols-1 gap-3">
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <Skeleton className="h-14 w-full rounded-lg" />
                    <Skeleton className="h-14 w-full rounded-lg" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="font-inter text-xl font-bold mb-4 text-primary dark:text-primary-light">À propos</h2>
                  <p className="text-gray-700 dark:text-gray-300">
                    {streamer?.description}
                  </p>
                </motion.div>

                <motion.div 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="font-inter text-xl font-bold mb-4 text-primary dark:text-primary-light">Me suivre</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {streamer?.twitchUsername && (
                      <motion.a 
                        href={`https://www.twitch.tv/${streamer.twitchUsername}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        whileHover={{ x: 5 }}
                      >
                        <FaTwitch className="text-[#9146FF] text-xl" />
                        <span className="font-medium">Twitch</span>
                        <FaExternalLinkAlt className="ml-auto text-gray-500 dark:text-gray-400 text-sm" />
                      </motion.a>
                    )}

                    {streamer?.youtubeChannel && (
                      <motion.a 
                        href={`https://www.youtube.com/@${streamer.youtubeChannel}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        whileHover={{ x: 5 }}
                      >
                        <FaYoutube className="text-[#FF0000] text-xl" />
                        <span className="font-medium">YouTube</span>
                        <FaExternalLinkAlt className="ml-auto text-gray-500 dark:text-gray-400 text-sm" />
                      </motion.a>
                    )}

                    {streamer?.tiktokUsername && (
                      <motion.a 
                        href={`https://www.tiktok.com/@${streamer.tiktokUsername}`} 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        whileHover={{ x: 5 }}
                      >
                        <FaTiktok className="text-black dark:text-white text-xl" />
                        <span className="font-medium">TikTok</span>
                        <FaExternalLinkAlt className="ml-auto text-gray-500 dark:text-gray-400 text-sm" />
                      </motion.a>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </div>

          {/* Right Column: Latest Content */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="font-inter text-xl font-bold mb-6 text-primary dark:text-primary-light">Dernier contenu</h2>

              {(streamer?.youtubeChannel || streamer?.tiktokUsername) ? (
                <Tabs defaultValue={streamer?.twitchUsername ? "twitch" : streamer?.youtubeChannel ? "youtube" : "tiktok"} className="w-full">
                  <TabsList className="mb-6 w-full justify-start border-b border-gray-200 dark:border-gray-700 pb-0">
                    {streamer?.twitchUsername && (
                      <TabsTrigger value="twitch" className="data-[state=active]:border-primary data-[state=active]:text-primary">
                        <FaTwitch className="mr-2" /> Twitch
                      </TabsTrigger>
                    )}
                    {streamer?.youtubeChannel && (
                      <TabsTrigger value="youtube" className="data-[state=active]:border-primary data-[state=active]:text-primary">
                        <FaYoutube className="mr-2" /> YouTube
                      </TabsTrigger>
                    )}
                    </TabsList>

                  {streamer?.twitchUsername && (
                    <TabsContent value="twitch" className="mt-0">
                      <ContentCard
                        type={twitchContent?.type || ""}
                        title={twitchContent?.title || ""}
                        description={twitchContent?.description || ""}
                        thumbnailUrl={twitchContent?.thumbnailUrl || ""}
                        contentUrl={twitchContent?.contentUrl || ""}
                        timeAgo={twitchContent?.timeAgo || ""}
                        isLoading={isLoadingTwitch}
                        isLive={twitchContent?.isLive}
                        platform="twitch"
                        duration={twitchContent?.duration}
                        views={twitchContent?.viewCount?.toLocaleString()}
                      />

                      <div className="mt-6 text-center">
                        <motion.a 
                          href={`https://www.twitch.tv/${streamer.twitchUsername}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-5 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          whileHover={{ y: -3 }}
                        >
                          Voir tous les streams <span className="ml-2">→</span>
                        </motion.a>
                      </div>
                    </TabsContent>
                  )}

                  {streamer?.youtubeChannel && (
                    <TabsContent value="youtube" className="mt-0">
                      <ContentCard
                        type={youtubeContent?.type || ""}
                        title={youtubeContent?.title || ""}
                        description={youtubeContent?.description || ""}
                        thumbnailUrl={youtubeContent?.thumbnailUrl || ""}
                        contentUrl={youtubeContent?.contentUrl || ""}
                        timeAgo={youtubeContent?.timeAgo || ""}
                        isLoading={isLoadingYoutube}
                        profileImage={streamer.profileImage}
                        streamerName={streamer.name}
                        platform="youtube"
                      />

                      <div className="mt-6 text-center">
                        <motion.a 
                          href={`https://www.youtube.com/@${streamer.youtubeChannel}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block px-5 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          whileHover={{ y: -3 }}
                        >
                          Voir toutes les vidéos <span className="ml-2">→</span>
                        </motion.a>
                      </div>
                    </TabsContent>
                  )}


                </Tabs>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">Aucun contenu disponible pour le moment.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}