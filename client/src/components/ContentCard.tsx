import { motion } from "framer-motion";
import { FaTwitch, FaYoutube, FaTiktok } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Eye as EyeIcon, Heart as HeartIcon } from "lucide-react";

export interface ContentCardProps {
  type: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  timeAgo: string;
  isLoading?: boolean;
  isLive?: boolean;
  profileImage: string;
  streamerName: string;
  platform: "twitch" | "youtube" | "tiktok";
  duration?: string;
  views?: string;
  likes?: string;
}

import { useInView } from "framer-motion";
import { useRef } from "react";

export default function ContentCard({
  type,
  title,
  description,
  thumbnailUrl,
  contentUrl,
  timeAgo,
  isLoading = false,
  isLive = false,
  profileImage,
  streamerName,
  platform,
  duration,
  views,
  likes
}: ContentCardProps) {

  // Platform specific button styling and icon
  const platformConfig = {
    twitch: {
      icon: <FaTwitch className="mr-2" />,
      color: "bg-[#9146FF] hover:bg-[#7a37e6]",
      text: isLive ? "Regarder en direct" : "Regarder sur Twitch"
    },
    youtube: {
      icon: <FaYoutube className="mr-2" />,
      color: "bg-[#FF0000] hover:bg-[#d90000]",
      text: "Regarder sur YouTube"
    },
    tiktok: {
      icon: <FaTiktok className="mr-2" />,
      color: "bg-black hover:bg-gray-900",
      text: "Voir sur TikTok"
    }
  };

  if (isLoading) {
    return (
      <div className="bg-card dark:bg-[#2d0068] rounded-lg overflow-hidden shadow-md dark:shadow-[#6200ff]/15 border border-border dark:border-[#500099]/50">
        <div className="aspect-video relative">
          <Skeleton className="h-full w-full dark:bg-[#36007c]/50" />
        </div>
        <div className="p-4">
          <div className="flex items-start gap-3">
            <Skeleton className="h-10 w-10 rounded-full dark:bg-[#36007c]/50" />
            <div className="flex-1">
              <Skeleton className="h-5 w-3/4 mb-2 dark:bg-[#36007c]/50" />
              <Skeleton className="h-4 w-1/4 dark:bg-[#36007c]/50" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mt-3 mb-2 dark:bg-[#36007c]/50" />
          <Skeleton className="h-4 w-2/3 dark:bg-[#36007c]/50" />
          <Skeleton className="h-10 w-32 mt-4 rounded-lg dark:bg-[#36007c]/50" />
        </div>
      </div>
    );
  }

  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div 
      ref={ref}
      className="content-card bg-card dark:bg-[#2d0068] rounded-lg overflow-hidden shadow-md hover:shadow-lg dark:shadow-[#6200ff]/15 dark:hover:shadow-[#6200ff]/30 border border-border dark:border-[#500099]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ 
        opacity: isInView ? 1 : 0,
        y: isInView ? 0 : 50,
        scale: isInView ? 1 : 0.9
      }}
      transition={{ duration: 0.5 }}
      whileHover={{ 
        scale: 1.02,
        y: -8,
        transition: { type: "spring", stiffness: 400, damping: 10 }
      }}
    >
      <div className="aspect-video relative">
        <img 
          src={thumbnailUrl} 
          alt={title} 
          className="w-full h-full object-cover"
        />
        {isLive && (
          <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center">
            <span className="animate-pulse h-2 w-2 bg-white rounded-full mr-1"></span>
            LIVE
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="min-w-[40px]">
            <img 
              src={profileImage} 
              alt={streamerName} 
              className="w-10 h-10 rounded-full"
            />
          </div>
          <div>
            <h3 className="font-medium mb-1 text-foreground/90 dark:text-foreground line-clamp-2">
              {title}
            </h3>
            <p className="text-sm text-foreground/60 dark:text-foreground/70">
              {timeAgo}
            </p>
          </div>
        </div>
        <p className="mt-3 text-foreground/80 dark:text-foreground/90 line-clamp-2">
          {description}
        </p>
        {platform === "youtube" && (
          <div className="flex items-center gap-4 mt-2 text-sm text-foreground/60">
            {views && (
              <div className="flex items-center">
                <EyeIcon className="w-4 h-4 mr-1" /> 
                {new Intl.NumberFormat('fr-FR').format(parseInt(views))}
              </div>
            )}
            {likes && (
              <div className="flex items-center">
                <HeartIcon className="w-4 h-4 mr-1"/>
                {new Intl.NumberFormat('fr-FR').format(parseInt(likes))}
              </div>
            )}
            {duration && (
              <div className="flex items-center">
                <span className="mr-1">⏱️</span>
                {duration}
              </div>
            )}
          </div>
        )}
        <motion.a 
          href={contentUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className={`mt-4 inline-flex items-center px-4 py-2 ${platformConfig[platform].color} text-white rounded-lg transition-colors`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {platformConfig[platform].icon}
          {platformConfig[platform].text}
        </motion.a>
      </div>
    </motion.div>
  );
}