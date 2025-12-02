
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
    if (latest > 100 && latest > scrollY.getPrevious()) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

    const scrollToSection = (id: string) => {
        const element = document.querySelector(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };
  
    const items: DockItemData[] = navLinks.map(link => ({
        icon: iconMap[link.label] || <Briefcase />,
        label: link.label,
        onClick: () => scrollToSection(link.href),
    }));

  const baseItemSize = isMobile ? 24 : 32;
  const magnification = isMobile ? 32 : 40;


  return (
    <motion.header
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: '-150%', opacity: 0 },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-4 w-full px-4 z-50 flex justify-center"
    >
      <Dock items={items} baseItemSize={baseItemSize} magnification={magnification} />
    </motion.header>
  );
}
