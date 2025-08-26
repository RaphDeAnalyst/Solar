'use client'

import { useState } from 'react'
import { MapPinIcon, BatteryIcon, CogIcon } from '@heroicons/react/24/outline'
import { SystemConfiguration, UserAppliance } from '@/types'
import { createSolarCalculator } from '@/lib/calculator'

interface SystemConfigurationStepProps {
  configuration: SystemConfiguration
  onChange: (config: SystemConfiguration) => void
  calculationType: 'full_system' | 'solar_generator'
  appliances: UserAppliance[]
  onNext: () => void
  onCalculate: (results: any) => void
}

export function SystemConfigurationStep({
  configuration,
  onChange,
  calculationType,
  appliances,
  onNext,
  onCalculate
}: SystemConfigurationStepProps) {
  const [isCalculating, setIsCalculating] = useState(false)

  const locations = [
    { code: 'lagos', name: 'Lagos', psh: 4.5 },
    { code: 'abuja', name: 'Abuja', psh: 5.5 },
    { code: 'kano', name: 'Kano', psh: 6.0 },
    { code: 'ph', name: 'Port Harcourt', psh: 4.8 }
  ]

  const batteryTypes = [
    { 
      code: 'lead_acid', 
      name: 'Lead Acid / AGM', 
      dod: 50,
      description: 'Most affordable, proven technology',
      pros: ['Lower upfront cost', 'Widely available', 'Easy to maintain'],
      cons: ['Shorter lifespan', '50% usable capacity', 'Heavier']
    },
    { 
      code: 'lifepo4', 
      name: 'LiFePO4 Lithium', 
      dod: 80,
      description: 'Premium option, longer lasting',
      pros: ['Long lifespan (6000+ cycles)', '80% usable capacity', 'Lightweight'],
      cons: ['Higher upfront cost', 'Requires BMS']
    }
  ]

  const systemVoltages = [
    { value: 12, name: '12V', description: 'Small systems (up to 1.5kW)' },
    { value: 24, name: '24V', description: 'Medium systems (1.5kW - 5kW)' },
    { value: 48, name: '48V', description: 'Large systems (5kW+)' }
  ]

  const panelWattages = [100, 150, 200, 250, 300, 400, 450, 500, 550]
  const autonomyOptions = [1, 2, 3, 5]

  const handleCalculate = async () => {
    setIsCalculating(true)
    
    try {
      // Create calculator instance
      const calculator = createSolarCalculator(appliances, configuration)
      
      // Perform calculations
      const results = calculator.calculate()
      const validation = calculator.validateSystem(results)
      const generatorComparison = calculator.calculateGeneratorComparison(
        results.daily_load_wh,
        950, // Default petrol price
        results.estimated_cost_min,
        results.estimated_cost_max
      )

      // Add validation and comparison to results
      const fullResults = {
        ...results,
        validation,
        generator_comparison: generatorComparison,
        appliances: appliances,
        configuration: configuration
      }

      onCalculate(fullResults)
      onNext()
    } catch (error) {
      console.error('Calculation error:', error)
      alert('Error calculating system. Please check your inputs and try again.')
    } finally {
      setIsCalculating(false)
    }
  }

  const getTotalDailyLoad = () => {
    return appliances.reduce((total, appliance) => 
      total + (appliance.watts * appliance.hours * appliance.quantity), 0)
  }

  const getTotalPeakLoad = () => {
    return appliances.reduce((total, appliance) => 
      total + (appliance.watts * appliance.quantity), 0)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          System Configuration
        </h2>
        <p className="text-lg text-gray-600">
          Configure your system settings for accurate calculations
        </p>
      </div>

      {/* Load Summary */}
      <div className="card bg-orange-50 border-orange-200">
        <div className="card-header bg-orange-100">
          <h3 className="font-semibold text-orange-900">Your Power Requirements</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-orange-600">{appliances.length}</p>
              <p className="text-sm text-gray-600">Appliances</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{getTotalDailyLoad().toLocaleString()}</p>
              <p className="text-sm text-gray-600">Wh/day</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{getTotalPeakLoad().toLocaleString()}</p>
              <p className="text-sm text-gray-600">W peak</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Location */}
        <div className="card">
          <div className="card-header flex items-center">
            <MapPinIcon className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Location</h3>
          </div>
          <div className="card-body space-y-3">
            <p className="text-sm text-gray-600">
              Choose your location for accurate sun hours calculation
            </p>
            <div className="space-y-2">
              {locations.map((location) => (
                <label 
                  key={location.code}
                  className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${
                    configuration.location === location.code
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="location"
                      value={location.code}
                      checked={configuration.location === location.code}
                      onChange={(e) => onChange({ ...configuration, location: e.target.value })}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{location.name}</p>
                      <p className="text-sm text-gray-500">{location.psh} peak sun hours/day</p>
                    </div>
                  </div>
                  {configuration.location === location.code && (
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Battery Type */}
        <div className="card">
          <div className="card-header flex items-center">
            <BatteryIcon className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Battery Technology</h3>
          </div>
          <div className="card-body space-y-3">
            <p className="text-sm text-gray-600">
              Choose battery type based on budget and requirements
            </p>
            <div className="space-y-3">
              {batteryTypes.map((battery) => (
                <label 
                  key={battery.code}
                  className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    configuration.battery_type === battery.code
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="battery_type"
                        value={battery.code}
                        checked={configuration.battery_type === battery.code}
                        onChange={(e) => onChange({ ...configuration, battery_type: e.target.value as any })}
                        className="sr-only"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{battery.name}</p>
                        <p className="text-sm text-gray-500">{battery.dod}% usable capacity</p>
                      </div>
                    </div>
                    {configuration.battery_type === battery.code && (
                      <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{battery.description}</p>
                  <div className="text-xs">
                    <p className="text-green-600">✓ {battery.pros.join(', ')}</p>
                    <p className="text-orange-600">⚠ {battery.cons.join(', ')}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      {calculationType === 'full_system' && (
        <div className="card">
          <div className="card-header flex items-center">
            <CogIcon className="w-5 h-5 text-gray-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Advanced Settings</h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* System Voltage */}
              <div>
                <label className="form-label">System Voltage</label>
                <select
                  className="form-input"
                  value={configuration.system_voltage}
                  onChange={(e) => onChange({ ...configuration, system_voltage: parseInt(e.target.value) as any })}
                >
                  {systemVoltages.map((voltage) => (
                    <option key={voltage.value} value={voltage.value}>
                      {voltage.name} - {voltage.description}
                    </option>
                  ))}
                </select>
                <p className="form-help">Higher voltage = more efficient for larger systems</p>
              </div>

              {/* Backup Days */}
              <div>
                <label className="form-label">Backup Days</label>
                <select
                  className="form-input"
                  value={configuration.autonomy_days}
                  onChange={(e) => onChange({ ...configuration, autonomy_days: parseInt(e.target.value) })}
                >
                  {autonomyOptions.map((days) => (
                    <option key={days} value={days}>
                      {days} {days === 1 ? 'day' : 'days'}
                    </option>
                  ))}
                </select>
                <p className="form-help">Days of backup power without sun</p>
              </div>

              {/* Panel Wattage */}
              <div>
                <label className="form-label">Panel Wattage</label>
                <select
                  className="form-input"
                  value={configuration.panel_wattage}
                  onChange={(e) => onChange({ ...configuration, panel_wattage: parseInt(e.target.value) })}
                >
                  {panelWattages.map((wattage) => (
                    <option key={wattage} value={wattage}>
                      {wattage}W panels
                    </option>
                  ))}
                </select>
                <p className="form-help">Higher wattage = fewer panels needed</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calculate Button */}
      <div className="flex justify-center pt-6">
        <button
          onClick={handleCalculate}
          disabled={isCalculating}
          className="btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          {isCalculating ? (
            <>
              <div className="spinner mr-2" />
              Calculating...
            </>
          ) : (
            <>
              <CogIcon className="w-5 h-5 mr-2" />
              Calculate My Solar System
            </>
          )}
        </button>
      </div>
    </div>
  )
}