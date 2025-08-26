import Header from "@/components/Header";
import SolarCalculator from "@/components/SolarCalculator";
import MobileBottomBar from "@/components/MobileBottomBar";

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 mb-20 md:mb-0">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Solar System Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Calculate exactly what solar system you need for your Nigerian home. 
            Get personalized recommendations based on your appliances and usage.
          </p>
        </div>
        <SolarCalculator />
      </main>
      <MobileBottomBar />
    </div>
  );
}