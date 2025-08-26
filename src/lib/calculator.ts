import { UserAppliance, SystemConfiguration, CalculationResults, GeneratorComparison } from '@/types'

// Constants
const PEAK_SUN_HOURS = {
  lagos: 4.5,
  abuja: 5.5,
  kano: 6.0,
  ph: 4.8,
  default: 5.0
} as const

const BATTERY_DOD = {
  lead_acid: 0.5,
  lifepo4: 0.8
} as const

const INVERTER_EFFICIENCY = 0.9
const SYSTEM_LOSS_FACTOR = 0.75
const GENERATOR_EFFICIENCY = 2.5 // kWh per liter
const DEFAULT_PETROL_PRICE = 950 // Naira per liter

export class SolarCalculator {
  private appliances: UserAppliance[]
  private configuration: SystemConfiguration

  constructor(appliances: UserAppliance[], configuration: SystemConfiguration) {
    this.appliances = appliances
    this.configuration = configuration
  }

  /**
   * Calculate total daily energy consumption
   */
  calculateDailyLoad(): number {
    return this.appliances.reduce((total, appliance) => {
      return total + (appliance.watts * appliance.hours * appliance.quantity)
    }, 0)
  }

  /**
   * Calculate peak power demand (maximum simultaneous load)
   */
  calculatePeakLoad(): number {
    // For now, assume all appliances can run simultaneously
    // In a more sophisticated version, we could ask users which appliances run together
    return this.appliances.reduce((total, appliance) => {
      return total + (appliance.watts * appliance.quantity)
    }, 0)
  }

  /**
   * Calculate inverter size with safety margin
   */
  calculateInverterSize(peakLoadW: number): number {
    const inverterSize = peakLoadW * 1.25 // 25% safety margin
    
    // Round up to nearest standard inverter size
    const standardSizes = [300, 500, 800, 1000, 1500, 2000, 3000, 5000, 7500, 10000, 15000, 20000]
    
    for (const size of standardSizes) {
      if (size >= inverterSize) {
        return size
      }
    }
    
    return Math.ceil(inverterSize / 1000) * 1000
  }

  /**
   * Calculate battery requirements
   */
  calculateBatteryRequirements(dailyLoadWh: number): {
    batteryWh: number
    batteryAh: number
    batteryCount: number
  } {
    const { autonomy_days, battery_type, system_voltage } = this.configuration
    const dod = BATTERY_DOD[battery_type]
    
    // Calculate required battery energy
    const batteryWh = (dailyLoadWh * autonomy_days) / INVERTER_EFFICIENCY
    
    // Calculate required battery capacity in Ah
    const batteryAh = batteryWh / (system_voltage * dod)
    
    // Calculate number of batteries needed (assuming standard 200Ah batteries)
    const standardBatteryAh = 200
    const batteryCount = Math.ceil(batteryAh / standardBatteryAh)
    
    return {
      batteryWh,
      batteryAh,
      batteryCount
    }
  }

  /**
   * Calculate solar panel requirements
   */
  calculateSolarPanels(dailyLoadWh: number): {
    pvArrayW: number
    panelCount: number
  } {
    const { location, panel_wattage } = this.configuration
    const psh = PEAK_SUN_HOURS[location as keyof typeof PEAK_SUN_HOURS] || PEAK_SUN_HOURS.default
    
    // Calculate required PV array size
    const pvArrayW = dailyLoadWh / (psh * SYSTEM_LOSS_FACTOR)
    
    // Calculate number of panels needed
    const panelCount = Math.ceil(pvArrayW / panel_wattage)
    
    return {
      pvArrayW,
      panelCount
    }
  }

  /**
   * Calculate charge controller requirements
   */
  calculateChargeController(pvArrayW: number): number {
    const { system_voltage } = this.configuration
    const controllerCurrent = (pvArrayW / system_voltage) * 1.25 // 25% safety margin
    
    // Round up to nearest standard MPPT controller size
    const standardSizes = [30, 40, 50, 60, 80, 100, 120, 150, 200]
    
    for (const size of standardSizes) {
      if (size >= controllerCurrent) {
        return size
      }
    }
    
    return Math.ceil(controllerCurrent / 10) * 10
  }

  /**
   * Perform complete system calculation
   */
  calculate(): CalculationResults {
    const dailyLoadWh = this.calculateDailyLoad()
    const peakLoadW = this.calculatePeakLoad()
    const inverterSizeW = this.calculateInverterSize(peakLoadW)
    
    const battery = this.calculateBatteryRequirements(dailyLoadWh)
    const solar = this.calculateSolarPanels(dailyLoadWh)
    const chargeControllerA = this.calculateChargeController(solar.pvArrayW)
    
    return {
      daily_load_wh: Math.round(dailyLoadWh),
      peak_load_w: Math.round(peakLoadW),
      inverter_size_w: inverterSizeW,
      battery_wh: Math.round(battery.batteryWh),
      battery_ah: Math.round(battery.batteryAh),
      battery_count: battery.batteryCount,
      pv_array_w: Math.round(solar.pvArrayW),
      panel_count: solar.panelCount,
      charge_controller_a: chargeControllerA,
      system_voltage: this.configuration.system_voltage
    }
  }

