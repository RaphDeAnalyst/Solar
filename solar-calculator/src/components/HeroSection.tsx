"use client";

import Link from "next/link";
import { Calculator, Zap, Shield, DollarSign } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-green-600 to-green-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Power Your Home with 
            <span className="block text-yellow-300">Reliable Solar Solutions</span>
            <span className="block text-2xl md:text-3xl font-normal mt-2">in Nigeria</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-green-100">
            Say goodbye to PHCN outages and noisy generators. 
            Calculate your solar needs, get expert guidance, and power your life with clean energy.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/calculator"
              className="bg-yellow-400 text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors flex items-center justify-center"
            >
              <Calculator className="w-6 h-6 mr-2" />
              Calculate Your Solar System
            </Link>
            
            <Link
              href="/products"
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors"
            >
              View Products
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Reliable Power</h3>
              <p className="text-green-100">
                24/7 electricity without depending on PHCN or noisy generators
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cost Effective</h3>
              <p className="text-green-100">
                Save money on fuel costs and reduce your electricity bills long-term
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
              <p className="text-green-100">
                Professional guidance from consultation to installation and maintenance
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}