import Header from "@/components/header";
import HeroSection from "@/components/sections/hero";

export default function Home() {
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      <Header />
      <main className="flex-1">
        <HeroSection />
      </main>
    </div>
  );
}
