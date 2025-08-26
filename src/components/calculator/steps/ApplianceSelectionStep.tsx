'use client'

import { useState, useEffect } from 'react'
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
import { DEFAULT_APPLIANCES, groupAppliancesByCategory } from '@/data/appliances'
import { UserAppliance } from '@/types'

interface ApplianceSelectionStepProps {
  inputMode: 'quick' | 'expert'
  appliances: UserAppliance[]
  onChange: (appliances: UserAppliance[]) => void
  onNext: () => void
}

export function ApplianceSelectionStep({ 
  inputMode, 
  appliances, 
  onChange, 
  onNext 
}: ApplianceSelectionStepProps) {
  const [selectedAppliances, setSelectedAppliances] = useState<UserAppliance[]>(appliances)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customAppliance, setCustomAppliance] = useState({
    name: '',
    watts: '',
    hours: '',
    quantity: '1'
  })

  // Group default appliances by category
  const appliancesByCategory = groupAppliancesByCategory(DEFAULT_APPLIANCES)

  useEffect(() => {
    onChange(selectedAppliances)
  }, [selectedAppliances, onChange])

  const addAppliance = (templateAppliance: any, quantity: number = 1, hours: number = 8) => {
    const newAppliance: UserAppliance = {
      id: `${templateAppliance.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      name: templateAppliance.name,
      watts: templateAppliance.watts,
      hours: hours,
      quantity: quantity,
      daily_consumption: templateAppliance.watts * hours * quantity
    }

    setSelectedAppliances(prev => [...prev, newAppliance])
  }

  const updateAppliance = (id: string, updates: Partial<UserAppliance>) => {
    setSelectedAppliances(prev =>
      prev.map(appliance =>
        appliance.id === id
          ? { 
              ...appliance, 
              ...updates, 
              daily_consumption: (updates.watts || appliance.watts) * 
                                 (updates.hours || appliance.hours) * 
                                 (updates.quantity || appliance.quantity)
            }
          : appliance
      )
    )
  }

  const removeAppliance = (id: string) => {
    setSelectedAppliances(prev => prev.filter(appliance => appliance.id !== id))
  }

  const addCustomAppliance = () => {
    if (!customAppliance.name || !customAppliance.watts || !customAppliance.hours) return

    const newAppliance: UserAppliance = {
      id: `custom_${customAppliance.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
      name: customAppliance.name,
      watts: parseInt(customAppliance.watts),
      hours: parseInt(customAppliance.hours),
      quantity: parseInt(customAppliance.quantity),
      daily_consumption: parseInt(customAppliance.watts) * parseInt(customAppliance.hours) * parseInt(customAppliance.quantity)
    }

    setSelectedAppliances(prev => [...prev, newAppliance])
    setCustomAppliance({ name: '', watts: '', hours: '', quantity: '1' })
    setShowCustomForm(false)
  }

  const getTotalDailyConsumption = () => {
    return selectedAppliances.reduce((total, appliance) => total + (appliance.daily_consumption || 0), 0)
  }

  const getTotalPeakLoad = () => {
    return selectedAppliances.reduce((total, appliance) => total + (appliance.watts * appliance.quantity), 0)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          Select Your Appliances
        </h2>
        <p className="text-lg text-gray-600">
          {inputMode === 'quick' 
            ? 'Choose from common Nigerian appliances and specify quantity and hours of use'
            : 'Customize appliances, add your own, or edit power ratings as needed'
          }
        </p>
      </div>

      {/* Summary Card */}
      {selectedAppliances.length > 0 && (
        <div className="card bg-orange-50 border-orange-200">
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-orange-600">{selectedAppliances.length}</p>
                <p className="text-sm text-gray-600">Appliances Selected</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{getTotalDailyConsumption().toLocaleString()}</p>
                <p className="text-sm text-gray-600">Wh/day Total</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">{getTotalPeakLoad().toLocaleString()}</p>
                <p className="text-sm text-gray-600">W Peak Load</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appliance Categories */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Available Appliances</h3>
            {inputMode === 'expert' && (
              <button
                onClick={() => setShowCustomForm(true)}
                className="btn-outline btn-sm"
              >
                <PlusIcon className="w-4 h-4 mr-1" />
                Add Custom
              </button>
            )}
          </div>

          {Object.entries(appliancesByCategory).map(([category, categoryAppliances]) => (
            <div key={category} className="card">
              <div className="card-header">
                <h4 className="font-medium text-gray-900">{category}</h4>
              </div>
              <div className="card-body space-y-2">
                {categoryAppliances.map((appliance) => (
                  <div
                    key={appliance.name}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{appliance.name}</p>
                      <p className="text-sm text-gray-500">{appliance.watts}W</p>
                    </div>
                    <button
                      onClick={() => addAppliance(appliance)}
                      className="btn-primary btn-sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Appliances */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Selected Appliances</h3>
          
          {selectedAppliances.length === 0 ? (
            <div className="card">
              <div className="card-body text-center py-8">
                <p className="text-gray-500">No appliances selected yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Choose appliances from the categories on the left
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedAppliances.map((appliance) => (
                <div key={appliance.id} className="card">
                  <div className="card-body">
                    {editingId === appliance.id ? (
                      <EditApplianceForm
                        appliance={appliance}
                        onSave={(updates) => {
                          updateAppliance(appliance.id, updates)
                          setEditingId(null)
                        }}
                        onCancel={() => setEditingId(null)}
                        allowWattsEdit={inputMode === 'expert'}
                      />
                    ) : (
                      <ViewApplianceCard
                        appliance={appliance}
                        onEdit={() => setEditingId(appliance.id)}
                        onRemove={() => removeAppliance(appliance.id)}
                        allowWattsEdit={inputMode === 'expert'}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Custom Appliance Form */}
          {showCustomForm && (
            <div className="card border-blue-200">
              <div className="card-header bg-blue-50">
                <h4 className="font-medium text-blue-900">Add Custom Appliance</h4>
              </div>
              <div className="card-body space-y-4">
                <div>
                  <label className="form-label">Appliance Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={customAppliance.name}
                    onChange={(e) => setCustomAppliance(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Gaming Console"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Power (Watts)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={customAppliance.watts}
                      onChange={(e) => setCustomAppliance(prev => ({ ...prev, watts: e.target.value }))}
                      placeholder="150"
                    />
                  </div>
                  <div>
                    <label className="form-label">Hours/Day</label>
                    <input
                      type="number"
                      className="form-input"
                      value={customAppliance.hours}
                      onChange={(e) => setCustomAppliance(prev => ({ ...prev, hours: e.target.value }))}
                      placeholder="4"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={addCustomAppliance}
                    className="btn-primary"
                  >
                    Add Appliance
                  </button>
                  <button
                    onClick={() => setShowCustomForm(false)}
                    className="btn-outline"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={onNext}
          disabled={selectedAppliances.length === 0}
          className="btn-primary btn-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to System Configuration
        </button>
      </div>
    </div>
  )
}

// Component for viewing appliance card
function ViewApplianceCard({ 
  appliance, 
  onEdit, 
  onRemove, 
  allowWattsEdit 
}: {
  appliance: UserAppliance
  onEdit: () => void
  onRemove: () => void
  allowWattsEdit: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-900">{appliance.name}</h4>
          <div className="flex gap-2">
            <button onClick={onEdit} className="p-1 text-gray-400 hover:text-blue-500">
              <PencilIcon className="w-4 h-4" />
            </button>
            <button onClick={onRemove} className="p-1 text-gray-400 hover:text-red-500">
              <TrashIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Power:</span>
            <span className="font-medium">{appliance.watts}W</span>
          </div>
          <div className="flex justify-between">
            <span>Hours/day:</span>
            <span className="font-medium">{appliance.hours}h</span>
          </div>
          <div className="flex justify-between">
            <span>Quantity:</span>
            <span className="font-medium">{appliance.quantity}</span>
          </div>
          <div className="flex justify-between font-medium text-orange-600 pt-1 border-t">
            <span>Daily consumption:</span>
            <span>{appliance.daily_consumption}Wh</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Component for editing appliance
function EditApplianceForm({ 
  appliance, 
  onSave, 
  onCancel, 
  allowWattsEdit 
}: {
  appliance: UserAppliance
  onSave: (updates: Partial<UserAppliance>) => void
  onCancel: () => void
  allowWattsEdit: boolean
}) {
  const [watts, setWatts] = useState(appliance.watts.toString())
  const [hours, setHours] = useState(appliance.hours.toString())
  const [quantity, setQuantity] = useState(appliance.quantity.toString())

  const handleSave = () => {
    onSave({
      watts: parseInt(watts),
      hours: parseInt(hours),
      quantity: parseInt(quantity)
    })
  }

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-900">{appliance.name}</h4>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="form-label">Power (W)</label>
          <input
            type="number"
            className="form-input"
            value={watts}
            onChange={(e) => setWatts(e.target.value)}
            disabled={!allowWattsEdit}
          />
        </div>
        <div>
          <label className="form-label">Hours/day</label>
          <input
            type="number"
            className="form-input"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Quantity</label>
          <input
            type="number"
            className="form-input"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
          />
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={handleSave} className="btn-primary btn-sm">
          Save
        </button>
        <button onClick={onCancel} className="btn-outline btn-sm">
          Cancel
        </button>
      </div>
    </div>
  )
}