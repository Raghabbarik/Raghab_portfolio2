
"use client";

import Image from "next/image";
import Link from "next/link";
import { Hand } from "lucide-react";
import { useData } from "@/lib/data-context";
import { Skeleton } from "../ui/skeleton";
import React, { useEffect, useState } from "react";
import { Button } from '../ui/button';
import { getIcon } from "@/lib/get-icon";
import FloatingLines from '../floating-lines-background';
import { hslStringToHex } from "@/lib/colors";
import { useTheme } from "next-themes";
import TextType from '../ui/text-type';


function isValidHttpUrl(string: string | undefined) {
    if (!string || string.length === 0) return false;
    // Check for data URIs or valid http/https urls
    if (string.startsWith('data:image/') || string.startsWith('http')) {
        return true;
    }
    return false;
}


export default function HeroSection() {
  const { about, contactDetails, isDataLoaded, theme: appTheme } = useData();
  const { resolvedTheme } = useTheme();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const [gradientColors, setGradientColors] = useState<[string, string]>(['#8A2BE2', '#4169E1']);

  useEffect(() => {
    if (isDataLoaded && resolvedTheme) {
      const themeMode = resolvedTheme as 'light' | 'dark';
      const primaryHsl = appTheme[themeMode].primary;
      
      const accentHsl = appTheme[themeMode].accent;
      
      const primaryHex = hslStringToHex(primaryHsl);
      
      const accentHslParts = accentHsl.split(' ');
      const accentL = parseFloat(accentHslParts[2]);
      const adjustedAccentHsl = `${accentHslParts[0]} ${accentHslParts[1]} ${Math.min(accentL + 15, 100)}%`;
      const accentHex = hslStringToHex(adjustedAccentHsl);

      setGradientColors([primaryHex, accentHex]);
    }
  }, [isDataLoaded, resolvedTheme, appTheme]);

  if (!isClient || !isDataLoaded) {
    return (
      <section id="hero" className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <Skeleton className="h-full w-full" />
      </section>
    );
  }

  const firstName = "Raghab";
  const hasValidImage = isValidHttpUrl(about.profileImageUrl);
  
  const socialLinks = contactDetails.filter(detail => 
    ["Github", "Instagram", "Linkedin"].includes(detail.iconName)
  );
  
  const titles = ["Web Developer", "UI/UX Designer", "Full-Stack Engineer"];

  return (
    <section id="hero" className="relative w-full h-screen min-h-[700px] overflow-hidden">
       <div className="absolute inset-0 z-0">
        <FloatingLines
          linesGradient={gradientColors}
          mixBlendMode="plus-lighter"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>
      <div className="container relative z-20 px-4 md:px-6 h-full flex items-center">
         <div className="w-full h-full flex items-center">
            <div className="grid lg:grid-cols-2 gap-12 items-center w-full max-w-6xl mx-auto">
            <div className="relative flex flex-col items-center lg:items-start text-center lg:text-left gap-6 lg:ml-8">
                <div className="flex items-center gap-2 bg-accent/50 border border-border rounded-full px-4 py-1.5 text-sm">
                    <Hand className="h-5 w-5 text-primary animate-bounce"/>
                    <span>Hey, I'm {firstName}</span>
                </div>
                <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter h-[10.5rem] md:h-[13.5rem]">
                    <TextType as="span" text={titles} loop={false} className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600" />
                </h1>
                <p className="max-w-xl text-muted-foreground md:text-lg">
                    Crafting modern digital experiences with clean design and powerful functionality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button asChild className="bg-secondary-gradient border-none" size="lg">
                    <Link href="#contact">Get In Touch</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                    <Link href="#portfolio">Browse Projects</Link>
                </Button>
                </div>

                <div className="flex items-center gap-4 pt-4">
                    <p className="text-sm font-medium">Follow me:</p>
                    <div className="flex items-center gap-3">
                    {socialLinks.map(detail => {
                        const Icon = getIcon(detail.iconName);
                        return (
                        <Link
                            key={detail.id}
                            href={detail.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground transition-colors hover:text-primary"
                        >
                            <Icon className="h-5 w-5" />
                            <span className="sr-only">{detail.iconName}</span>
                        </Link>
                        )
                    })}
                    </div>
                </div>
            </div>
            <div className="relative flex items-center justify-center">
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 group">
                <div className="absolute inset-0 rounded-full bg-primary/30 blur-3xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="absolute inset-8 rounded-full bg-secondary/30 blur-3xl [animation-delay:1s] group-hover:blur-2xl transition-all duration-500"></div>
                {hasValidImage ? (
                    <Image
                    src={about.profileImageUrl}
                    alt="Raghab Barik"
                    data-ai-hint={about.profileImageHint}
                    width={400}
                    height={400}
                    className="relative z-10 rounded-full w-full h-full object-cover shadow-2xl"
                    priority
                    />
                ) : (
                    <Skeleton className="relative z-10 rounded-full w-full h-full" />
                )}
                </div>
            </div>
            </div>
         </div>
      </div>
    </section>
  );
}
