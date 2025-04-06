import { motion } from "framer-motion";
import { Link } from "wouter";
import { FaTwitch, FaYoutube, FaTiktok } from "react-icons/fa";
import { useState } from "react";

interface SocialLink {
  icon: React.ReactNode;
  label: string;
  url: string;
  color: string;
  hoverColor: string;
}

export interface StreamerCardProps {
  id: number;
  name: string;
  slug: string;
  description: string;
  profileImage: string;
  bannerImage: string;
  twitchUsername?: string | null;
  youtubeChannel?: string | null;
  tiktokUsername?: string | null;
}

export default function StreamerCard({ 
  name,
  slug,
  description,
  profileImage,
  bannerImage,
  twitchUsername,
  youtubeChannel,
  tiktokUsername
}: StreamerCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Prepare social links
  const socialLinks: SocialLink[] = [];
  
  if (twitchUsername) {
    socialLinks.push({
      icon: <FaTwitch className="text-lg" />,
      label: "Twitch",
      url: `https://www.twitch.tv/${twitchUsername}`,
      color: "bg-[#9146FF]",
      hoverColor: "hover:bg-[#7a3dde]"
    });
  }
  
  if (youtubeChannel) {
    socialLinks.push({
      icon: <FaYoutube className="text-lg" />,
      label: "YouTube",
      url: `https://www.youtube.com/@${youtubeChannel}`,
      color: "bg-[#FF0000]",
      hoverColor: "hover:bg-[#cc0000]"
    });
  }
  
  if (tiktokUsername) {
    socialLinks.push({
      icon: <FaTiktok className="text-lg" />,
      label: "TikTok",
      url: `https://www.tiktok.com/@${tiktokUsername}`,
      color: "bg-black",
      hoverColor: "hover:bg-gray-800"
    });
  }

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      y: -10,
      boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      transition: {
        y: { type: "spring", stiffness: 300, damping: 15 },
        boxShadow: { duration: 0.2 }
      }
    }
  };

  const imageVariants = {
    hover: { 
      scale: 1.05,
      transition: { duration: 0.4 }
    }
  };

  const profileImageVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { delay: 0.2, type: "spring", stiffness: 200 }
    },
    hover: { 
      scale: 1.1,
      boxShadow: "0 0 0 4px rgba(138, 75, 175, 0.8)",
      transition: { duration: 0.2 }
    }
  };

  const textVariants = {
    hover: {
      y: -5,
      transition: { duration: 0.2, ease: "easeOut" }
    }
  };

  const socialVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (i: number) => ({ 
      opacity: 1, 
      x: 0,
      transition: { 
        delay: 0.2 + (i * 0.1),
        duration: 0.2
      }
    }),
    hover: {
      y: -3,
      scale: 1.05,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  const buttonVariants = {
    hover: { 
      scale: 1.02,
      backgroundColor: "#9d5bd2", // Slightly lighter primary
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.98
    }
  };

  return (
    <motion.div 
      className="bg-card dark:bg-[#250052] text-card-foreground dark:text-card-foreground rounded-xl overflow-hidden transition-all duration-500 shadow-lg hover:shadow-xl dark:shadow-[#6200ff]/10 dark:hover:shadow-[#6200ff]/30"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <div className="relative h-48 md:h-72 overflow-hidden">
        <motion.img 
          src={bannerImage} 
          alt={`${name} Banner`} 
          className="w-full h-full object-cover" 
          variants={imageVariants}
          transition={{ duration: 0.4 }}
        />
        <motion.img 
          src={profileImage} 
          alt={`${name} Profile`} 
          className="absolute bottom-6 left-6 w-20 h-20 rounded-full border-4 border-white dark:border-primary shadow-lg"
          variants={profileImageVariants}
        />
      </div>
      
      <div className="p-6">
        <motion.p 
          className="text-foreground dark:text-foreground mb-6 text-base md:text-lg leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>
        
        {/* Social Media Buttons for larger screens */}
        <div className="hidden md:flex flex-wrap gap-3 mb-6">
          {socialLinks.map((social, index) => (
            <motion.a 
              key={index}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 ${social.color} ${social.hoverColor} text-white rounded-lg shadow-md transition-all`}
              variants={socialVariants}
              custom={index}
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
            >
              {social.icon}
              <span className="font-medium">{social.label}</span>
            </motion.a>
          ))}
        </div>
        
        <Link href={`/streamers/${slug}`}>
          <motion.span 
            className="block w-full text-center py-3 px-4 bg-primary text-white rounded-lg shadow-lg cursor-pointer font-medium"
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
          >
            Voir le profil
          </motion.span>
        </Link>
      </div>
    </motion.div>
  );
}
