import { motion, AnimatePresence } from "framer-motion";
import { FaEgg, FaTwitch, FaDiscord } from "react-icons/fa";
import { X } from "lucide-react";

interface EasterEggProps {
  isVisible: boolean;
  onClose: () => void;
}

export default function EasterEgg({ isVisible, onClose }: EasterEggProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white dark:bg-gray-800 p-6 rounded-xl max-w-md text-center relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={20} />
            </button>
            
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="my-4"
            >
              <FaEgg className="text-primary text-4xl mx-auto" />
            </motion.div>
            
            <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Easter Egg trouvé !</h3>
            <p className="mb-4 text-gray-700 dark:text-gray-300">Félicitations ! Vous avez découvert l'easter egg secret.</p>
            
            <div className="grid grid-cols-2 gap-3">
              <a 
                href="https://www.twitch.tv/tayomi20" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon px-4 py-2 bg-[#9146FF] text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center"
              >
                <FaTwitch className="mr-2" /> Tayomi20
              </a>
              <a 
                href="https://www.twitch.tv/zayphir_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-icon px-4 py-2 bg-[#9146FF] text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center"
              >
                <FaTwitch className="mr-2" /> Zeyphir
              </a>
            </div>
            
            <div className="mt-4">
              <a 
                href="https://discord.gg/eNeJt2vDHK" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full social-icon px-4 py-2 bg-[#5865F2] text-white rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center"
              >
                <FaDiscord className="mr-2" /> Rejoindre le Discord
              </a>
            </div>
            
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Indice : vous pouvez aussi trouver l'easter egg en cliquant sur les coins de l'écran dans l'ordre...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
