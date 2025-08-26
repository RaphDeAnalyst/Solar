'use client'

import { useState } from 'react'
import { SunIcon, CalculatorIcon, ChatBubbleLeftRightIcon, PhoneIcon } from '@heroicons/react/24/outline'
import { SolarCalculator } from '@/components/calculator/SolarCalculator'

export default function HomePage() {
  const [showCalculator, setShowCalculator] = useState(false)

  const handleCalculatorClick = () => {
    setShowCalculator(true)
  }

  const handleWhatsAppClick = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+2348012345678'
    const message = encodeURIComponent('Hello! I\'m interested in solar solutions for my home in Nigeria. Can you help me?')
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  const handleCallClick = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+2348012345678'
    window.location.href = `tel:${phoneNumber}`
  }

  if (showCalculator) {
    return <SolarCalculator onBack={() => setShowCalculator(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <SunIcon className="h-8 w-8 text-orange-500" />
              <h1 className="text-xl font-bold text-gray-900">
                Solar Solutions Nigeria
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={handleCalculatorClick}
                className="btn-primary"
              >
                <CalculatorIcon className="w-4 h-4 mr-2" />
                Calculator
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="btn whatsapp-green text-white hover:bg-green-600"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
              Power Your Home with
              <span className="block text-orange-500">Reliable Solar Solutions</span>
            </h2>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Calculate the perfect solar system for your Nigerian home. 
              Get instant recommendations and quotes tailored to your power needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={handleCalculatorClick}
                className="btn-primary btn-lg solar-gradient border-none text-white hover:scale-105 transform transition-all duration-200 shadow-xl"
              >
                <CalculatorIcon className="w-6 h-6 mr-2" />
                Run Solar Calculator
              </button>
              <button
                onClick={handleWhatsAppClick}
                className="btn-outline btn-lg hover:bg-green-50 border-green-300 text-green-700 hover:border-green-400"
              >
                <ChatBubbleLeftRightIcon className="w-6 h-6 mr-2" />
                Chat with Expert
              </button>
            </div>
          </div>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-yellow-200 rounded-full opacity-20 animate-bounce-slow"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-orange-200 rounded-full opacity-20 animate-bounce-slow" style={{animationDelay: '1s'}}></div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Solar Calculator?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Designed specifically for Nigerian conditions with accurate calculations and local pricing
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: CalculatorIcon,
                title: 'Accurate Calculations',
                description: 'Nigerian-specific Peak Sun Hours for Lagos, Abuja, Kano, and Port Harcourt. Real efficiency factors and local conditions.'
              },
              {
                icon: SunIcon,
                title: 'Instant Recommendations',
                description: 'Get immediate system sizing for inverters, batteries, panels and charge controllers. Compare full systems vs solar generators.'
              },
              {
                icon: ChatBubbleLeftRightIcon,
                title: 'Expert Support',
                description: 'WhatsApp integration for instant quotes. Professional PDF reports with detailed breakdowns and pricing.'
              }
            ].map((feature, index) => (
              <div key={index} className="card p-6 text-center hover:shadow-lg transition-shadow duration-200">
                <feature.icon className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h4>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 solar-gradient">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Go Solar?
          </h3>
          <p className="text-xl text-orange-100 mb-8">
            Calculate your solar needs in just 3 minutes. Get instant recommendations and connect with experts.
          </p>
          <button
            onClick={handleCalculatorClick}
            className="btn-lg bg-white text-orange-600 hover:bg-gray-100 font-semibold shadow-xl hover:scale-105 transform transition-all duration-200"
          >
            <CalculatorIcon className="w-6 h-6 mr-2" />
            Start Your Solar Journey
          </button>
        </div>
      </section>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg safe-area-inset-bottom">
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={handleCallClick}
            className="flex flex-col items-center justify-center py-3 px-2 text-gray-600 hover:text-orange-500 transition-colors"
          >
            <PhoneIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">Call</span>
          </button>
          <button
            onClick={handleWhatsAppClick}
            className="flex flex-col items-center justify-center py-3 px-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <ChatBubbleLeftRightIcon className="w-6 h-6 mb-1" />
            <span className="text-xs">WhatsApp</span>
          </button>
          <button
            onClick={handleCalculatorClick}
            className="flex flex-col items-center justify-center py-3 px-2 bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            <CalculatorIcon className="w-6 h-6 mb-1" />
            <span className="text-xs font-medium">Calculator</span>
          </button>
        </div>
      </div>
    </div>
  )
}