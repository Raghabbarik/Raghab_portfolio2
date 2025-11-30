
'use client';

import React from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Dock from './dock';
import { navLinks } from '@/lib/data';
import { Home, User, Briefcase, Star, MessageSquare, UserCog, Users, Heart, Award, FileText } from 'lucide-react';
import type { DockItemData } from './dock';
import { useMediaQuery } from '@/hooks/use-media-query';

const iconMap: { [key: string]: React.ReactNode } = {
  About: <User />,
  Skills: <Star />,
  Services: <Briefcase />,
  Companions: <Heart />,
  Portfolio: <Briefcase />,
  Clients: <Users />,
  Contact: <MessageSquare />,
  Admin: <UserCog />,
  Home: <Home />,
  Certificates: <Award />,
  Thoughts: <FileText />,
};


export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = React.useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useMotionValueEvent(scrollY, 'change', latest => {
    if (latest < 100) {
      setHidden(false);
    } else {
      const isScrollingUp = scrollY.getPrevious() > latest;
      if (!isScrollingUp) {
        setHidden(true);
      }
    }
  });

    const scrollToSection = (id: string) => {
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
  
    const items: DockItemData[] = [
        {
          icon: <Home />,
          label: 'Home',
          onClick: () => scrollToSection('#hero'),
        },
        ...navLinks.map(link => ({
            icon: iconMap[link.label] || <Briefcase />,
            label: link.label,
            onClick: () => scrollToSection(link.href),
        })),
    ];

  const baseItemSize = isMobile ? 25 : 20;
  const magnification = isMobile ? 35 : 30;


  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: '-150%', opacity: 0 },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex justify-center px-4"
    >
      <Dock items={items} baseItemSize={baseItemSize} magnification={magnification} />
    </motion.header>
  );
}
