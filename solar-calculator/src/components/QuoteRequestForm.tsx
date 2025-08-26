"use client";

import { useState } from "react";
import { ArrowLeft, Send, User, Phone, Mail, MapPin, MessageCircle, Calendar } from "lucide-react";

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

interface QuoteRequestFormProps {
  results: CalculationResults;
  appliances: Appliance[];
  onClose: () => void;
}

export default function QuoteRequestForm({ results, appliances, onClose }: QuoteRequestFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
    city: results.city,
    propertyType: "residential",
    installationTimeframe: "1-3 months",
    budget: `₦${results.costEstimate.min.toLocaleString()} - ₦${results.costEstimate.max.toLocaleString()}`,
    additionalRequirements: "",
    preferredContactMethod: "whatsapp"
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real application, you would send this data to your backend
    const quoteData = {
      ...formData,
      calculatorResults: results,
      appliances: appliances,
      timestamp: new Date().toISOString(),
      leadSource: 'calculator'
    };
    
    console.log('Quote request:', quoteData);
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-10 h-10 text-green-600" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Quote Request Sent!</h2>
        <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
          Thank you for your interest! Our solar experts will contact you within 24 hours with a detailed quote.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-green-900 mb-2">What happens next?</h3>
          <div className="text-left text-sm text-green-800 space-y-2">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">1</div>
              Expert review of your requirements (within 4 hours)
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">2</div>
              Detailed quote with itemized pricing sent to your email
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">3</div>
              Follow-up call/WhatsApp to discuss and customize
            </div>
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">4</div>
              Optional site visit for accurate sizing (Lagos/Abuja)
            </div>
          </div>
        </div>
        
        <div className="flex gap-4 justify-center">
          <button
            onClick={onClose}
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Results
          </button>
          <a
            href={`https://wa.me/2348123456789?text=Hi! I just submitted a quote request through your calculator. My reference is QR-${Date.now().toString(36).toUpperCase()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center text-green-600 hover:text-green-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Results
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Request Detailed Quote</h2>
        <div></div>
      </div>

      {/* Summary */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h3 className="font-semibold text-green-900 mb-3">Your Solar System Summary</h3>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-green-700 font-medium">Daily Load</p>
            <p className="text-green-900">{results.dailyLoadWh.toLocaleString()} Wh</p>
          </div>
          <div>
            <p className="text-green-700 font-medium">Recommended Bundle</p>
            <p className="text-green-900">{results.recommendedBundle}</p>
          </div>
          <div>
            <p className="text-green-700 font-medium">Estimated Cost</p>
            <p className="text-green-900">₦{results.costEstimate.min.toLocaleString()} - ₦{results.costEstimate.max.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <User className="w-5 h-5 mr-2" />
            Personal Information
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="e.g., +234 812 345 6789"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                placeholder="your@email.com"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <select
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="Lagos">Lagos</option>
                <option value="Abuja">Abuja</option>
                <option value="Kano">Kano</option>
                <option value="Ibadan">Ibadan</option>
                <option value="Port Harcourt">Port Harcourt</option>
                <option value="Kaduna">Kaduna</option>
                <option value="Benin City">Benin City</option>
                <option value="Maiduguri">Maiduguri</option>
                <option value="Jos">Jos</option>
                <option value="Ilorin">Ilorin</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows={2}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Enter your complete address (helpful for site visit)"
            />
          </div>
        </div>

        {/* Project Details */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2" />
            Project Details
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Type
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="residential">Residential Home</option>
                <option value="apartment">Apartment</option>
                <option value="office">Small Office</option>
                <option value="shop">Shop/Store</option>
                <option value="warehouse">Warehouse</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Installation Timeframe
              </label>
              <select
                name="installationTimeframe"
                value={formData.installationTimeframe}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              >
                <option value="asap">As soon as possible</option>
                <option value="1-3 months">1-3 months</option>
                <option value="3-6 months">3-6 months</option>
                <option value="6-12 months">6-12 months</option>
                <option value="just exploring">Just exploring options</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Budget Range
            </label>
            <input
              type="text"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., ₦500,000 - ₦800,000"
            />
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Requirements or Questions
            </label>
            <textarea
              name="additionalRequirements"
              value={formData.additionalRequirements}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
              placeholder="Any specific requirements, questions, or concerns? e.g., ground mount vs roof mount, backup generator integration, etc."
            />
          </div>
        </div>

        {/* Contact Preferences */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2" />
            Contact Preferences
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you prefer to be contacted?
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="whatsapp"
                  checked={formData.preferredContactMethod === "whatsapp"}
                  onChange={handleInputChange}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">WhatsApp (fastest response)</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="phone"
                  checked={formData.preferredContactMethod === "phone"}
                  onChange={handleInputChange}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Phone call</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="preferredContactMethod"
                  value="email"
                  checked={formData.preferredContactMethod === "email"}
                  onChange={handleInputChange}
                  className="text-green-600 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Email only</span>
              </label>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 disabled:bg-green-300 transition-colors flex items-center mx-auto"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Sending Request...
              </>
            ) : (
              <>
                <Send className="w-6 h-6 mr-2" />
                Request Quote
              </>
            )}
          </button>
          
          <p className="text-sm text-gray-500 mt-4">
            By submitting this form, you agree to be contacted by our solar experts. 
            We respect your privacy and will never share your information.
          </p>
        </div>
      </form>
    </div>
  );
}