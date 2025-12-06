import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import HorizontalProjects from "@/components/home/HorizontalProjects";
import Services from "@/components/home/Services";
import GameSection from "@/components/home/GameSection";
import VideoGallery from "@/components/home/VideoGallery";
import YouTubeStatsSection from "@/components/home/YouTubeStatsSection";
import DiscordActivity from "@/components/home/DiscordActivity";
import Skills from "@/components/home/Skills";
import Footer from "@/components/home/Footer";
import DiscordStatus from "@/components/ui/DiscordStatus";

export default function Home() {
  return (
    <main className="relative w-full flex flex-col bg-background">
      <DiscordStatus />
      <Hero />
      <About />
      <Services />
      <GameSection />
      <VideoGallery />
      <YouTubeStatsSection />
      <DiscordActivity />
      <HorizontalProjects />
      <Skills />
      <Footer />
    </main>
  );
}
