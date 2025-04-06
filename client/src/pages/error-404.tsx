import { motion } from "framer-motion";
import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <motion.div 
      className="min-h-[70vh] flex items-center justify-center py-8 md:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h1 
          className="font-inter text-8xl font-bold text-primary dark:text-primary-light mb-6"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          404
        </motion.h1>
        
        <motion.h2 
          className="font-inter text-3xl font-bold mb-6"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Page introuvable
        </motion.h2>
        
        <motion.p 
          className="max-w-lg mx-auto mb-8 text-gray-600 dark:text-gray-400"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          La page que vous recherchez semble avoir disparu dans le stream...
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Link href="/">
            <a className="inline-block px-6 py-3 bg-primary hover:bg-primary-light text-white rounded-lg transition-colors">
              Retour à l'accueil
            </a>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
