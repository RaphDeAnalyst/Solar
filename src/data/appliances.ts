import { Appliance } from '@/types'

export const DEFAULT_APPLIANCES: Omit<Appliance, 'id' | 'created_at' | 'updated_at'>[] = [
  {
    name: 'LED Bulb',
    watts: 10,
    category: 'Lighting',
    description: 'Energy efficient LED bulb',
    is_active: true,
    sort_order: 1
  },
  {
    name: 'LED Lamp',
    watts: 20,
    category: 'Lighting',
    description: 'Desk or reading lamp',
    is_active: true,
    sort_order: 2
  },
  {
    name: 'Ceiling Fan',
    watts: 60,
    category: 'Cooling',
    description: 'Standard ceiling fan',
    is_active: true,
    sort_order: 3
  },
  {
    name: 'Rechargeable Fan',
    watts: 20,
    category: 'Cooling',
    description: 'Small portable rechargeable fan',
    is_active: true,
    sort_order: 4
  },
  {
    name: 'Standing Fan',
    watts: 70,
    category: 'Cooling',
    description: 'Large standing fan',
    is_active: true,
    sort_order: 5
  },
  {
    name: '32" TV',
    watts: 120,
    category: 'Entertainment',
    description: 'Mid-size LED TV',
    is_active: true,
    sort_order: 6
  },
  {
    name: '43" TV',
    watts: 180,
    category: 'Entertainment',
    description: 'Large LED TV',
    is_active: true,
    sort_order: 7
  },
  {
    name: 'CCTV Camera',
    watts: 15,
    category: 'Security',
    description: 'Security camera system',
    is_active: true,
    sort_order: 8
  },
  {
    name: 'Fridge',
    watts: 150,
    category: 'Appliances',
    description: 'Small to medium refrigerator',
    is_active: true,
    sort_order: 9
  },
  {
    name: 'Freezer',
    watts: 200,
    category: 'Appliances',
    description: 'Chest freezer',
    is_active: true,
    sort_order: 10
  },
  {
    name: 'AC (1.5hp)',
    watts: 1500,
    category: 'Cooling',
    description: 'Standard split unit air conditioner',
    is_active: true,
    sort_order: 11
  },
  {
    name: 'AC (1hp)',
    watts: 1000,
    category: 'Cooling',
    description: 'Small split unit air conditioner',
    is_active: true,
    sort_order: 12
  },
  {
    name: 'AC (2hp)',
    watts: 2000,
    category: 'Cooling',
    description: 'Large split unit air conditioner',
    is_active: true,
    sort_order: 13
  },
  {
    name: 'Laptop',
    watts: 70,
    category: 'Electronics',
    description: 'Average laptop power consumption',
    is_active: true,
    sort_order: 14
  },
  {
    name: 'Desktop Computer',
    watts: 300,
    category: 'Electronics',
    description: 'Desktop computer with monitor',
    is_active: true,
    sort_order: 15
  },
  {
    name: 'Phone Charger',
    watts: 7,
    category: 'Electronics',
    description: 'Smartphone charger',
    is_active: true,
    sort_order: 16
  },
  {
    name: 'Pumping Machine',
    watts: 800,
    category: 'Appliances',
    description: 'Water pump for domestic use',
    is_active: true,
    sort_order: 17
  },
  {
    name: 'Washing Machine',
    watts: 400,
    category: 'Appliances',
    description: 'Medium size washing machine',
    is_active: true,
    sort_order: 18
  },
  {
    name: 'Iron',
    watts: 1200,
    category: 'Appliances',
    description: 'Electric iron',
    is_active: true,
    sort_order: 19
  },
  {
    name: 'Microwave',
    watts: 800,
    category: 'Appliances',
    description: 'Microwave oven',
    is_active: true,
    sort_order: 20
  },
  {
    name: 'Blender',
    watts: 300,
    category: 'Appliances',
    description: 'Electric blender',
    is_active: true,
    sort_order: 21
  },
  {
    name: 'Water Heater',
    watts: 1500,
    category: 'Appliances',
    description: 'Electric water heater',
    is_active: true,
    sort_order: 22
  },
  {
    name: 'Sound System',
    watts: 100,
    category: 'Entertainment',
    description: 'Home sound system',
    is_active: true,
    sort_order: 23
  },
  {
    name: 'Security Light',
    watts: 50,
    category: 'Security',
    description: 'Outdoor security lighting',
    is_active: true,
    sort_order: 24
  },
  {
    name: 'Gate Motor',
    watts: 500,
    category: 'Security',
    description: 'Automatic gate opener',
    is_active: true,
    sort_order: 25
  }
]

// Categories for organizing appliances
export const APPLIANCE_CATEGORIES = [
  'Lighting',
  'Cooling',
  'Entertainment',
  'Electronics',
  'Appliances',
  'Security'
] as const

// Helper function to group appliances by category
export function groupAppliancesByCategory(appliances: any[]) {
  return appliances.reduce((groups, appliance) => {
    const category = appliance.category || 'Other'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(appliance)
    return groups
  }, {} as Record<string, any[]>)
}

// Helper function to calculate total power for multiple appliances
export function calculateTotalPower(appliances: { watts: number; quantity: number; hours: number }[]) {
  return appliances.reduce((total, appliance) => {
    return total + (appliance.watts * appliance.quantity * appliance.hours)
  }, 0)
}