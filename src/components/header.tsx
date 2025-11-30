
'use client';

import React, { useState, useEffect } from 'react';
import Dock from './dock';
import { navLinks } from '@/lib/data';
import { Home, User, Briefcase, Star, MessageSquare, UserCog, Users, Heart, Award, FileText } from 'lucide-react';
import type { DockItemData } from './dock';
import { cn } from '@/lib/utils';

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
    const [hidden, setHidden] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            const isScrolled = window.scrollY > 100;
            if (isScrolled !== hidden) {
                setHidden(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [hidden]);

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

  if (!mounted) {
    return null;
  }

  return (
        <header
          className={cn(
            "fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-opacity duration-300 ease-in-out",
            { "opacity-0 pointer-events-none": hidden, "opacity-100": !hidden }
          )}
        >
          <Dock items={items} />
        </header>
  );
}

