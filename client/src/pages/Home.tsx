import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import StreamerCard from "@/components/StreamerCard";
import { FaDiscord, FaTwitch, FaYoutube, FaTiktok } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { getStreamers } from "@/lib/api";
import { useEffect, useState } from "react";
import { setupCornerClickEasterEgg } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Home() {
  const { data: streamers, isLoading } = useQuery({
    queryKey: ['/api/streamers'],
    queryFn: getStreamers
  });

  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    const cleanupFn = setupCornerClickEasterEgg(() => {
      setShowEasterEgg(true);
      setTimeout(() => setShowEasterEgg(false), 8000);
    });

    return cleanupFn;
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        key="home-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="pb-16 pt-8 md:pt-12"
      >
        <motion.div
          className="bg-gradient-to-b from-primary/10 via-background to-background dark:from-primary/5 dark:via-background dark:to-background py-12 md:py-24 transition-all duration-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="container mx-auto px-4">
            <motion.div 
              className="max-w-4xl mx-auto text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            >
              <motion.h1 
                className="font-inter text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-primary dark:text-primary/90 leading-tight"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Bienvenue sur le site de<br/>Zeyphir et Tayomi20
              </motion.h1>

              <motion.p 
                className="text-lg md:text-xl text-foreground dark:text-foreground/90 mb-8 max-w-2xl mx-auto"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                Découvrez vos streamers préférés et rejoignez une communauté dynamique de gamers et créateurs de contenu.
              </motion.p>

              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 3 }}
              >
                <img 
                  src="https://creatorhubtz.s-ul.eu/roKaIFx3"
                  alt="CreatorHub Banner"
                  className="max-w-full h-auto mx-auto"
                  style={{ borderRadius: '12px' }}
                />
              </motion.div>

              <motion.div 
                className="hidden md:block absolute left-1/2 bottom-8 transform -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 10, 0] }}
                transition={{ delay: 1, duration: 1.5, repeat: Infinity, repeatType: "loop" }}
              >
                <svg width="24" height="36" viewBox="0 0 24 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="22" height="34" rx="11" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="12" r="4" fill="currentColor" className="animate-pulse">
                    <animate attributeName="cy" values="12;24;12" dur="2s" repeatCount="indefinite" />
                  </circle>
                </svg>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
        <div className="container mx-auto px-4 -mt-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="font-inter text-3xl md:text-4xl font-bold text-center mb-4 text-primary dark:text-primary/90">
              Nos Streamers
            </h2>
            <p className="text-center mb-12 text-foreground/80 dark:text-foreground/80 max-w-3xl mx-auto text-lg">
              Découvrez le contenu exclusif de nos streamers et suivez leurs aventures sur différentes plateformes.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-24"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {isLoading ? (
              <>
                <StreamerSkeleton />
                <StreamerSkeleton />
              </>
            ) : (
              streamers?.map(streamer => (
                <motion.div key={streamer.id} variants={item}>
                  <StreamerCard {...streamer} />
                </motion.div>
              ))
            )}
          </motion.div>

          <motion.div 
            className="relative bg-card dark:bg-card rounded-xl p-8 md:p-12 shadow-xl dark:shadow-primary/5 overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
              <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary/30 dark:bg-primary/20 blur-3xl"></div>
              <div className="absolute -left-24 -bottom-24 w-96 h-96 rounded-full bg-primary/20 dark:bg-primary/10 blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <motion.h2 
                className="font-inter text-3xl md:text-4xl font-bold text-center mb-6 text-primary dark:text-primary/90"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                Rejoignez notre communauté
              </motion.h2>

              <motion.p 
                className="text-center mb-10 max-w-3xl mx-auto text-lg text-foreground dark:text-foreground/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                Rejoignez-nous pour des streams gaming déjantés avec un humour décalé qui ne se prend pas au sérieux. Entre rage-quits et moments épiques, on garde le sourire ! 
              </motion.p>

              <motion.div 
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.4 }}
              >
                <motion.a 
                  href="https://discord.gg/eNeJt2vDHK" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#5865F2] text-white rounded-lg shadow-lg hover:shadow-[#5865F2]/30 transition-all duration-300"
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 8px 20px -5px rgba(88, 101, 242, 0.5)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaDiscord className="text-2xl" />
                  <span className="font-medium text-lg">Rejoindre le Discord</span>
                </motion.a>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function StreamerSkeleton() {
  return (
    <div className="bg-card dark:bg-card rounded-xl shadow-lg overflow-hidden">
      <div className="h-48 md:h-72">
        <Skeleton className="h-full w-full" />
      </div>
      <div className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-3/4 mb-6" />

        <div className="flex gap-3 mb-6">
          <Skeleton className="h-10 w-24 rounded-lg" />
          <Skeleton className="h-10 w-24 rounded-lg" />
        </div>

        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    </div>
  );
}