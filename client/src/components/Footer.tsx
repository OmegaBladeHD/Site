import { motion } from "framer-motion";
import { FaDiscord, FaTwitch, FaYoutube, FaTiktok } from "react-icons/fa";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-[hsl(265,85%,6%)] border-t border-gray-200 dark:border-border py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start">
          {/* Liens à gauche */}
          <div className="mb-6 md:mb-0 grid grid-cols-2 gap-x-16 gap-y-4">
            {/* Zeyphir */}
            <div>
              <h3 className="font-bold text-lg text-primary mb-3">Zeyphir</h3>
              <div className="flex flex-col space-y-2">
                <motion.a 
                  href="https://www.youtube.com/@Zeyphir_Officiel" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 dark:text-foreground/70 hover:text-[#FF0000] dark:hover:text-[#FF0000] transition-colors flex items-center gap-2"
                  whileHover={{ x: 3 }}
                >
                  <FaYoutube className="text-[#FF0000]" />
                  <span>YouTube</span>
                </motion.a>
                <motion.a 
                  href="https://www.twitch.tv/zayphir_" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 dark:text-foreground/70 hover:text-[#9146FF] dark:hover:text-[#9146FF] transition-colors flex items-center gap-2"
                  whileHover={{ x: 3 }}
                >
                  <FaTwitch className="text-[#9146FF]" />
                  <span>Twitch</span>
                </motion.a>
                <motion.a 
                  href="https://www.tiktok.com/@1Gars.Random" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 dark:text-foreground/70 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                  whileHover={{ x: 3 }}
                >
                  <FaTiktok className="text-black dark:text-white" />
                  <span>TikTok</span>
                </motion.a>
              </div>
            </div>
            
            {/* Tayomi20 */}
            <div>
              <h3 className="font-bold text-lg text-primary mb-3">Tayomi20</h3>
              <div className="flex flex-col space-y-2">
                <motion.a 
                  href="https://www.twitch.tv/tayomi20" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 dark:text-foreground/70 hover:text-[#9146FF] dark:hover:text-[#9146FF] transition-colors flex items-center gap-2"
                  whileHover={{ x: 3 }}
                >
                  <FaTwitch className="text-[#9146FF]" />
                  <span>Twitch</span>
                </motion.a>
                <motion.a 
                  href="https://www.tiktok.com/@tayomi_20" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground/70 dark:text-foreground/70 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                  whileHover={{ x: 3 }}
                >
                  <FaTiktok className="text-black dark:text-white" />
                  <span>TikTok</span>
                </motion.a>
              </div>
            </div>
          </div>
          
          
        </div>
        
        {/* Copyright en bas */}
        <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-800">
          <p className="text-foreground/60 dark:text-foreground/50 text-center">
            &copy; {year} CreatorHub - Streaming Community
          </p>
        </div>
      </div>
    </footer>
  );
}
