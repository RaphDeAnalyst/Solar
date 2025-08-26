"use client";

import Link from "next/link";
import { Battery, Zap, Sun, Home, Building, Factory, Check, ArrowRight } from "lucide-react";

const solarBundles = [
  {
    id: "starter",
    name: "Starter Kit",
    price: "₦250,000 - ₦350,000",
    description: "Perfect for small apartments and basic lighting",
    bestFor: "1-bedroom apartments, shops",
    icon: <Sun className="w-8 h-8" />,
    category: "residential",
    specs: {
      inverter: "1kVA Pure Sine Wave",
      battery: "100Ah Deep Cycle",
      panels: "2 x 200W Mono",
      controller: "30A PWM",
      installation: "Basic DIY Kit"
    },
    appliances: [
      "4-6 LED lights",
      "2 ceiling fans", 
      "Phone charging",
      "Small radio/speaker",
      "DC lighting system"
    ],
    features: [
      "6-8 hours backup",
      "Easy installation",
      "1-year warranty",
      "Basic monitoring"
    ],
    dailyLoad: "800-1200 Wh",
    popular: false
  },
  {
    id: "basic",
    name: "Basic Home Kit", 
    price: "₦350,000 - ₦500,000",
    description: "Essential power for typical Nigerian homes",
    bestFor: "2-3 bedroom homes, small offices",
    icon: <Home className="w-8 h-8" />,
    category: "residential",
    specs: {
      inverter: "1.5kVA Pure Sine Wave",
      battery: "150Ah Lithium",
      panels: "2 x 300W Mono",
      controller: "40A MPPT",
      installation: "Professional installation"
    },
    appliances: [
      "8-10 LED lights",
      "3-4 ceiling fans",
      "32\" LED TV",
      "Laptop charging",
      "Small fridge (part time)",
      "Phone/tablet charging"
    ],
    features: [
      "8-12 hours backup",
      "MPPT technology",
      "2-year warranty",
      "Remote monitoring",
      "Expandable system"
    ],
    dailyLoad: "1200-1800 Wh",
    popular: false
  },
  {
    id: "comfort",
    name: "Comfort Home Kit",
    price: "₦650,000 - ₦900,000", 
    description: "Complete comfort with TV, fridge, and all essentials",
    bestFor: "3-4 bedroom homes, medium offices",
    icon: <Zap className="w-8 h-8" />,
    category: "residential",
    specs: {
      inverter: "3kVA Pure Sine Wave",
      battery: "200Ah Lithium",
      panels: "4 x 400W Mono",
      controller: "60A MPPT",
      installation: "Professional installation + training"
    },
    appliances: [
      "12-15 LED lights",
      "4-5 ceiling fans", 
      "43\" LED TV",
      "Medium fridge (full time)",
      "Laptop + desktop",
      "Washing machine (limited)",
      "Water pump (limited)",
      "Phone/device charging"
    ],
    features: [
      "12-24 hours backup",
      "Smart MPPT controller",
      "3-year warranty",
      "App monitoring",
      "Load prioritization",
      "Expandable to 10kW"
    ],
    dailyLoad: "2000-3500 Wh",
    popular: true
  },
  {
    id: "premium", 
    name: "Premium Home Kit",
    price: "₦1,200,000 - ₦2,000,000",
    description: "Complete home power including AC and high-power appliances",
    bestFor: "Large homes, duplex, small businesses",
    icon: <Battery className="w-8 h-8" />,
    category: "residential", 
    specs: {
      inverter: "5kVA Hybrid",
      battery: "400Ah Lithium",
      panels: "8 x 450W Mono",
      controller: "80A MPPT",
      installation: "Premium installation + 5-year service"
    },
    appliances: [
      "20+ LED lights",
      "6-8 ceiling fans",
      "55\" LED TV + sound system",
      "Large fridge + freezer",
      "1HP AC (8-10 hours)",
      "Washing machine",
      "Water heater (limited)",
      "Multiple laptops/devices",
      "Water pump",
      "Microwave (limited)"
    ],
    features: [
      "24-48 hours backup",
      "Hybrid grid-tie ready",
      "5-year warranty", 
      "Advanced monitoring",
      "Automatic load management",
      "Generator integration",
      "Remote support"
    ],
    dailyLoad: "4000-8000 Wh",
    popular: false
  },
  {
    id: "business",
    name: "Business Power Kit",
    price: "₦2,500,000 - ₦4,000,000",
    description: "Reliable power for offices, shops, and small factories",
    bestFor: "Offices, shops, small factories",
    icon: <Building className="w-8 h-8" />,
    category: "commercial",
    specs: {
      inverter: "10kVA 3-Phase Hybrid",
      battery: "800Ah Lithium",
      panels: "16 x 500W Mono", 
      controller: "100A MPPT x2",
      installation: "Commercial installation + maintenance"
    },
    appliances: [
      "Office lighting",
      "Multiple ACs",
      "Computers/servers",
      "Printers/equipment",
      "Security systems", 
      "Elevators (limited)",
      "Production equipment"
    ],
    features: [
      "Continuous operation",
      "3-phase output",
      "Grid-tie with backup",
      "10-year warranty",
      "24/7 monitoring",
      "Priority support",
      "Load scheduling"
    ],
    dailyLoad: "10000-20000 Wh",
    popular: false
  },
  {
    id: "industrial",
    name: "Industrial Power Solution", 
    price: "₦5,000,000+",
    description: "Large-scale solar solutions for factories and institutions",
    bestFor: "Factories, hospitals, schools, hotels",
    icon: <Factory className="w-8 h-8" />,
    category: "industrial",
    specs: {
      inverter: "50kVA+ 3-Phase",
      battery: "Custom design",
      panels: "100+ panels",
      controller: "Multiple MPPT",
      installation: "Turnkey project management"
    },
    appliances: [
      "Industrial equipment",
      "HVAC systems",
      "Medical equipment",
      "IT infrastructure",
      "Security systems",
      "Elevators",
      "Custom loads"
    ],
    features: [
      "Custom designed",
      "Grid-tie with export",
      "15+ year warranty",
      "SCADA monitoring", 
      "Predictive maintenance",
      "Performance guarantees",
      "Financing options"
    ],
    dailyLoad: "50000+ Wh",
    popular: false
  }
];

