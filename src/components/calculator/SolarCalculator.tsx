'use client'

import { useState, useEffect } from 'react'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { SystemConfiguration } from '@/types'
import { CalculationTypeStep } from './steps/CalculationTypeStep'
import { InputModeStep } from './steps/InputModeStep'
import { ApplianceSelectionStep } from './steps/ApplianceSelectionStep'
import { SystemConfigurationStep } from './steps/SystemConfigurationStep'
import { CalculationResultsStep } from './steps/CalculationResultsStep'

interface SolarCalculatorProps {
  onBack: () => void
}

type CalculatorStep = 
  | 'calculation_type'
  | 'input_mode'
  | 'appliance_selection'
  | 'system_configuration'
  | 'results'

export function SolarCalculator({ onBack }: SolarCalculatorProps) {
  const [currentStep, setCurrentStep] = useState<CalculatorStep>('calculation_type')
  const [calculationType, setCalculationType] = useState<'full_system' | 'solar_generator'>('full_system')
  const [inputMode, setInputMode] = useState<'quick' | 'expert'>('quick')
  const [appliances, setAppliances] = useState<any[]>([])
  const [systemConfig, setSystemConfig] = useState<SystemConfiguration>({
    location: 'lagos',
    battery_type: 'lead_acid',
    system_voltage: 12,
    autonomy_days: 1,
    panel_wattage: 400,
    calculation_type: 'full_system',
    input_mode: 'quick'
  })
  const [calculationResults, setCalculationResults] = useState<any>(null)

  // Update system config when calculation type or input mode changes
  useEffect(() => {
    setSystemConfig(prev => ({
      ...prev,
      calculation_type: calculationType,
      input_mode: inputMode
    }))
  }, [calculationType, inputMode])

  const handleNext = () => {
    switch (currentStep) {
      case 'calculation_type':
        setCurrentStep('input_mode')
        break
      case 'input_mode':
        setCurrentStep('appliance_selection')
        break
      case 'appliance_selection':
        setCurrentStep('system_configuration')
        break
      case 'system_configuration':
        setCurrentStep('results')
        break
    }
  }

  const handleBack = () => {
    switch (currentStep) {
      case 'input_mode':
        setCurrentStep('calculation_type')
        break
      case 'appliance_selection':
        setCurrentStep('input_mode')
        break
      case 'system_configuration':
        setCurrentStep('appliance_selection')
        break
      case 'results':
        setCurrentStep('system_configuration')
        break
      default:
        onBack()
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 'calculation_type':
        return 'Choose Calculation Type'
      case 'input_mode':
        return 'Select Input Mode'
      case 'appliance_selection':
        return 'Select Your Appliances'
      case 'system_configuration':
        return 'System Configuration'
      case 'results':
        return 'Your Solar System Results'
      default:
        return 'Solar Calculator'
    }
  }

  const getStepNumber = () => {
    switch (currentStep) {
      case 'calculation_type': return 1
      case 'input_mode': return 2
      case 'appliance_selection': return 3
      case 'system_configuration': return 4
      case 'results': return 5
      default: return 1
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  {getStepTitle()}
                </h1>
                <p className="text-sm text-gray-500">
                  Step {getStepNumber()} of 5
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>Progress</span>
              <span>{getStepNumber()}/5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(getStepNumber() / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentStep === 'calculation_type' && (
          <CalculationTypeStep
            value={calculationType}
            onChange={setCalculationType}
            onNext={handleNext}
          />
        )}

        {currentStep === 'input_mode' && (
          <InputModeStep
            value={inputMode}
            onChange={setInputMode}
            calculationType={calculationType}
            onNext={handleNext}
          />
        )}

        {currentStep === 'appliance_selection' && (
          <ApplianceSelectionStep
            inputMode={inputMode}
            appliances={appliances}
            onChange={setAppliances}
            onNext={handleNext}
          />
        )}

        {currentStep === 'system_configuration' && (
          <SystemConfigurationStep
            configuration={systemConfig}
            onChange={setSystemConfig}
            calculationType={calculationType}
            appliances={appliances}
            onNext={handleNext}
            onCalculate={setCalculationResults}
          />
        )}

        {currentStep === 'results' && (
          <CalculationResultsStep
            calculationType={calculationType}
            appliances={appliances}
            systemConfig={systemConfig}
            results={calculationResults}
          />
        )}
      </main>

      {/* Mobile spacing for bottom navigation */}
      <div className="h-20 md:h-0" />
    </div>
  )
}