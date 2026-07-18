import AISpotlight from "@/components/landing/AISpotlight";
import Features from "@/components/landing/Features";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import NavBar from "@/components/landing/NavBar";

export default function Home() {
  return (
    <div className="min-h-screen hoverflow-x-clip bg-white">
      <NavBar />
      <Hero />
      <Features />
      <HowItWorks />
      <AISpotlight />
      <FinalCTA />
      <Footer />
    </div>
  );
}
