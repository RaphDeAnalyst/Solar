"use client";

import { useState } from "react";
import { Battery, Zap, Sun, Settings, ArrowLeft, Download, MessageCircle, Phone } from "lucide-react";
import QuoteRequestForm from "./QuoteRequestForm";

interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  quantity: number;
}

interface CalculationResults {
  dailyLoadWh: number;
  inverterSizeW: number;
  batteryCapacityWh: number;
  batteryCapacityAh: number;
  solarPanelsW: number;
  numberOfPanels: number;
  chargeControllerA: number;
  costEstimate: {
    min: number;
    max: number;
  };
  recommendedBundle: string;
  city: string;
  sunHours: number;
}

interface CalculatorResultsProps {
  results: CalculationResults;
  appliances: Appliance[];
  onRecalculate: () => void;
}

export default function CalculatorResults({ results, appliances, onRecalculate }: CalculatorResultsProps) {
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  
  const whatsappNumber = "2348123456789";
  const whatsappMessage = `Hi! I used your solar calculator and got these results:

🏠 Location: ${results.city}
⚡ Daily Load: ${results.dailyLoadWh.toLocaleString()} Wh
🔋 Recommended: ${results.recommendedBundle}
💰 Budget: ₦${results.costEstimate.min.toLocaleString()} - ₦${results.costEstimate.max.toLocaleString()}

I'd like to discuss this further and get a detailed quote.`;

  const handleWhatsAppShare = () => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  if (showQuoteForm) {
    return (
      <QuoteRequestForm 
        results={results}
        appliances={appliances}
        onClose={() => setShowQuoteForm(false)}
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onRecalculate}
          className="flex items-center text-green-600 hover:text-green-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Calculator
        </button>
        <div className="text-right">
          <p className="text-sm text-gray-500">Results for</p>
          <p className="font-semibold text-gray-900">{results.city}</p>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">Your Solar System Requirements</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="text-green-100 mb-2">Daily Energy Consumption</p>
            <p className="text-3xl font-bold">{results.dailyLoadWh.toLocaleString()} Wh</p>
          </div>
          <div>
            <p className="text-green-100 mb-2">Estimated Cost</p>
            <p className="text-3xl font-bold">
              ₦{results.costEstimate.min.toLocaleString()} - ₦{results.costEstimate.max.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-green-500 rounded-lg">
          <p className="text-lg font-semibold mb-2">Recommended Bundle</p>
          <p className="text-2xl font-bold text-yellow-300">{results.recommendedBundle}</p>
          <p className="text-green-100 mt-2">Perfect for your power needs and location</p>
        </div>
      </div>

      {/* Detailed Specifications */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Inverter</h3>
          <p className="text-2xl font-bold text-blue-600">{results.inverterSizeW}W</p>
          <p className="text-sm text-gray-500">Minimum capacity</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Battery className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Battery</h3>
          <p className="text-2xl font-bold text-green-600">{results.batteryCapacityAh}Ah</p>
          <p className="text-sm text-gray-500">{results.batteryCapacityWh.toLocaleString()}Wh @ 12V</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sun className="w-6 h-6 text-yellow-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Solar Panels</h3>
          <p className="text-2xl font-bold text-yellow-600">{results.numberOfPanels} × 400W</p>
          <p className="text-sm text-gray-500">{results.solarPanelsW}W total</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Controller</h3>
          <p className="text-2xl font-bold text-purple-600">{results.chargeControllerA}A</p>
          <p className="text-sm text-gray-500">MPPT recommended</p>
        </div>
      </div>

      {/* Appliances List */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Appliances</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-semibold text-gray-900">Appliance</th>
                <th className="text-right py-2 font-semibold text-gray-900">Power</th>
                <th className="text-right py-2 font-semibold text-gray-900">Hours/Day</th>
                <th className="text-right py-2 font-semibold text-gray-900">Daily Energy</th>
              </tr>
            </thead>
            <tbody>
              {appliances.map((appliance) => (
                <tr key={appliance.id} className="border-b">
                  <td className="py-2 text-gray-800 font-medium">{appliance.name} {appliance.quantity > 1 && `(×${appliance.quantity})`}</td>
                  <td className="text-right py-2 text-gray-800 font-medium">{appliance.watts * appliance.quantity}W</td>
                  <td className="text-right py-2 text-gray-800 font-medium">{appliance.hoursPerDay}h</td>
                  <td className="text-right py-2 font-semibold text-gray-900">
                    {(appliance.watts * appliance.hoursPerDay * appliance.quantity).toLocaleString()}Wh
                  </td>
                </tr>
              ))}
              <tr className="border-b-2 border-gray-300 font-bold">
                <td className="py-2 text-gray-900 font-bold">Total</td>
                <td className="text-right py-2 text-gray-900 font-bold">
                  {appliances.reduce((total, app) => total + (app.watts * app.quantity), 0)}W
                </td>
                <td className="text-right py-2 text-gray-900 font-bold">-</td>
                <td className="text-right py-2 text-green-700 font-bold text-lg">
                  {results.dailyLoadWh.toLocaleString()}Wh
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Location Context */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Location Factors - {results.city}</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-medium text-blue-900">Peak Sun Hours</p>
            <p className="text-blue-700">{results.sunHours} hours/day</p>
          </div>
          <div>
            <p className="font-medium text-blue-900">System Efficiency</p>
            <p className="text-blue-700">80% (losses included)</p>
          </div>
          <div>
            <p className="font-medium text-blue-900">Backup Duration</p>
            <p className="text-blue-700">2 days without sun</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid md:grid-cols-3 gap-4">
        <button
          onClick={() => setShowQuoteForm(true)}
          className="bg-green-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <Download className="w-5 h-5 mr-2" />
          Request Detailed Quote
        </button>
        
        <button
          onClick={handleWhatsAppShare}
          className="bg-green-500 text-white py-4 px-6 rounded-lg font-semibold hover:bg-green-600 transition-colors flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Share on WhatsApp
        </button>
        
        <a
          href="tel:+2348123456789"
          className="bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Phone className="w-5 h-5 mr-2" />
          Call Expert
        </a>
      </div>

      {/* Alternative Recommendations */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alternative Options</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {results.dailyLoadWh < 2000 && (
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-2">EcoFlow River 2 Pro</h4>
              <p className="text-sm text-gray-600 mb-2">Portable solar generator option</p>
              <p className="text-green-600 font-semibold">₦800,000 - ₦1,200,000</p>
              <p className="text-xs text-gray-500 mt-1">Plug-and-play, expandable system</p>
            </div>
          )}
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-2">Hybrid Grid-Tie System</h4>
            <p className="text-sm text-gray-600 mb-2">Works with PHCN when available</p>
            <p className="text-green-600 font-semibold">+₦200,000 - ₦400,000</p>
            <p className="text-xs text-gray-500 mt-1">Sell excess power back to grid</p>
          </div>
        </div>
      </div>
    </div>
  );
}