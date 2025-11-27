
'use client';

import React, { useState, useEffect } from 'react';
import Dock from './dock';
import { navLinks } from '@/lib/data';
import { Home, User, Briefcase, Star, MessageSquare, UserCog, Users } from 'lucide-react';
import type { DockItemData } from './dock';
import { ThemeToggle } from './theme-toggle';

const iconMap: { [key: string]: React.ReactNode } = {
  About: <User />,
  Skills: <Star />,
  Services: <Briefcase />,
  Portfolio: <Briefcase />,
  Clients: <Users />,
  Contact: <MessageSquare />,
  Admin: <UserCog />,
  Home: <Home />,
};


export default function Header() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

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
    <header className="fixed top-4 left-0 right-0 z-50 px-4">
      <div className="relative w-full max-w-7xl mx-auto flex justify-center">
        <Dock items={items} />
        <div className="absolute top-0 right-0">
          {mounted && <ThemeToggle />}
        </div>
      </div>
    </header>
  );
}
