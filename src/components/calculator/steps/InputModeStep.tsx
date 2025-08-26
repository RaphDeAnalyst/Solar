'use client'

import { UserIcon, WrenchScrewdriverIcon } from '@heroicons/react/24/outline'

interface InputModeStepProps {
  value: 'quick' | 'expert'
  onChange: (value: 'quick' | 'expert') => void
  calculationType: 'full_system' | 'solar_generator'
  onNext: () => void
}

export function InputModeStep({ value, onChange, calculationType, onNext }: InputModeStepProps) {
  const modes = [
    {
      id: 'quick',
      title: 'Quick Mode',
      subtitle: 'Recommended for most users',
      description: 'Select from a list of common Nigerian appliances with preset power ratings',
      icon: UserIcon,
      features: [
        'Pre-filled appliance list',
        'Nigerian-specific devices',
        'Quick and easy selection',
        'Perfect for beginners'
      ],
      timeEstimate: '2-3 minutes',
      difficulty: 'Easy'
    },
    {
      id: 'expert',
      title: 'Expert Mode',
      subtitle: 'For technical users',
      description: 'Start with preset list but customize wattages or add your own appliances',
      icon: WrenchScrewdriverIcon,
      features: [
        'Editable power ratings',
        'Add custom appliances',
        'Precise calculations',
        'Full customization'
      ],
      timeEstimate: '5-10 minutes',
      difficulty: 'Advanced'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          How would you like to input your appliances?
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {calculationType === 'full_system' 
            ? 'Choose the input method that matches your technical expertise'
            : 'Select how you want to specify your power requirements'
          }
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {modes.map((mode) => (
          <div
            key={mode.id}
            className={`card cursor-pointer transition-all duration-200 hover:shadow-lg ${
              value === mode.id
                ? 'ring-2 ring-orange-500 border-orange-500 bg-orange-50'
                : 'hover:border-gray-300'
            }`}
            onClick={() => onChange(mode.id as 'quick' | 'expert')}
          >
            <div className="card-body">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg mr-4 ${
                    value === mode.id ? 'bg-orange-100' : 'bg-gray-100'
                  }`}>
                    <mode.icon className={`w-8 h-8 ${
                      value === mode.id ? 'text-orange-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {mode.title}
                    </h3>
                    <p className="text-sm text-orange-600 font-medium">
                      {mode.subtitle}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end text-sm text-gray-500">
                  <span className="mb-1">{mode.timeEstimate}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    mode.difficulty === 'Easy' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {mode.difficulty}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">
                {mode.description}
              </p>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">What you get:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  {mode.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {value === mode.id && (
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

      {/* Quick Mode Preview */}
      {value === 'quick' && (
        <div className="card bg-green-50 border-green-200">
          <div className="card-body">
            <h4 className="font-medium text-green-900 mb-2">Quick Mode Preview</h4>
            <p className="text-green-700 text-sm mb-3">
              You'll see a list of common appliances like:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
              {['LED Bulbs (10W)', 'Ceiling Fan (60W)', 'TV (120W)', 'Fridge (150W)', 'AC (1500W)', 'Laptop (70W)', 'Phone Charger (7W)', 'And many more...'].map((item, index) => (
                <div key={index} className="text-green-600 bg-green-100 px-2 py-1 rounded">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Expert Mode Preview */}
      {value === 'expert' && (
        <div className="card bg-blue-50 border-blue-200">
          <div className="card-body">
            <h4 className="font-medium text-blue-900 mb-2">Expert Mode Preview</h4>
            <p className="text-blue-700 text-sm mb-3">
              You'll be able to:
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                Edit wattage values for any appliance
              </div>
              <div className="flex items-center text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                Add custom appliances with specific power ratings
              </div>
              <div className="flex items-center text-blue-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                Remove appliances you don't need
              </div>
            </div>
          </div>
        </div>
      )}

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