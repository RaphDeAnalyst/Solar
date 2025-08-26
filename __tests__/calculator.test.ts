import { SolarCalculator, calculateSolarSystem, calculateGeneratorComparison } from '@/lib/calculator'
import { UserAppliance, SystemConfiguration } from '@/types'

describe('Solar Calculator', () => {
  const mockAppliances: UserAppliance[] = [
    {
      id: '1',
      name: 'LED Bulb',
      watts: 10,
      hours: 6,
      quantity: 5,
      daily_consumption: 300
    },
    {
      id: '2', 
      name: 'Ceiling Fan',
      watts: 60,
      hours: 8,
      quantity: 2,
      daily_consumption: 960
    },
    {
      id: '3',
      name: 'TV',
      watts: 120,
      hours: 4,
      quantity: 1,
      daily_consumption: 480
    }
  ]

  const mockConfig: SystemConfiguration = {
    location: 'lagos',
    battery_type: 'lead_acid',
    system_voltage: 12,
    autonomy_days: 1,
    panel_wattage: 400,
    calculation_type: 'full_system',
    input_mode: 'quick'
  }

  describe('Basic Calculations', () => {
    let calculator: SolarCalculator

    beforeEach(() => {
      calculator = new SolarCalculator(mockAppliances, mockConfig)
    })

    test('calculates daily load correctly', () => {
      const dailyLoad = calculator.calculateDailyLoad()
      expect(dailyLoad).toBe(1740) // 300 + 960 + 480
    })

    test('calculates peak load correctly', () => {
      const peakLoad = calculator.calculatePeakLoad()
      expect(peakLoad).toBe(250) // (10*5) + (60*2) + (120*1)
    })

    test('calculates inverter size with safety margin', () => {
      const peakLoad = 250
      const inverterSize = calculator.calculateInverterSize(peakLoad)
      expect(inverterSize).toBeGreaterThanOrEqual(peakLoad * 1.25)
    })

    test('calculates battery requirements', () => {
      const dailyLoad = 1740
      const battery = calculator.calculateBatteryRequirements(dailyLoad)
      
      expect(battery.batteryWh).toBeGreaterThan(0)
      expect(battery.batteryAh).toBeGreaterThan(0)
      expect(battery.batteryCount).toBeGreaterThanOrEqual(1)
    })

    test('calculates solar panel requirements', () => {
      const dailyLoad = 1740
      const solar = calculator.calculateSolarPanels(dailyLoad)
      
      expect(solar.pvArrayW).toBeGreaterThan(0)
      expect(solar.panelCount).toBeGreaterThanOrEqual(1)
    })

    test('calculates charge controller requirements', () => {
      const pvArrayW = 1000
      const controllerAmperage = calculator.calculateChargeController(pvArrayW)
      
      expect(controllerAmperage).toBeGreaterThan(0)
    })
  })

  describe('Full System Calculation', () => {
    test('performs complete system calculation', () => {
      const results = calculateSolarSystem(mockAppliances, mockConfig)
      
      expect(results.daily_load_wh).toBe(1740)
      expect(results.peak_load_w).toBe(250)
      expect(results.inverter_size_w).toBeGreaterThan(0)
      expect(results.battery_wh).toBeGreaterThan(0)
      expect(results.battery_ah).toBeGreaterThan(0)
      expect(results.battery_count).toBeGreaterThanOrEqual(1)
      expect(results.pv_array_w).toBeGreaterThan(0)
      expect(results.panel_count).toBeGreaterThanOrEqual(1)
      expect(results.charge_controller_a).toBeGreaterThan(0)
      expect(results.system_voltage).toBe(12)
    })

    test('calculates different results for different configurations', () => {
      const config24V = { ...mockConfig, system_voltage: 24 as const }
      const config48V = { ...mockConfig, system_voltage: 48 as const }
      
      const results12V = calculateSolarSystem(mockAppliances, mockConfig)
      const results24V = calculateSolarSystem(mockAppliances, config24V)
      const results48V = calculateSolarSystem(mockAppliances, config48V)
      
      // Higher voltage should require fewer batteries for same capacity
      expect(results48V.battery_ah).toBeLessThan(results24V.battery_ah)
      expect(results24V.battery_ah).toBeLessThan(results12V.battery_ah)
    })

    test('calculates different results for different battery types', () => {
      const leadAcidConfig = { ...mockConfig, battery_type: 'lead_acid' as const }
      const lithiumConfig = { ...mockConfig, battery_type: 'lifepo4' as const }
      
      const leadAcidResults = calculateSolarSystem(mockAppliances, leadAcidConfig)
      const lithiumResults = calculateSolarSystem(mockAppliances, lithiumConfig)
      
      // Lithium has higher DoD, so should need less battery capacity
      expect(lithiumResults.battery_ah).toBeLessThan(leadAcidResults.battery_ah)
    })

    test('calculates different results for different locations', () => {
      const lagosConfig = { ...mockConfig, location: 'lagos' }
      const kanoConfig = { ...mockConfig, location: 'kano' }
      
      const lagosResults = calculateSolarSystem(mockAppliances, lagosConfig)
      const kanoResults = calculateSolarSystem(mockAppliances, kanoConfig)
      
      // Kano has more sun hours, so should need fewer panels
      expect(kanoResults.panel_count).toBeLessThanOrEqual(lagosResults.panel_count)
    })
  })

  describe('Generator Comparison', () => {
    test('calculates generator fuel costs correctly', () => {
      const dailyLoadWh = 1740
      const petrolPrice = 950
      
      const comparison = calculateGeneratorComparison(dailyLoadWh, petrolPrice)
      
      expect(comparison.daily_fuel_consumption_l).toBeGreaterThan(0)
      expect(comparison.monthly_fuel_cost).toBeGreaterThan(0)
      expect(comparison.annual_fuel_cost).toBe(comparison.monthly_fuel_cost * 12)
      expect(comparison.monthly_savings).toBe(comparison.monthly_fuel_cost)
    })

    test('calculates payback period when system cost provided', () => {
      const dailyLoadWh = 1740
      const systemCostMin = 500000
      const systemCostMax = 800000
      
      const comparison = calculateGeneratorComparison(
        dailyLoadWh, 950, systemCostMin, systemCostMax
      )
      
      expect(comparison.solar_payback_months).toBeGreaterThan(0)
    })
  })

  describe('System Validation', () => {
    test('validates system configuration', () => {
      const calculator = new SolarCalculator(mockAppliances, mockConfig)
      const results = calculator.calculate()
      const validation = calculator.validateSystem(results)
      
      expect(validation).toHaveProperty('isValid')
      expect(validation).toHaveProperty('warnings')
      expect(validation).toHaveProperty('recommendations')
      expect(Array.isArray(validation.warnings)).toBe(true)
      expect(Array.isArray(validation.recommendations)).toBe(true)
    })

    test('warns about high peak to average load ratio', () => {
      const highPeakAppliances: UserAppliance[] = [
        {
          id: '1',
          name: 'High Peak Load',
          watts: 3000,
          hours: 1, // Very short usage
          quantity: 1,
          daily_consumption: 3000
        }
      ]
      
      const calculator = new SolarCalculator(highPeakAppliances, mockConfig)
      const results = calculator.calculate()
      const validation = calculator.validateSystem(results)
      
      expect(validation.warnings.length).toBeGreaterThan(0)
      expect(validation.warnings[0]).toContain('peak load is very high')
    })
  })

  describe('Edge Cases', () => {
    test('handles empty appliance list', () => {
      const calculator = new SolarCalculator([], mockConfig)
      const results = calculator.calculate()
      
      expect(results.daily_load_wh).toBe(0)
      expect(results.peak_load_w).toBe(0)
    })

    test('handles very small loads', () => {
      const smallAppliances: UserAppliance[] = [
        {
          id: '1',
          name: 'Phone Charger',
          watts: 5,
          hours: 2,
          quantity: 1,
          daily_consumption: 10
        }
      ]
      
      const calculator = new SolarCalculator(smallAppliances, mockConfig)
      const results = calculator.calculate()
      
      expect(results.daily_load_wh).toBe(10)
      expect(results.inverter_size_w).toBeGreaterThanOrEqual(300) // Minimum inverter size
    })

    test('handles very large loads', () => {
      const largeAppliances: UserAppliance[] = [
        {
          id: '1',
          name: 'Large AC System',
          watts: 5000,
          hours: 12,
          quantity: 3,
          daily_consumption: 180000
        }
      ]
      
      const calculator = new SolarCalculator(largeAppliances, mockConfig)
      const results = calculator.calculate()
      
      expect(results.daily_load_wh).toBe(180000)
      expect(results.panel_count).toBeGreaterThan(100) // Should need many panels
    })
  })

  describe('Solar Generator Calculations', () => {
    test('calculates solar generator recharge time', () => {
      const calculator = new SolarCalculator([], mockConfig)
      
      const rechargeTime = calculator.calculateSolarGeneratorRechargeTime(
        1000, // 1000Wh battery
        200,  // 200W solar input
        'lagos'
      )
      
      expect(rechargeTime).toBeGreaterThan(0)
      expect(rechargeTime).toBeLessThan(24) // Should recharge within a day
    })
  })
})