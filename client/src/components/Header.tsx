import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();
  
  // Gérer le défilement pour détecter quand l'utilisateur a scrollé
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { href: "/", label: "Accueil" },
    { href: "/streamers/tayomi20", label: "Tayomi20" },
    { href: "/streamers/zeyphir", label: "Zeyphir" },
  ];

  return (
    <motion.header 
      className={`sticky top-0 z-40 bg-background dark:bg-black/60 dark:backdrop-blur-md border-b border-border transition-all duration-500 ${
        isScrolled ? 'shadow-lg dark:shadow-primary/20' : 'shadow-none'
      }`}
    >
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/">
            <span className="font-inter text-xl font-bold text-primary dark:text-primary/90 hover:text-primary/80 dark:hover:text-primary transition-colors duration-300 cursor-pointer">
              CreatorHub
            </span>
          </Link>
        </motion.div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map(({ href, label }) => (
            <motion.div
              key={href}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link href={href}>
                <span className={`font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary hover:after:w-full after:transition-all after:duration-300 cursor-pointer
                  ${location === href 
                    ? 'text-primary dark:text-primary after:w-full'
                    : 'text-foreground dark:text-foreground hover:text-primary dark:hover:text-primary'
                  } transition-colors duration-300`}
                >
                  {label}
                </span>
              </Link>
            </motion.div>
          ))}
          
          <ThemeToggle />
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          
          <motion.div
            whileTap={{ scale: 0.9 }}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
              className="hover:bg-primary/10 transition-colors duration-300"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 90 }}
                    exit={{ rotate: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6 text-foreground dark:text-foreground" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: -90 }}
                    animate={{ rotate: 0 }}
                    exit={{ rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6 text-foreground dark:text-foreground" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>
        </div>
      </nav>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-background dark:bg-background shadow-inner border-t border-border overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2">
              {navLinks.map(({ href, label }) => (
                <motion.div
                  key={href}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Link href={href}>
                    <span 
                      className={`block py-3 px-3 rounded-md font-medium hover:bg-primary/10 dark:hover:bg-primary/20 transition-all duration-300 cursor-pointer
                        ${location === href 
                          ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary' 
                          : 'text-foreground dark:text-foreground'}`
                        }
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {label}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
