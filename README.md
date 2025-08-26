# 🌞 Solar Calculator Nigeria

A Nigerian-focused solar retail platform with an advanced solar calculator designed to help ordinary people make smarter decisions about solar power systems.

## 🚀 Features

### Core Calculator Features
- **Two Calculation Paths**: Full solar system sizing and solar generator matching
- **Two Input Modes**: Quick mode for beginners, Expert mode for technical users
- **Nigerian-Specific Data**: Accurate peak sun hours for Lagos, Abuja, Kano, and Port Harcourt
- **Advanced Calculations**: Proper efficiency factors, battery depth of discharge, system losses
- **Mobile-First Design**: Optimized for smartphone users with limited data

### Business Features
- **Generator Cost Comparison**: Shows monthly fuel savings vs solar investment
- **Bundle Recommendations**: Matches calculations to available product bundles
- **WhatsApp Integration**: Pre-filled messages for instant expert consultation
- **Lead Capture**: Comprehensive lead management for sales follow-up
- **PDF Quote Generation**: Professional quotes with company branding

### Technical Features
- **Next.js 14** with App Router and TypeScript
- **Supabase** for backend and database
- **Tailwind CSS** for styling
- **Mobile-responsive** design
- **Nigerian naira** pricing and formatting

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### 1. Clone and Install Dependencies

```bash
# Install all dependencies at once
npm install next@14.0.0 react@^18 react-dom@^18 typescript@^5 @types/node@^20 @types/react@^18 @types/react-dom@^18 @supabase/supabase-js@^2.38.0 @supabase/ssr@^0.0.10 @headlessui/react@^1.7.17 @heroicons/react@^2.0.18 lucide-react@^0.292.0 clsx@^2.0.0 tailwind-merge@^2.0.0 react-hook-form@^7.47.0 @hookform/resolvers@^3.3.2 zod@^3.22.4 @react-pdf/renderer@^3.1.14 jspdf@^2.5.1 html2canvas@^1.4.1 puppeteer@^21.5.2 recharts@^2.8.0 react-chartjs-2@^5.2.0 chart.js@^4.4.0 date-fns@^2.30.0 uuid@^9.0.1 dotenv@^16.3.1 qrcode@^1.5.3

# Dev dependencies
npm install -D @types/uuid@^9.0.7 @types/qrcode@^1.5.5 autoprefixer@^10.0.1 postcss@^8 tailwindcss@^3.3.0 eslint@^8 eslint-config-next@14.0.0 @tailwindcss/forms@^0.5.7 jest@^29.7.0 @testing-library/react@^13.4.0 @testing-library/jest-dom@^6.1.4 @types/jest@^29.5.8 cypress@^13.5.0 @testing-library/cypress@^10.0.1 supabase@^1.123.4
```

### 2. Environment Setup

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Update the environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_COMPANY_NAME="Solar Solutions Nigeria"
NEXT_PUBLIC_WHATSAPP_NUMBER=+2348012345678

# Business Configuration
NEXT_PUBLIC_PETROL_PRICE=950
NEXT_PUBLIC_GENERATOR_EFFICIENCY=2.5
```

### 3. Database Setup

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Initialize Supabase
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
supabase db reset

# Or manually run the migration
supabase db push
```

### 4. Seed Database

```bash
# Run the seeding script
npm run seed

# Or seed appliances only
npm run seed -- --direct
```

### 5. Development

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   └── globals.css        # Global styles
├── components/
│   └── calculator/        # Calculator components
│       ├── SolarCalculator.tsx
│       └── steps/         # Calculator step components
├── lib/
│   ├── calculator.ts      # Core calculation engine
│   └── supabase.ts       # Database client and helpers
├── types/
│   └── index.ts          # TypeScript definitions
├── data/
│   └── appliances.ts     # Default appliances data
└── utils/                # Utility functions

supabase/
├── migrations/           # Database migrations
└── seed/                # Seed data files

scripts/
└── seed.js              # Database seeding script
```

## 🧮 Calculator Logic

### Formula Overview

```typescript
// Daily Load Calculation
daily_load_wh = sum(appliance.watts × appliance.hours × appliance.quantity)

