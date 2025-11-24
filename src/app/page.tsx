
"use client";

import Footer from "@/components/footer";
import Header from "@/components/header";
import { useData } from "@/lib/data-context";
import { Skeleton } from "@/components/ui/skeleton";
import HeroSection from "@/components/sections/hero";
import AboutSection from "@/components/sections/about";
import SkillsSection from "@/components/sections/skills";
import ServicesSection from "@/components/sections/services";
import PortfolioSection from "@/components/sections/portfolio";
import ClientsSection from "@/components/sections/clients";
import ContactSection from "@/components/sections/contact";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const Threads = dynamic(() => import('@/components/threads-background'), {
  ssr: false,
});


const SectionSkeleton = () => (
  <section className="w-full py-16 md:py-24 lg:py-32">
    <div className="container px-4 md:px-6">
      <Skeleton className="h-[400px] w-full" />
    </div>
  </section>
);

export default function Home() {
    const { isDataLoaded } = useData();

    return (
        <div className="flex min-h-[100dvh] flex-col bg-background relative">
          <div className="fixed top-0 left-0 w-full h-full z-0">
             <Suspense fallback={<div className="w-full h-full bg-background" />}>
                <Threads 
                  color={[0.4, 0.2, 0.8]} 
                  amplitude={0.5}
                  distance={0.1}
                  enableMouseInteraction={true} 
                />
              </Suspense>
          </div>
          <div className="relative z-10 flex flex-col flex-1">
            <main className="flex-1">
                <Header />
                {isDataLoaded ? (
                    <>
                        <HeroSection />
                        <AboutSection />
                        <SkillsSection />
                        <ServicesSection />
                        <ClientsSection />
                        <PortfolioSection />
                        <ContactSection />
                    </>
                ) : (
                    <>
                        <section id="hero" className="relative w-full h-screen min-h-[700px] flex items-center justify-center overflow-hidden"><Skeleton className="h-full w-full" /></section>
                        <SectionSkeleton />
                        <SectionSkeleton />
                        <SectionSkeleton />
                        <SectionSkeleton />
                        <SectionSkeleton />
                        <SectionSkeleton />
                    </>
                )}
            </main>
            <Footer />
          </div>
        </div>
    );
}
