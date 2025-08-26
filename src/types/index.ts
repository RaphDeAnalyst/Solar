// Database types
export interface Product {
  id: string;
  name: string;
  category: 'inverter' | 'panel' | 'battery' | 'charge_controller' | 'solar_generator';
  brand: string;
  model?: string;
  specifications: Record<string, any>;
  price_min?: number;
  price_max?: number;
  availability: boolean;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Bundle {
  id: string;
  name: string;
  category: 'basic' | 'comfort' | 'premium' | 'enterprise';
  description?: string;
  specifications: Record<string, any>;
  price_min: number;
  price_max: number;
  components: any[];
  suitable_for: string[];
  daily_load_min?: number;
  daily_load_max?: number;
  peak_load_min?: number;
  peak_load_max?: number;
  availability: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  calculation_results: CalculationResults;
  appliances: Appliance[];
  system_configuration: SystemConfiguration;
  recommended_bundle_id?: string;
  recommended_products?: any[];
  generator_comparison?: GeneratorComparison;
  status: 'new' | 'contacted' | 'quoted' | 'converted' | 'lost';
  source: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Appliance {
  id: string;
  name: string;
  watts: number;
  category?: string;
  description?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Setting {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Calculator types
export interface UserAppliance {
  id: string;
  name: string;
  watts: number;
  hours: number;
  quantity: number;
  daily_consumption?: number; // calculated field
}

export interface SystemConfiguration {
  location: string;
  battery_type: 'lead_acid' | 'lifepo4';
  system_voltage: 12 | 24 | 48;
  autonomy_days: number;
  panel_wattage: number;
  calculation_type: 'full_system' | 'solar_generator';
  input_mode: 'quick' | 'expert';
}

export interface CalculationResults {
  daily_load_wh: number;
  peak_load_w: number;
  inverter_size_w: number;
  battery_wh: number;
  battery_ah: number;
  battery_count: number;
  pv_array_w: number;
  panel_count: number;
  charge_controller_a: number;
  system_voltage: number;
  estimated_cost_min?: number;
  estimated_cost_max?: number;
}

export interface GeneratorComparison {
  daily_fuel_consumption_l: number;
  monthly_fuel_cost: number;
  annual_fuel_cost: number;
  solar_payback_months: number;
  monthly_savings: number;
}

export interface SolarGenerator {
  id: string;
  name: string;
  battery_capacity_wh: number;
  max_output_w: number;
  solar_input_w: number;
  recharge_time_hours: number;
  price_min: number;
  price_max: number;
  suitable_for: string[];
}

// UI types
export interface CalculatorStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  isComplete: boolean;
  isActive: boolean;
}

export interface LocationData {
  name: string;
  peak_sun_hours: number;
  code: string;
}

// Form types
export interface LeadCaptureForm {
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  message?: string;
}

export interface QuoteRequest {
  lead_id: string;
  preferred_contact: 'whatsapp' | 'email' | 'phone';
  urgency: 'low' | 'medium' | 'high';
  budget_range?: string;
  installation_timeline?: string;
  additional_requirements?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}