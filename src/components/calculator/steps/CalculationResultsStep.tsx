'use client'

import { useState, useEffect } from 'react'
import { 
  SunIcon, 
  BoltIcon, 
  BatteryIcon, 
  CpuChipIcon,
  ShareIcon,
  DocumentArrowDownIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline'
import { SystemConfiguration, UserAppliance, CalculationResults } from '@/types'
import { calculateGeneratorComparison } from '@/lib/calculator'

interface CalculationResultsStepProps {
  calculationType: 'full_system' | 'solar_generator'
  appliances: UserAppliance[]
  systemConfig: SystemConfiguration
  results: any
}

export function CalculationResultsStep({
  calculationType,
  appliances,
  systemConfig,
  results
}: CalculationResultsStepProps) {
  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    location: systemConfig.location,
    message: ''
  })
  const [generatorComparison, setGeneratorComparison] = useState<any>(null)

  useEffect(() => {
    if (results?.daily_load_wh) {
      const comparison = calculateGeneratorComparison(
        results.daily_load_wh,
        950, // Default petrol price
        600000, // Estimated min system cost
        1200000 // Estimated max system cost
      )
      setGeneratorComparison(comparison)
    }
  }, [results])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleWhatsAppShare = () => {
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+2348012345678'
    const message = `Hello! I calculated my solar power needs:

🔋 Daily Energy: ${results.daily_load_wh}Wh
⚡ Peak Load: ${results.peak_load_w}W
📍 Location: ${systemConfig.location.charAt(0).toUpperCase() + systemConfig.location.slice(1)}
💰 Estimated Investment: ${formatCurrency(600000)} - ${formatCurrency(1200000)}

System Requirements:
• Inverter: ${results.inverter_size_w}W
• Batteries: ${results.battery_count}x ${results.battery_ah}Ah
• Solar Panels: ${results.panel_count}x ${systemConfig.panel_wattage}W
• Charge Controller: ${results.charge_controller_a}A

Can you help me with a detailed quote?`

    const encodedMessage = encodeURIComponent(message)
    window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank')
  }

  const handleCall = () => {
    const phoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+2348012345678'
    window.location.href = `tel:${phoneNumber}`
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <div className="spinner mx-auto mb-4" />
        <p className="text-gray-600">Calculating your solar system...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Your Solar System Results
        </h2>
        <p className="text-lg text-gray-600">
          Based on your power requirements and configuration
        </p>
      </div>

      {/* Main Results Card */}
      <div className="card bg-gradient-to-r from-orange-50 to-yellow-50 border-orange-200">
        <div className="card-header bg-orange-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-orange-900">System Requirements</h3>
            <SunIcon className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-y-2">
              <BoltIcon className="w-8 h-8 text-orange-500 mx-auto" />
              <p className="text-2xl font-bold text-orange-600">
                {(results.inverter_size_w / 1000).toFixed(1)}kW
              </p>
              <p className="text-sm text-gray-600">Inverter</p>
            </div>
            <div className="space-y-2">
              <BatteryIcon className="w-8 h-8 text-orange-500 mx-auto" />
              <p className="text-2xl font-bold text-orange-600">
                {results.battery_count}x{results.battery_ah}Ah
              </p>
              <p className="text-sm text-gray-600">Batteries</p>
            </div>
            <div className="space-y-2">
              <SunIcon className="w-8 h-8 text-orange-500 mx-auto" />
              <p className="text-2xl font-bold text-orange-600">
                {results.panel_count}x{systemConfig.panel_wattage}W
              </p>
              <p className="text-sm text-gray-600">Solar Panels</p>
            </div>
            <div className="space-y-2">
              <CpuChipIcon className="w-8 h-8 text-orange-500 mx-auto" />
              <p className="text-2xl font-bold text-orange-600">
                {results.charge_controller_a}A
              </p>
              <p className="text-sm text-gray-600">MPPT Controller</p>
            </div>
          </div>
        </div>
      </div>

      {/* Load Analysis */}
      <div className="card">
        <div className="card-header">
          <h3 className="font-semibold text-gray-900">Your Power Analysis</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Daily Energy Consumption</h4>
              <div className="space-y-2">
                {appliances.map((appliance) => (
                  <div key={appliance.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {appliance.name} ({appliance.quantity}x)
                    </span>
                    <span className="font-medium">
                      {appliance.daily_consumption}Wh
                    </span>
                  </div>
                ))}
                <div className="border-t pt-2 flex justify-between font-semibold text-orange-600">
                  <span>Total Daily Load</span>
                  <span>{results.daily_load_wh}Wh</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">System Specifications</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Peak Load</span>
                  <span className="font-medium">{results.peak_load_w}W</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">System Voltage</span>
                  <span className="font-medium">{systemConfig.system_voltage}V</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Battery Type</span>
                  <span className="font-medium">
                    {systemConfig.battery_type === 'lead_acid' ? 'Lead Acid/AGM' : 'LiFePO4 Lithium'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Backup Days</span>
                  <span className="font-medium">{systemConfig.autonomy_days} day(s)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">
                    {systemConfig.location.charAt(0).toUpperCase() + systemConfig.location.slice(1)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Generator Comparison */}
      {generatorComparison && (
        <div className="card bg-green-50 border-green-200">
          <div className="card-header bg-green-100">
            <h3 className="font-semibold text-green-900">💰 Solar vs Generator Cost Analysis</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(generatorComparison.monthly_fuel_cost)}
                </p>
                <p className="text-sm text-gray-600">Monthly Fuel Cost</p>
                <p className="text-xs text-gray-500 mt-1">
                  {generatorComparison.daily_fuel_consumption_l.toFixed(1)}L/day @ ₦950/L
                </p>
              </div>
              <div>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(generatorComparison.annual_fuel_cost)}
                </p>
                <p className="text-sm text-gray-600">Annual Fuel Cost</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">
                  {generatorComparison.solar_payback_months} months
                </p>
                <p className="text-sm text-gray-600">Solar Payback Period</p>
                <p className="text-xs text-green-600 mt-1">
                  Save ₦{generatorComparison.monthly_savings.toLocaleString()}/month
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-100 rounded-lg">
              <p className="text-sm text-green-800 text-center">
                <strong>💡 Going solar pays for itself in {generatorComparison.solar_payback_months} months, 
                then saves you ₦{generatorComparison.monthly_savings.toLocaleString()} every month!</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* System Validation */}
      {results.validation && (
        <div className="space-y-4">
          {results.validation.warnings.length > 0 && (
            <div className="alert-warning">
              <div className="flex">
                <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800 mb-1">System Warnings</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {results.validation.warnings.map((warning: string, index: number) => (
                      <li key={index}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {results.validation.recommendations.length > 0 && (
            <div className="alert-info">
              <div className="flex">
                <InformationCircleIcon className="w-5 h-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Recommendations</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {results.validation.recommendations.map((recommendation: string, index: number) => (
                      <li key={index}>• {recommendation}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {results.validation.isValid && (
            <div className="alert-success">
              <div className="flex items-center">
                <CheckCircleIcon className="w-5 h-5 text-green-600 mr-2" />
                <p className="text-sm text-green-800">
                  ✅ Your system configuration looks good! No major issues detected.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={handleWhatsAppShare}
          className="btn whatsapp-green text-white hover:bg-green-600 flex items-center justify-center"
        >
          <ShareIcon className="w-5 h-5 mr-2" />
          Share on WhatsApp
        </button>
        
        <button
          onClick={handleCall}
          className="btn-primary flex items-center justify-center"
        >
          <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
          Call Expert
        </button>
        
        <button
          onClick={() => setShowLeadForm(true)}
          className="btn-outline flex items-center justify-center"
        >
          <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
          Request Quote
        </button>
        
        <button
          onClick={() => window.print()}
          className="btn-secondary flex items-center justify-center"
        >
          <DocumentArrowDownIcon className="w-5 h-5 mr-2" />
          Print Results
        </button>
      </div>

      {/* Estimated Pricing */}
      <div className="card bg-blue-50 border-blue-200">
        <div className="card-header bg-blue-100">
          <h3 className="font-semibold text-blue-900">💰 Estimated Investment</h3>
        </div>
        <div className="card-body text-center">
          <p className="text-3xl font-bold text-blue-600 mb-2">
            {formatCurrency(600000)} - {formatCurrency(1200000)}
          </p>
          <p className="text-sm text-blue-700 mb-4">
            Complete system with installation (price varies by brand and specifications)
          </p>
          <div className="text-xs text-blue-600 space-y-1">
            <p>✅ All components included</p>
            <p>✅ Professional installation</p>
            <p>✅ 1-year warranty</p>
            <p>✅ After-sales support</p>
          </div>
        </div>
      </div>

      {/* Lead Form Modal */}
      {showLeadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <div className="card-header">
              <h3 className="font-semibold text-gray-900">Request Detailed Quote</h3>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  value={leadForm.name}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="form-label">WhatsApp Number *</label>
                <input
                  type="tel"
                  className="form-input"
                  value={leadForm.whatsapp}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, whatsapp: e.target.value }))}
                  placeholder="+234 801 234 5678"
                />
              </div>
              <div>
                <label className="form-label">Email (Optional)</label>
                <input
                  type="email"
                  className="form-input"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <label className="form-label">Additional Requirements</label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={leadForm.message}
                  onChange={(e) => setLeadForm(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Any specific requirements or questions?"
                />
              </div>
            </div>
            <div className="card-footer flex gap-2">
              <button
                onClick={() => {
                  // Handle form submission here
                  console.log('Lead form submitted:', leadForm, results)
                  setShowLeadForm(false)
                  alert('Quote request submitted! We\'ll contact you soon.')
                }}
                disabled={!leadForm.name || !leadForm.whatsapp}
                className="btn-primary flex-1 disabled:opacity-50"
              >
                Submit Request
              </button>
              <button
                onClick={() => setShowLeadForm(false)}
                className="btn-outline"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}