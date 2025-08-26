"use client";

import Link from "next/link";
import { ArrowRight, Battery, Zap, Sun } from "lucide-react";

export default function FeaturedProducts() {
  const products = [
    {
      id: 1,
      name: "Basic Home Kit",
      price: "₦350,000 - ₦500,000",
      description: "Perfect for lights, fans, and small appliances",
      features: [
        "1.5kVA Inverter",
        "100Ah Battery",
        "2 x 300W Solar Panels",
        "Basic Installation"
      ],
      icon: <Sun className="w-8 h-8" />,
      bestFor: "1-2 bedroom apartments"
    },
    {
      id: 2,
      name: "Comfort Home Kit",
      price: "₦650,000 - ₦900,000",
      description: "Run TV, fridge, and essential appliances comfortably",
      features: [
        "3kVA Inverter",
        "200Ah Lithium Battery",
        "4 x 400W Solar Panels",
        "Professional Installation"
      ],
      icon: <Zap className="w-8 h-8" />,
      bestFor: "3-4 bedroom homes",
      popular: true
    },
    {
      id: 3,
      name: "Premium Home Kit",
      price: "₦1,200,000 - ₦2,000,000",
      description: "Complete home power including AC and high-power appliances",
      features: [
        "5kVA Inverter",
        "400Ah Lithium Battery",
        "8 x 450W Solar Panels",
        "Premium Installation & Warranty"
      ],
      icon: <Battery className="w-8 h-8" />,
      bestFor: "Large homes & small offices"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Solar Bundles
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Pre-configured solar systems designed for Nigerian homes. 
            Find the perfect fit for your power needs and budget.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className={`bg-white rounded-xl shadow-lg border-2 p-8 relative ${
                product.popular
                  ? "border-green-500 transform scale-105"
                  : "border-gray-200"
              }`}
            >
              {product.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  {product.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {product.price}
                </div>
                <p className="text-gray-600 mb-4">{product.description}</p>
                <div className="text-sm text-green-600 font-medium">
                  Best for: {product.bestFor}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="space-y-3">
                <Link
                  href={`/calculator?preset=${product.id}`}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold text-center block"
                >
                  Calculate & Customize
                </Link>
                <Link
                  href={`/quote?bundle=${product.id}`}
                  className="w-full border-2 border-green-600 text-green-600 py-3 px-4 rounded-lg hover:bg-green-50 transition-colors font-semibold text-center block"
                >
                  Request Quote
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/bundles"
            className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold text-lg"
          >
            View All Solar Bundles
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}