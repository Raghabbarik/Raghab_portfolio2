
'use client';

import React, { useState, useEffect } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import Dock from './dock';
import { navLinks } from '@/lib/data';
import { Home, User, Briefcase, Star, MessageSquare, UserCog, Users, Heart, Award, FileText } from 'lucide-react';
import type { DockItemData } from './dock';

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
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, 'change', latest => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 150) {
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

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: '-150%' },
      }}
      animate={hidden ? 'hidden' : 'visible'}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50"
    >
      <Dock items={items} />
    </motion.header>
  );
}