  /**
   * Calculate generator fuel costs for comparison
   */
  calculateGeneratorComparison(
    dailyLoadWh: number, 
    petrolPrice: number = DEFAULT_PETROL_PRICE,
    systemCostMin?: number,
    systemCostMax?: number
  ): GeneratorComparison {
    // Daily fuel consumption in liters
    const dailyFuelConsumptionL = dailyLoadWh / (GENERATOR_EFFICIENCY * 1000) // Convert Wh to kWh
    
    // Monthly and annual fuel costs
    const monthlyFuelCost = dailyFuelConsumptionL * petrolPrice * 30
    const annualFuelCost = monthlyFuelCost * 12
    
    // Solar system payback calculation
    let solarPaybackMonths = 0
    let monthlySavings = monthlyFuelCost
    
    if (systemCostMin && systemCostMax) {
      const averageSystemCost = (systemCostMin + systemCostMax) / 2
      solarPaybackMonths = Math.round(averageSystemCost / monthlyFuelCost)
    }
    
    return {
      daily_fuel_consumption_l: Math.round(dailyFuelConsumptionL * 100) / 100,
      monthly_fuel_cost: Math.round(monthlyFuelCost),
      annual_fuel_cost: Math.round(annualFuelCost),
      solar_payback_months: solarPaybackMonths,
      monthly_savings: Math.round(monthlySavings)
    }
  }

  /**
   * Calculate solar generator recharge time
   */
  calculateSolarGeneratorRechargeTime(
    batteryCapacityWh: number,
    solarInputW: number,
    location?: string
  ): number {
    const psh = location ? 
      PEAK_SUN_HOURS[location as keyof typeof PEAK_SUN_HOURS] || PEAK_SUN_HOURS.default :
      PEAK_SUN_HOURS.default
    
    const rechargeTimeHours = batteryCapacityWh / (solarInputW * psh * 0.9) // 90% charging efficiency
    return Math.round(rechargeTimeHours * 10) / 10 // Round to 1 decimal place
  }

  /**
   * Validate system requirements
   */
  validateSystem(results: CalculationResults): {
    isValid: boolean
    warnings: string[]
    recommendations: string[]
  } {
    const warnings: string[] = []
    const recommendations: string[] = []
    
    // Check if peak load is very high compared to daily load
    const avgHourlyLoad = results.daily_load_wh / 24
    const peakToAvgRatio = results.peak_load_w / avgHourlyLoad
    
    if (peakToAvgRatio > 10) {
      warnings.push('Your peak load is very high compared to average load. Consider staggering appliance usage.')
    }
    
    // Check battery autonomy
    const batteryCapacityHours = (results.battery_wh * BATTERY_DOD[this.configuration.battery_type]) / (results.daily_load_wh / 24)
    
    if (batteryCapacityHours < 4) {
      recommendations.push('Consider adding more battery capacity for better backup time.')
    }
    
    // Check system voltage for power level
    if (results.inverter_size_w > 2000 && this.configuration.system_voltage < 24) {
      recommendations.push('Consider using 24V or 48V system for higher power requirements.')
    }
    
    if (results.inverter_size_w > 5000 && this.configuration.system_voltage < 48) {
      recommendations.push('Consider using 48V system for optimal efficiency at this power level.')
    }
    
    return {
      isValid: warnings.length === 0,
      warnings,
      recommendations
    }
  }
}

/**
 * Helper function to create a calculator instance
 */
export function createSolarCalculator(
  appliances: UserAppliance[], 
  configuration: SystemConfiguration
): SolarCalculator {
  return new SolarCalculator(appliances, configuration)
}

/**
 * Helper function for quick calculations
 */
export function calculateSolarSystem(
  appliances: UserAppliance[],
  configuration: SystemConfiguration
): CalculationResults {
  const calculator = new SolarCalculator(appliances, configuration)
  return calculator.calculate()
}

/**
 * Helper function for generator comparison
 */
export function calculateGeneratorComparison(
  dailyLoadWh: number,
  petrolPrice?: number,
  systemCostMin?: number,
  systemCostMax?: number
): GeneratorComparison {
  const calculator = new SolarCalculator([], {} as SystemConfiguration)
  return calculator.calculateGeneratorComparison(dailyLoadWh, petrolPrice, systemCostMin, systemCostMax)
}