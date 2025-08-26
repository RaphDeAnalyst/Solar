import Header from "@/components/Header";
import BundlesGrid from "@/components/BundlesGrid";
import MobileBottomBar from "@/components/MobileBottomBar";

export default function BundlesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 mb-20 md:mb-0">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Solar System Bundles
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pre-configured solar systems designed specifically for Nigerian homes and businesses. 
            Each bundle includes everything you need for reliable solar power.
          </p>
        </div>
        <BundlesGrid />
      </main>
      <MobileBottomBar />
    </div>
  );
}