import Header from "@/components/Header";
import ProductCatalog from "@/components/ProductCatalog";
import MobileBottomBar from "@/components/MobileBottomBar";

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8 mb-20 md:mb-0">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Solar Products & Components
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            High-quality solar components from trusted brands. 
            Build your own system or upgrade your existing setup.
          </p>
        </div>
        <ProductCatalog />
      </main>
      <MobileBottomBar />
    </div>
  );
}