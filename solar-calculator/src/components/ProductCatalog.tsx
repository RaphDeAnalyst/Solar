"use client";

import { useState } from "react";
import { Battery, Zap, Sun, Settings, Filter, Star } from "lucide-react";

const productCategories = [
  { id: "all", name: "All Products", icon: <Star className="w-5 h-5" /> },
  { id: "inverters", name: "Inverters", icon: <Zap className="w-5 h-5" /> },
  { id: "batteries", name: "Batteries", icon: <Battery className="w-5 h-5" /> },
  { id: "panels", name: "Solar Panels", icon: <Sun className="w-5 h-5" /> },
  { id: "controllers", name: "Controllers", icon: <Settings className="w-5 h-5" /> }
];

const products = [
  // Inverters
  {
    id: 1,
    category: "inverters",
    name: "Felicity 1.5kVA Pure Sine Wave Inverter",
    brand: "Felicity",
    power: "1500W",
    price: "₦120,000 - ₦150,000",
    image: "/api/placeholder/300/200",
    description: "Reliable pure sine wave inverter perfect for home use",
    specs: [
      "Pure sine wave output",
      "12V DC input",
      "220V AC output",
      "Built-in charger",
      "LCD display",
      "2-year warranty"
    ],
    inStock: true,
    rating: 4.5
  },
  {
    id: 2,
    category: "inverters", 
    name: "Su-Kam 3kVA Hybrid Inverter",
    brand: "Su-Kam",
    power: "3000W",
    price: "₦250,000 - ₦300,000",
    image: "/api/placeholder/300/200",
    description: "Hybrid inverter with MPPT charge controller built-in",
    specs: [
      "Hybrid grid-tie ready",
      "Built-in MPPT controller",
      "WiFi monitoring",
      "Automatic transfer switch",
      "24V/48V compatible",
      "3-year warranty"
    ],
    inStock: true,
    rating: 4.7
  },
  {
    id: 3,
    category: "inverters",
    name: "Luminous 5kVA Three Phase Inverter",
    brand: "Luminous", 
    power: "5000W",
    price: "₦450,000 - ₦550,000",
    image: "/api/placeholder/300/200",
    description: "Three phase inverter for commercial applications",
    specs: [
      "Three phase output",
      "Pure sine wave",
      "Grid synchronization",
      "Remote monitoring",
      "48V DC input",
      "5-year warranty"
    ],
    inStock: false,
    rating: 4.3
  },

  // Batteries
  {
    id: 4,
    category: "batteries",
    name: "Trojan 100Ah Deep Cycle Battery",
    brand: "Trojan",
    power: "100Ah",
    price: "₦80,000 - ₦100,000",
    image: "/api/placeholder/300/200",
    description: "Premium deep cycle battery for solar systems",
    specs: [
      "100Ah capacity",
      "12V nominal",
      "Deep cycle design",
      "5-year warranty",
      "Maintenance free",
      "AGM technology"
    ],
    inStock: true,
    rating: 4.6
  },
  {
    id: 5,
    category: "batteries",
    name: "Felicity Lithium 200Ah Battery",
    brand: "Felicity",
    power: "200Ah",
    price: "₦350,000 - ₦400,000",
    image: "/api/placeholder/300/200", 
    description: "Lightweight lithium battery with long cycle life",
    specs: [
      "200Ah LiFePO4",
      "12V nominal",
      "6000+ cycles",
      "BMS protection",
      "10-year warranty",
      "Fast charging"
    ],
    inStock: true,
    rating: 4.8
  },
  {
    id: 6,
    category: "batteries",
    name: "Rolls 400Ah Flooded Battery Bank",
    brand: "Rolls",
    power: "400Ah", 
    price: "₦200,000 - ₦250,000",
    image: "/api/placeholder/300/200",
    description: "High capacity flooded battery for large systems",
    specs: [
      "400Ah @ 12V",
      "Flooded lead acid",
      "Industrial grade",
      "7-year warranty",
      "Renewable energy optimized",
      "Field serviceable"
    ],
    inStock: true,
    rating: 4.4
  },

  // Solar Panels
  {
    id: 7,
    category: "panels",
    name: "Jinko 400W Monocrystalline Panel",
    brand: "Jinko",
    power: "400W",
    price: "₦120,000 - ₦140,000",
    image: "/api/placeholder/300/200",
    description: "High efficiency monocrystalline solar panel",
    specs: [
      "400W peak power",
      "Monocrystalline cells",
      "21% efficiency",
      "25-year warranty",
      "IP67 junction box",
      "1956×992×40mm"
    ],
    inStock: true,
    rating: 4.7
  },
  {
    id: 8,
    category: "panels",
    name: "Canadian Solar 300W Panel",
    brand: "Canadian Solar",
    power: "300W",
    price: "₦95,000 - ₦110,000",
    image: "/api/placeholder/300/200",
    description: "Reliable polycrystalline solar panel",
    specs: [
      "300W peak power", 
      "Polycrystalline cells",
      "18.5% efficiency",
      "25-year warranty",
      "Tier 1 manufacturer",
      "1640×992×35mm"
    ],
    inStock: true,
    rating: 4.5
  },
  {
    id: 9,
    category: "panels",
    name: "Trina Solar 450W Bifacial Panel",
    brand: "Trina",
    power: "450W",
    price: "₦160,000 - ₦180,000",
    image: "/api/placeholder/300/200",
    description: "High-performance bifacial solar panel",
    specs: [
      "450W peak power",
      "Bifacial technology",
      "22% front efficiency",
      "30-year warranty",
      "Anti-PID technology", 
      "2094×1038×35mm"
    ],
    inStock: false,
    rating: 4.9
  },

  // Controllers
  {
    id: 10,
    category: "controllers",
    name: "Victron MPPT 30A Controller",
    brand: "Victron",
    power: "30A",
    price: "₦85,000 - ₦100,000",
    image: "/api/placeholder/300/200",
    description: "Premium MPPT charge controller with Bluetooth",
    specs: [
      "30A charge current",
      "MPPT technology",
      "Bluetooth monitoring",
      "12V/24V auto select",
      "5-year warranty",
      "VictronConnect app"
    ],
    inStock: true,
    rating: 4.8
  },
  {
    id: 11,
    category: "controllers",
    name: "EPEver 60A MPPT Controller",
    brand: "EPEver",
    power: "60A",
    price: "₦45,000 - ₦60,000",
    image: "/api/placeholder/300/200",
    description: "Cost-effective MPPT controller with LCD display",
    specs: [
      "60A charge current",
      "MPPT algorithm",
      "LCD display",
      "12V/24V/36V/48V",
      "2-year warranty",
      "Temperature compensation"
    ],
    inStock: true,
    rating: 4.4
  },
  {
    id: 12,
    category: "controllers",
    name: "Morningstar PWM 20A Controller",
    brand: "Morningstar",
    power: "20A", 
    price: "₦25,000 - ₦35,000",
    image: "/api/placeholder/300/200",
    description: "Basic PWM controller for small systems",
    specs: [
      "20A charge current",
      "PWM technology",
      "LED indicators",
      "12V systems only",
      "3-year warranty",
      "Low voltage disconnect"
    ],
    inStock: true,
    rating: 4.2
  }
];

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filteredProducts, setFilteredProducts] = useState(products);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (categoryId === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === categoryId));
    }
  };

  const ProductCard = ({ product }: { product: typeof products[0] }) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Product Image */}
      <div className="h-48 bg-gray-100 flex items-center justify-center relative">
        <Sun className="w-16 h-16 text-gray-400" />
        {!product.inStock && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
            Out of Stock
          </div>
        )}
        {product.inStock && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
            In Stock
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Product Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {product.name}
            </h3>
            <div className="flex items-center ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-green-600 font-medium">{product.brand}</span>
            <span className="text-sm font-medium text-gray-700">{product.power}</span>
          </div>
          
          <div className="text-2xl font-bold text-green-600 mb-2">
            {product.price}
          </div>
          
          <p className="text-gray-600 text-sm">
            {product.description}
          </p>
        </div>

        {/* Specifications */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-2">Key Features</h4>
          <div className="grid grid-cols-2 gap-1">
            {product.specs.slice(0, 4).map((spec, index) => (
              <div key={index} className="flex items-center text-xs text-gray-600">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 flex-shrink-0"></div>
                {spec}
              </div>
            ))}
          </div>
          {product.specs.length > 4 && (
            <div className="text-xs text-gray-500 mt-1">
              +{product.specs.length - 4} more features
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
              product.inStock
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={!product.inStock}
          >
            {product.inStock ? "Request Quote" : "Out of Stock"}
          </button>
          
          <button className="w-full border-2 border-green-600 text-green-600 py-2 px-4 rounded-lg hover:bg-green-50 transition-colors font-medium text-sm">
            View Details
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Product Categories
        </h2>
        <div className="flex flex-wrap gap-3">
          {productCategories.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {category.icon}
              <span className="ml-2">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Sun className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No products found
          </h3>
          <p className="text-gray-600">
            Try selecting a different category or check back later for new products.
          </p>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-green-50 rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Need Help Choosing Components?
        </h2>
        <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
          Our solar experts can help you select the right components for your specific needs and budget.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Speak with Expert
          </button>
          <button className="bg-white border-2 border-green-600 text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
            Use Calculator
          </button>
        </div>
      </div>
    </div>
  );
}