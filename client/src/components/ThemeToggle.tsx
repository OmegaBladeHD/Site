import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [isChanging, setIsChanging] = React.useState(false);

  // Fonction simplifiée pour appliquer le thème avec une animation de balayage haut-bas
  const applyTheme = React.useCallback((newTheme: Theme) => {
    const root = window.document.documentElement;
    
    // Si c'est 'system', détermine le thème en fonction des préférences du système
    let themeToApply = newTheme;
    if (newTheme === "system") {
      themeToApply = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    
    // Détermine la direction de l'animation (vers sombre ou vers clair)
    const toClass = themeToApply === "dark" ? "to-dark" : "to-light";
    
    // Commence par ajouter la classe de transition et la direction
    root.classList.add("theme-transition", toClass);
    
    // Force le navigateur à recalculer les styles pour lancer l'animation
    void root.offsetWidth;
    
    // Enlève les classes de thème existantes et applique le nouveau
    root.classList.remove("light", "dark");
    root.classList.add(themeToApply);
    
    // Enlève les classes de transition après la fin de l'animation (5s)
    const transitionTimeout = setTimeout(() => {
      root.classList.remove("theme-transition", "to-dark", "to-light");
      setIsChanging(false);
    }, 5000);
    
    return () => clearTimeout(transitionTimeout);
  }, []);

  // Effet pour appliquer le thème lors du montage et des changements
  React.useEffect(() => {
    return applyTheme(theme);
  }, [theme, applyTheme]);
  
  // Effet pour mettre à jour le thème si les préférences système changent
  React.useEffect(() => {
    if (theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleChange = () => {
      applyTheme("system");
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, applyTheme]);

  const value = React.useMemo(
    () => ({
      theme,
      setTheme: (theme: Theme) => {
        setIsChanging(true);
        localStorage.setItem(storageKey, theme);
        setTheme(theme);
      },
    }),
    [theme, storageKey]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {isChanging && (
        <div className="fixed inset-0 pointer-events-none z-50 transition-opacity duration-500 bg-black/5 dark:bg-white/5" />
      )}
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isHovered, setIsHovered] = React.useState(false);
  
  const handleToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  // Détermine quel thème est réellement actif
  const isDarkMode = document.documentElement.classList.contains('dark');

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Button
        variant="outline"
        size="icon"
        onClick={handleToggle}
        className="relative overflow-hidden rounded-full w-9 h-9 flex items-center justify-center bg-background hover:bg-primary/10 dark:bg-background/10 dark:hover:bg-primary/20 border-primary/20 dark:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-500"
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
            <Sun 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 ${
                isDarkMode 
                  ? 'text-gray-400 scale-75 opacity-0' 
                  : 'text-amber-500 scale-100 opacity-100'
              } transition-all duration-300 transform ${
                isHovered && !isDarkMode ? 'rotate-45' : 'rotate-0'
              }`} 
            />
            
            <Moon 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 ${
                isDarkMode 
                  ? 'text-primary scale-100 opacity-100' 
                  : 'text-gray-400 scale-75 opacity-0'
              } transition-all duration-300 transform ${
                isHovered && isDarkMode ? 'rotate-12' : 'rotate-0'
              }`} 
            />
          </div>
        <span className="sr-only">Changer de thème</span>
      </Button>
    </motion.div>
  );
}
