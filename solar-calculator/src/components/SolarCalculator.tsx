"use client";

import { useState } from "react";
import { Calculator, Zap, Plus, Trash2, MapPin, Settings, ChevronDown, X } from "lucide-react";
import CalculatorResults from "./CalculatorResults";

interface Appliance {
  id: string;
  name: string;
  watts: number;
  hoursPerDay: number;
  quantity: number;
  isEditable?: boolean;
}

interface DeviceTemplate {
  id: string;
  name: string;
  watts: number;
  defaultHours: number;
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

const DEVICE_TEMPLATES: DeviceTemplate[] = [
  { id: "led-light-10", name: "LED Light (10W)", watts: 10, defaultHours: 6 },
  { id: "led-bulb-20", name: "LED Bulb (20W)", watts: 20, defaultHours: 6 },
  { id: "ceiling-fan", name: "Ceiling Fan", watts: 70, defaultHours: 10 },
  { id: "standing-fan", name: "Standing Fan", watts: 100, defaultHours: 8 },
  { id: "tv-32", name: "32\" LED TV", watts: 100, defaultHours: 6 },
  { id: "tv-43", name: "43\" LED TV", watts: 150, defaultHours: 6 },
  { id: "tv-55", name: "55\" LED TV", watts: 200, defaultHours: 6 },
  { id: "laptop", name: "Laptop", watts: 65, defaultHours: 8 },
  { id: "desktop", name: "Desktop Computer", watts: 300, defaultHours: 8 },
  { id: "fridge-small", name: "Small Fridge", watts: 150, defaultHours: 24 },
  { id: "fridge-medium", name: "Medium Fridge", watts: 250, defaultHours: 24 },
  { id: "fridge-large", name: "Large Fridge", watts: 400, defaultHours: 24 },
  { id: "freezer", name: "Freezer", watts: 300, defaultHours: 24 },
  { id: "microwave", name: "Microwave", watts: 1000, defaultHours: 1 },
  { id: "blender", name: "Blender", watts: 400, defaultHours: 0.5 },
  { id: "iron", name: "Iron", watts: 1200, defaultHours: 1 },
  { id: "washing-machine", name: "Washing Machine", watts: 500, defaultHours: 2 },
  { id: "water-heater", name: "Water Heater", watts: 1500, defaultHours: 2 },
  { id: "ac-1hp", name: "1HP AC", watts: 1000, defaultHours: 8 },
  { id: "ac-1-5hp", name: "1.5HP AC", watts: 1500, defaultHours: 8 },
  { id: "ac-2hp", name: "2HP AC", watts: 2000, defaultHours: 8 },
  { id: "water-pump", name: "Water Pump", watts: 750, defaultHours: 2 }
];

const NIGERIAN_CITIES = [
  { name: "Lagos", sunHours: 4.5 },
  { name: "Abuja", sunHours: 5.2 },
  { name: "Kano", sunHours: 6.0 },
  { name: "Ibadan", sunHours: 4.8 },
  { name: "Port Harcourt", sunHours: 4.2 },
  { name: "Kaduna", sunHours: 5.5 },
  { name: "Benin City", sunHours: 4.6 },
  { name: "Maiduguri", sunHours: 6.2 },
  { name: "Jos", sunHours: 5.8 },
  { name: "Ilorin", sunHours: 5.0 }
];

// Default devices for Advanced mode
const DEFAULT_ADVANCED_DEVICES = [
  { templateId: "tv-43", quantity: 1, hours: 6 },
  { templateId: "fridge-medium", quantity: 1, hours: 24 },
  { templateId: "ceiling-fan", quantity: 2, hours: 10 }
];

export default function SolarCalculator() {
  const [calculatorMode, setCalculatorMode] = useState<'quick' | 'advanced' | 'detailed'>('quick');
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [selectedCity, setSelectedCity] = useState("Lagos");
  
  // Quick mode states
  const [quickModeDevices, setQuickModeDevices] = useState<{[key: string]: {quantity: number, hours: number}}>({});
  
  // Advanced mode states
  const [availableDevices, setAvailableDevices] = useState<DeviceTemplate[]>([]);
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  const [showCustomForm, setShowCustomForm] = useState(false);
  
  // Detailed mode states (bill input)
  const [monthlyBill, setMonthlyBill] = useState("");
  const [backupHours, setBackupHours] = useState("12");
  
  // Custom appliance state
  const [customAppliance, setCustomAppliance] = useState({
    name: "",
    watts: "",
    hoursPerDay: "",
    quantity: "1"
  });
  
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Initialize advanced mode with default devices
  const initializeAdvancedMode = () => {
    const defaultAppliances: Appliance[] = [];
    const remainingDevices = [...DEVICE_TEMPLATES];
    
    DEFAULT_ADVANCED_DEVICES.forEach(defaultDevice => {
      const template = DEVICE_TEMPLATES.find(t => t.id === defaultDevice.templateId);
      if (template) {
        defaultAppliances.push({
          id: Date.now().toString() + Math.random(),
          name: template.name,
          watts: template.watts,
          hoursPerDay: defaultDevice.hours,
          quantity: defaultDevice.quantity,
          isEditable: true
        });
        
        // Remove from available devices
        const index = remainingDevices.findIndex(d => d.id === template.id);
        if (index > -1) remainingDevices.splice(index, 1);
      }
    });
    
    setAppliances(defaultAppliances);
    setAvailableDevices(remainingDevices);
  };

  // Handle mode changes
  const handleModeChange = (mode: 'quick' | 'advanced' | 'detailed') => {
    setCalculatorMode(mode);
    setAppliances([]);
    setQuickModeDevices({});
    setShowResults(false);
    
    if (mode === 'advanced') {
      initializeAdvancedMode();
    } else if (mode === 'quick') {
      setAvailableDevices([...DEVICE_TEMPLATES]);
    }
  };

  // Quick mode functions
  const updateQuickModeDevice = (deviceId: string, quantity: number, hours: number) => {
    setQuickModeDevices(prev => ({
      ...prev,
      [deviceId]: { quantity, hours }
    }));
  };

  const calculateFromQuickMode = () => {
    const activeDevices = Object.entries(quickModeDevices).filter(([_, config]) => config.quantity > 0);
    if (activeDevices.length === 0) return;

    const cityData = NIGERIAN_CITIES.find(city => city.name === selectedCity) || NIGERIAN_CITIES[0];
    
    const dailyLoadWh = activeDevices.reduce((total, [deviceId, config]) => {
      const template = DEVICE_TEMPLATES.find(t => t.id === deviceId);
      if (template) {
        return total + (template.watts * config.hours * config.quantity);
      }
      return total;
    }, 0);

    return performCalculation(dailyLoadWh, cityData);
  };

  // Advanced mode functions
  const addDeviceFromTemplate = (template: DeviceTemplate) => {
    const newAppliance: Appliance = {
      id: Date.now().toString() + Math.random(),
      name: template.name,
      watts: template.watts,
      hoursPerDay: template.defaultHours,
      quantity: 1,
      isEditable: true
    };
    
    setAppliances([...appliances, newAppliance]);
    setAvailableDevices(availableDevices.filter(d => d.id !== template.id));
    setShowDeviceDropdown(false);
  };

  const addCustomAppliance = () => {
    if (customAppliance.name && customAppliance.watts && customAppliance.hoursPerDay) {
      const newAppliance: Appliance = {
        id: Date.now().toString(),
        name: customAppliance.name,
        watts: Number(customAppliance.watts),
        hoursPerDay: Number(customAppliance.hoursPerDay),
        quantity: Number(customAppliance.quantity),
        isEditable: true
      };
      setAppliances([...appliances, newAppliance]);
      setCustomAppliance({ name: "", watts: "", hoursPerDay: "", quantity: "1" });
      setShowCustomForm(false);
    }
  };

  const removeAppliance = (id: string) => {
    const appliance = appliances.find(app => app.id === id);
    if (appliance) {
      // If it's a template device, add it back to available devices
      const template = DEVICE_TEMPLATES.find(t => t.name === appliance.name && t.watts === appliance.watts);
      if (template) {
        setAvailableDevices([...availableDevices, template]);
      }
    }
    setAppliances(appliances.filter(app => app.id !== id));
  };

  const updateAppliance = (id: string, field: string, value: number) => {
    setAppliances(appliances.map(app => 
      app.id === id ? { ...app, [field]: value } : app
    ));
  };

  const calculateFromAdvanced = () => {
    if (appliances.length === 0) return;

    const cityData = NIGERIAN_CITIES.find(city => city.name === selectedCity) || NIGERIAN_CITIES[0];
    
    const dailyLoadWh = appliances.reduce((total, app) => {
      return total + (app.watts * app.hoursPerDay * app.quantity);
    }, 0);

    return performCalculation(dailyLoadWh, cityData);
  };

  const calculateFromBill = () => {
    if (!monthlyBill) return;

    const cityData = NIGERIAN_CITIES.find(city => city.name === selectedCity) || NIGERIAN_CITIES[0];
    
    // Estimate daily consumption from monthly bill
    // Assuming ₦50 per kWh (average Nigerian rate)
    const monthlyKwh = Number(monthlyBill) / 50;
    const dailyKwh = monthlyKwh / 30;
    const dailyLoadWh = dailyKwh * 1000;

    return performCalculation(dailyLoadWh, cityData);
  };

  const performCalculation = (dailyLoadWh: number, cityData: typeof NIGERIAN_CITIES[0]) => {
    // Add 20% inefficiency factor
    const adjustedDailyLoad = dailyLoadWh * 1.2;
    
    // Inverter size (assume peak load is 30% of daily load minimum)
    const estimatedPeakLoad = Math.max(dailyLoadWh * 0.3, 500); // Minimum 500W
    const inverterSizeW = Math.ceil(estimatedPeakLoad * 1.25 / 100) * 100;
    
    // Battery capacity (based on backup hours for detailed mode, 2 days for simple mode)
    const backupDays = calculatorMode === 'appliances' ? Number(backupHours) / 24 : 2;
    const batteryCapacityWh = adjustedDailyLoad * backupDays;
    const batteryCapacityAh = Math.ceil(batteryCapacityWh / 12); // Assuming 12V system
    
    // Solar panels (daily load / sun hours + 20% margin)
    const solarPanelsW = Math.ceil(adjustedDailyLoad / cityData.sunHours * 1.2);
    const numberOfPanels = Math.ceil(solarPanelsW / 400); // Assuming 400W panels
    
    // Charge controller (panels wattage / voltage + 25% margin)
    const chargeControllerA = Math.ceil(solarPanelsW / 12 * 1.25);

    // Cost estimation (Nigerian market prices)
    const costPerWh = 0.8; // ₦0.8 per Wh capacity
    const baseCost = batteryCapacityWh * costPerWh;
    const costEstimate = {
      min: Math.ceil(baseCost * 0.8 / 1000) * 1000,
      max: Math.ceil(baseCost * 1.3 / 1000) * 1000
    };

    // Bundle recommendation
    let recommendedBundle = "Starter Kit";
    if (dailyLoadWh > 800 && dailyLoadWh <= 1800) {
      recommendedBundle = "Basic Home Kit";
    } else if (dailyLoadWh > 1800 && dailyLoadWh <= 4000) {
      recommendedBundle = "Comfort Home Kit";
    } else if (dailyLoadWh > 4000) {
      recommendedBundle = "Premium Home Kit";
    }

    const calculationResults: CalculationResults = {
      dailyLoadWh,
      inverterSizeW,
      batteryCapacityWh,
      batteryCapacityAh,
      solarPanelsW,
      numberOfPanels,
      chargeControllerA,
      costEstimate,
      recommendedBundle,
      city: selectedCity,
      sunHours: cityData.sunHours
    };

    setResults(calculationResults);
    setShowResults(true);
  };

  const handleCalculate = () => {
    if (calculatorMode === 'quick') {
      calculateFromQuickMode();
    } else if (calculatorMode === 'advanced') {
      calculateFromAdvanced();
    } else {
      calculateFromBill();
    }
  };

  if (showResults && results) {
    return (
      <CalculatorResults 
        results={results} 
        appliances={appliances}
        onRecalculate={() => setShowResults(false)}
      />
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      {/* Mode Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Calculator Mode</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <button
            onClick={() => handleModeChange('quick')}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              calculatorMode === 'quick'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <Zap className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold text-gray-900">Quick Mode</span>
            </div>
            <p className="text-xs text-gray-600">
              Select devices with fixed wattage, adjust only quantity and hours
            </p>
          </button>

          <button
            onClick={() => handleModeChange('advanced')}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              calculatorMode === 'advanced'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <Settings className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold text-gray-900">Advanced Mode</span>
            </div>
            <p className="text-xs text-gray-600">
              Full control - edit wattage, add devices from list or create custom ones
            </p>
          </button>

          <button
            onClick={() => handleModeChange('detailed')}
            className={`p-4 rounded-lg border-2 text-left transition-colors ${
              calculatorMode === 'detailed'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <div className="flex items-center mb-2">
              <Calculator className="w-5 h-5 text-green-600 mr-2" />
              <span className="font-semibold text-gray-900">Detailed Mode</span>
            </div>
            <p className="text-xs text-gray-600">
              Enter your monthly electricity bill for estimate based on consumption data
            </p>
          </button>
        </div>
      </div>

      {/* City Selection */}
      <div className="mb-8">
        <label className="block text-lg font-semibold text-gray-900 mb-4">
          <MapPin className="w-5 h-5 inline mr-2" />
          Select Your City
        </label>
        <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        >
          {NIGERIAN_CITIES.map(city => (
            <option key={city.name} value={city.name}>
              {city.name} ({city.sunHours} peak sun hours)
            </option>
          ))}
        </select>
      </div>

      {/* Quick Mode */}
      {calculatorMode === 'quick' && (
        <div className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-2">Quick Mode</h3>
            <p className="text-green-700 text-sm mb-4">
              Select devices and adjust quantity + hours. Wattage values are fixed for accuracy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DEVICE_TEMPLATES.map((device) => {
              const currentConfig = quickModeDevices[device.id] || { quantity: 0, hours: device.defaultHours };
              
              return (
                <div key={device.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-medium text-gray-900 text-sm">{device.name}</span>
                    <span className="text-sm text-gray-500 font-semibold">{device.watts}W</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                      <select
                        value={currentConfig.quantity}
                        onChange={(e) => updateQuickModeDevice(device.id, Number(e.target.value), currentConfig.hours)}
                        className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-green-500 focus:border-green-500"
                      >
                        <option value={0}>0 (Not using)</option>
                        {[1,2,3,4,5,6,7,8,9,10].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </div>
                    
                    {currentConfig.quantity > 0 && (
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Hours per day</label>
                        <input
                          type="number"
                          min="0.5"
                          max="24"
                          step="0.5"
                          value={currentConfig.hours}
                          onChange={(e) => updateQuickModeDevice(device.id, currentConfig.quantity, Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                    )}
                  </div>
                  
                  {currentConfig.quantity > 0 && (
                    <div className="mt-3 text-xs text-green-600 font-medium">
                      Daily: {(device.watts * currentConfig.quantity * currentConfig.hours).toLocaleString()} Wh
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Quick Mode Summary */}
          {Object.values(quickModeDevices).some(config => config.quantity > 0) && (
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-lg font-semibold text-green-800">
                Total Daily Load: {Object.entries(quickModeDevices).reduce((total, [deviceId, config]) => {
                  if (config.quantity > 0) {
                    const device = DEVICE_TEMPLATES.find(d => d.id === deviceId);
                    return total + (device ? device.watts * config.quantity * config.hours : 0);
                  }
                  return total;
                }, 0).toLocaleString()} Wh
              </div>
            </div>
          )}
        </div>
      )}

      {/* Advanced Mode */}
      {calculatorMode === 'advanced' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Advanced Mode</h3>
            <p className="text-blue-700 text-sm mb-4">
              Full control over all parameters. Pre-populated with common devices - edit, remove, or add more.
            </p>
          </div>

          {/* Current Appliances */}
          {appliances.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Appliances</h3>
              <div className="space-y-3">
                {appliances.map((appliance) => (
                  <div key={appliance.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div className="md:col-span-1">
                        <span className="font-medium text-gray-900">{appliance.name}</span>
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Watts</label>
                        <input
                          type="number"
                          value={appliance.watts}
                          onChange={(e) => updateAppliance(appliance.id, 'watts', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Hours/day</label>
                        <input
                          type="number"
                          min="0.5"
                          max="24"
                          step="0.5"
                          value={appliance.hoursPerDay}
                          onChange={(e) => updateAppliance(appliance.id, 'hoursPerDay', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                        <input
                          type="number"
                          min="1"
                          value={appliance.quantity}
                          onChange={(e) => updateAppliance(appliance.id, 'quantity', Number(e.target.value))}
                          className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-green-500 focus:border-green-500"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900">
                          {(appliance.watts * appliance.hoursPerDay * appliance.quantity).toLocaleString()}Wh
                        </span>
                        <button
                          onClick={() => removeAppliance(appliance.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="text-lg font-semibold text-green-800">
                    Total Daily Load: {appliances.reduce((total, app) => total + (app.watts * app.hoursPerDay * app.quantity), 0).toLocaleString()} Wh
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Add Device Buttons */}
          <div className="flex gap-4">
            {availableDevices.length > 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowDeviceDropdown(!showDeviceDropdown)}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Device
                  <ChevronDown className="w-4 h-4 ml-2" />
                </button>
                
                {showDeviceDropdown && (
                  <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                    {availableDevices.map((device) => (
                      <button
                        key={device.id}
                        onClick={() => addDeviceFromTemplate(device)}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">{device.name}</div>
                        <div className="text-sm text-gray-500">{device.watts}W</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setShowCustomForm(!showCustomForm)}
              className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Custom Device
            </button>
          </div>

          {/* Custom Device Form */}
          {showCustomForm && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Add Custom Device</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Device name"
                  value={customAppliance.name}
                  onChange={(e) => setCustomAppliance({...customAppliance, name: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="number"
                  placeholder="Power (Watts)"
                  value={customAppliance.watts}
                  onChange={(e) => setCustomAppliance({...customAppliance, watts: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="number"
                  placeholder="Hours per day"
                  value={customAppliance.hoursPerDay}
                  onChange={(e) => setCustomAppliance({...customAppliance, hoursPerDay: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={customAppliance.quantity}
                  onChange={(e) => setCustomAppliance({...customAppliance, quantity: e.target.value})}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={addCustomAppliance}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Device
                </button>
                <button
                  onClick={() => setShowCustomForm(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detailed Mode - Bill Input */}
      {calculatorMode === 'detailed' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Detailed Estimate Mode</h3>
            <p className="text-blue-700 mb-6">
              Enter your monthly electricity bill to get a detailed solar system estimate. 
              This mode uses your actual consumption data for more accurate sizing.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Monthly Electricity Bill (₦)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 15000"
                  value={monthlyBill}
                  onChange={(e) => setMonthlyBill(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                />
                <p className="text-sm text-blue-600 mt-1">
                  Enter your average monthly PHCN bill
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-900 mb-2">
                  Desired Backup Hours
                </label>
                <select
                  value={backupHours}
                  onChange={(e) => setBackupHours(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                >
                  <option value="6">6 hours</option>
                  <option value="12">12 hours (half day)</option>
                  <option value="24">24 hours (full day)</option>
                  <option value="48">48 hours (2 days)</option>
                </select>
                <p className="text-sm text-blue-600 mt-1">
                  How long do you want backup power?
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Calculate Button */}
      <div className="mt-8 text-center">
        {((calculatorMode === 'quick' && Object.values(quickModeDevices).some(config => config.quantity > 0)) || 
          (calculatorMode === 'advanced' && appliances.length > 0) ||
          (calculatorMode === 'detailed' && monthlyBill)) && (
          <button
            onClick={handleCalculate}
            className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center mx-auto"
          >
            <Calculator className="w-6 h-6 mr-2" />
            Calculate Solar System
          </button>
        )}
        
        {calculatorMode === 'quick' && !Object.values(quickModeDevices).some(config => config.quantity > 0) && (
          <p className="text-gray-500">Select some devices and set quantities to get started</p>
        )}
        
        {calculatorMode === 'advanced' && appliances.length === 0 && (
          <p className="text-gray-500">Your pre-populated devices are ready - adjust them or add more</p>
        )}
        
        {calculatorMode === 'detailed' && !monthlyBill && (
          <p className="text-gray-500">Enter your monthly electricity bill to calculate</p>
        )}
      </div>
    </div>
  );
}