export default function BundlesGrid() {
  const residentialBundles = solarBundles.filter(bundle => bundle.category === "residential");
  const commercialBundles = solarBundles.filter(bundle => bundle.category === "commercial");
  const industrialBundles = solarBundles.filter(bundle => bundle.category === "industrial");

  const BundleCard = ({ bundle }: { bundle: typeof solarBundles[0] }) => (
    <div
      className={`bg-white rounded-xl shadow-lg border-2 p-6 relative ${
        bundle.popular
          ? "border-green-500 transform scale-105"
          : "border-gray-200"
      }`}
    >
      {bundle.popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
          {bundle.icon}
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {bundle.name}
        </h3>
        <div className="text-3xl font-bold text-green-600 mb-2">
          {bundle.price}
        </div>
        <p className="text-gray-600 mb-2">{bundle.description}</p>
        <div className="text-sm text-green-600 font-medium">
          Best for: {bundle.bestFor}
        </div>
        <div className="text-sm text-gray-500 mt-1">
          Daily Load: {bundle.dailyLoad}
        </div>
      </div>

      {/* Specifications */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">System Specifications</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Inverter:</span>
            <span className="text-gray-900 font-medium">{bundle.specs.inverter}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Battery:</span>
            <span className="text-gray-900 font-medium">{bundle.specs.battery}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Solar Panels:</span>
            <span className="text-gray-900 font-medium">{bundle.specs.panels}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Controller:</span>
            <span className="text-gray-900 font-medium">{bundle.specs.controller}</span>
          </div>
        </div>
      </div>

      {/* What It Can Power */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">What It Can Power</h4>
        <div className="grid grid-cols-2 gap-1 text-sm">
          {bundle.appliances.map((appliance, index) => (
            <div key={index} className="flex items-center text-gray-700">
              <Check className="w-3 h-3 text-green-500 mr-2 flex-shrink-0" />
              <span className="text-xs">{appliance}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="mb-6">
        <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
        <div className="space-y-1">
          {bundle.features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
              {feature}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Link
          href={`/calculator?preset=${bundle.id}`}
          className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center block"
        >
          Customize & Calculate
        </Link>
        <Link
          href={`/quote?bundle=${bundle.id}`}
          className="w-full border-2 border-green-600 text-green-600 py-3 px-4 rounded-lg hover:bg-green-50 transition-colors font-semibold text-center block"
        >
          Request Quote
        </Link>
      </div>
    </div>
  );

  return (
    <div className="space-y-16">
      {/* Residential Bundles */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Residential Solar Bundles
          </h2>
          <p className="text-lg text-gray-600">
            Perfect for Nigerian homes - from small apartments to large houses
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8">
          {residentialBundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </section>

      {/* Commercial Bundles */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Commercial Solar Solutions
          </h2>
          <p className="text-lg text-gray-600">
            Reliable power for offices, shops, and small businesses
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {commercialBundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </section>

      {/* Industrial Bundles */}
      <section>
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Industrial & Institutional
          </h2>
          <p className="text-lg text-gray-600">
            Large-scale solar solutions with custom design and installation
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {industrialBundles.map((bundle) => (
            <BundleCard key={bundle.id} bundle={bundle} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-50 rounded-2xl p-8 md:p-12 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
          Don't See What You Need?
        </h2>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          We create custom solar solutions for unique requirements. 
          Use our calculator or speak with our experts to design your perfect system.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/calculator"
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            Use Calculator
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
          
          <a
            href="https://wa.me/2348123456789?text=Hi! I need a custom solar solution. Can we discuss my requirements?"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white border-2 border-green-600 text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-50 transition-colors"
          >
            Speak with Expert
          </a>
        </div>
      </section>
    </div>
  );
}