import Link from "next/link";
import { Calculator, MessageCircle, Phone } from "lucide-react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import FeaturedProducts from "@/components/FeaturedProducts";
import MobileBottomBar from "@/components/MobileBottomBar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <HeroSection />
        <FeaturedProducts />
      </main>
      <MobileBottomBar />
    </div>
  );
}
