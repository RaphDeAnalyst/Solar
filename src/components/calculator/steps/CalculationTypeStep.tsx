'use client'

import { CpuChipIcon, RectangleStackIcon } from '@heroicons/react/24/outline'

interface CalculationTypeStepProps {
  value: 'full_system' | 'solar_generator'
  onChange: (value: 'full_system' | 'solar_generator') => void
  onNext: () => void
}

export function CalculationTypeStep({ value, onChange, onNext }: CalculationTypeStepProps) {
  const options = [
    {
      id: 'full_system',
      title: 'Full Solar System',
      description: 'Calculate inverter, battery, panels, and charge controller for a complete solar installation',
      icon: CpuChipIcon,
      features: [
        'Custom system sizing',
        'Component recommendations',
        'Installation requirements',
        'Long-term expandability'
      ],
      bestFor: 'Permanent home installations, high power needs, custom setups'
    },
    {
      id: 'solar_generator',
      title: 'Solar Generator',
      description: 'Find portable solar generators that match your power needs - plug and play solutions',
      icon: RectangleStackIcon,
      features: [
        'Portable and ready-to-use',
        'No installation required',
        'Compact all-in-one design',
        'Perfect for beginners'
      ],
      bestFor: 'Renters, small apartments, backup power, outdoor activities'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          What type of solar solution do you need?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose between a complete solar system installation or a portable solar generator
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {options.map((option) => (
          <div
            key={option.id}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
              value === option.id
                ? 'ring-2 ring-orange-500 border-orange-500 bg-orange-50'
                : 'hover:border-gray-300'
            }`}
            onClick={() => onChange(option.id as 'full_system' | 'solar_generator')}
          >
            <div className="card-body">
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-lg mr-4 ${
                  value === option.id ? 'bg-orange-100' : 'bg-gray-100'
                }`}>
                  <option.icon className={`w-8 h-8 ${
                    value === option.id ? 'text-orange-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {option.title}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {option.description}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">Features:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-900">Best for:</span> {option.bestFor}
                </p>
              </div>

              {value === option.id && (
                <div className="mt-4 flex items-center text-orange-600">
                  <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center mr-2">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <span className="text-sm font-medium">Selected</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNext}
          disabled={!value}
          className="btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue
        </button>
      </div>
    </div>
  )
}