// Peak Load Calculation  
peak_load_w = sum(appliance.watts × appliance.quantity)

// Inverter Sizing (25% safety margin)
inverter_size = peak_load_w × 1.25

// Battery Sizing
battery_wh = (daily_load_wh × autonomy_days) / inverter_efficiency
battery_ah = battery_wh / (system_voltage × depth_of_discharge)
battery_count = ceil(battery_ah / standard_battery_size)

// Solar Panel Sizing
pv_array_w = daily_load_wh / (peak_sun_hours × loss_factor)
panel_count = ceil(pv_array_w / panel_wattage)

// Charge Controller Sizing
controller_current = (pv_array_w / system_voltage) × 1.25
```

### Nigerian-Specific Parameters

```typescript
const PEAK_SUN_HOURS = {
  lagos: 4.5,
  abuja: 5.5, 
  kano: 6.0,
  ph: 4.8
}

const BATTERY_DOD = {
  lead_acid: 0.5,    // 50% depth of discharge
  lifepo4: 0.8       // 80% depth of discharge
}

const INVERTER_EFFICIENCY = 0.9      // 90% efficiency
const SYSTEM_LOSS_FACTOR = 0.75      // 75% system efficiency
const GENERATOR_EFFICIENCY = 2.5     // 2.5 kWh per liter
```

## 📱 Mobile Optimization

The calculator is designed mobile-first for Nigerian smartphone users:

- **Touch-friendly interface** with large buttons and inputs
- **Progressive disclosure** to reduce cognitive load
- **Offline capability** for areas with poor connectivity
- **Data-efficient** with optimized images and minimal API calls
- **Fast loading** with static generation and edge deployment

## 💰 Pricing Integration

### Bundle Categories

1. **Basic Bundles** (₦280k - ₦900k): Entry-level systems for small homes
2. **Comfort Bundles** (₦950k - ₦3.3M): Mid-range systems for average homes  
3. **Premium Bundles** (₦4.2M - ₦18M): High-end systems for luxury homes
4. **Enterprise Bundles** (₦4.5M - ₦45M): Commercial and industrial systems

### Cost Comparison Engine

```typescript
// Generator fuel cost calculation
monthly_fuel_cost = (daily_load_wh / 1000) / generator_efficiency × petrol_price × 30

// Solar payback period
payback_months = system_cost / monthly_fuel_cost

// Annual savings
annual_savings = monthly_fuel_cost × 12
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# E2E tests
npm run cypress

# Run headless
npm run cypress:headless
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy automatically on push

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_key
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 📊 Database Schema

### Key Tables

- **products**: Solar components (inverters, panels, batteries, etc.)
- **bundles**: Complete system packages
- **appliances**: Predefined appliances with power ratings
- **leads**: Customer inquiries and calculator results
- **settings**: Admin-configurable values

### Data Seeding

The system includes:
- **50 products** across all categories and price ranges
- **20 bundles** from basic to enterprise level
- **25+ appliances** common in Nigerian homes
- **Default settings** for calculations and pricing

## 🔧 Customization

### Adding New Appliances

```typescript
// Add to src/data/appliances.ts
{
  name: 'New Appliance',
  watts: 100,
  category: 'Electronics',
  description: 'Description',
  is_active: true,
  sort_order: 26
}
```

### Updating Calculations

Modify the calculator engine in `src/lib/calculator.ts`:

```typescript
export class SolarCalculator {
  // Add custom calculation methods
  calculateCustomMetric() {
    // Your custom logic
  }
}
```

### Styling

The project uses Tailwind CSS with custom components in `globals.css`:

```css
.btn-primary {
  @apply btn bg-primary-600 hover:bg-primary-700 text-white;
}
```

## 📈 Analytics & Monitoring

Integration points for analytics:

- Calculator usage tracking
- Lead conversion rates
- Popular appliance combinations
- Geographic usage patterns
- System size preferences

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

- **Email**: info@solarsolutions.ng
- **WhatsApp**: +234 801 234 5678
- **Documentation**: [Link to docs]
- **Issues**: [GitHub Issues](link)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built for Nigerian solar market with ❤️**