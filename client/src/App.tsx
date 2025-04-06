import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/error-404";
import Home from "@/pages/Home";
import StreamerPage from "@/pages/StreamerPage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EasterEgg from "@/components/EasterEgg";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

function Router() {
  const [location] = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Switch key={location}>
        <Route path="/" component={Home} />
        <Route path="/streamers/:slug" component={StreamerPage} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  const [easterEggVisible, setEasterEggVisible] = useState(false);
  const [konamiIndex, setKonamiIndex] = useState(0);

  // Konami code sequence
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

  // Easter egg handler using Konami code
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === konamiCode[konamiIndex]) {
        const nextIndex = konamiIndex + 1;
        setKonamiIndex(nextIndex);
        
        if (nextIndex === konamiCode.length) {
          setEasterEggVisible(true);
          setKonamiIndex(0);
        }
      } else {
        setKonamiIndex(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [konamiIndex]);
  
  // Effet de brillance suivant le curseur sur les cards en mode sombre
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll<HTMLElement>('.card, .content-card');
      
      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        if (
          x >= 0 && 
          x <= rect.width && 
          y >= 0 && 
          y <= rect.height
        ) {
          card.style.setProperty('--xPos', `${x}px`);
          card.style.setProperty('--yPos', `${y}px`);
        }
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col relative bg-background dark:bg-[hsl(265,85%,5%)] text-foreground dark:text-[hsl(210,100%,95%)]">
        {/* Fond décoratif pour le mode sombre uniquement */}
        <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-700">
          <div className="hidden dark:block">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_rgba(170,80,255,0.3),_transparent_70%)]"></div>
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_center,_rgba(170,80,255,0.3),_transparent_50%)]"></div>
            <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[radial-gradient(circle_at_bottom_left,_rgba(170,80,255,0.25),_transparent_60%)]"></div>
            <div className="absolute top-1/4 left-1/3 w-2/3 h-2/3 bg-[radial-gradient(circle_at_center,_rgba(170,80,255,0.2),_transparent_40%)]"></div>
          </div>
        </div>
        
        <Header />
        <main className="flex-1 relative z-10 bg-background dark:bg-transparent text-foreground dark:text-[hsl(210,100%,95%)] px-4 py-2">
          <Router />
        </main>
        <Footer />
        <EasterEgg isVisible={easterEggVisible} onClose={() => setEasterEggVisible(false)} />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
