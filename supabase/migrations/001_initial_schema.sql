-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- Products table (inverters, panels, batteries, charge controllers)
create table products (
  id uuid default uuid_generate_v4() primary key,
  name varchar(255) not null,
  category varchar(50) not null check (category in ('inverter', 'panel', 'battery', 'charge_controller', 'solar_generator')),
  brand varchar(100) not null,
  model varchar(100),
  specifications jsonb not null default '{}'::jsonb,
  price_min decimal(10,2),
  price_max decimal(10,2),
  availability boolean default true,
  description text,
  image_url varchar(500),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Bundles table (complete solar systems)
create table bundles (
  id uuid default uuid_generate_v4() primary key,
  name varchar(255) not null,
  category varchar(50) not null check (category in ('basic', 'comfort', 'premium', 'enterprise')),
  description text,
  specifications jsonb not null default '{}'::jsonb,
  price_min decimal(10,2) not null,
  price_max decimal(10,2) not null,
  components jsonb not null default '[]'::jsonb,
  suitable_for text[],
  daily_load_min decimal(8,2),
  daily_load_max decimal(8,2),
  peak_load_min decimal(8,2),
  peak_load_max decimal(8,2),
  availability boolean default true,
  image_url varchar(500),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Leads table (user inquiries and calculator results)
create table leads (
  id uuid default uuid_generate_v4() primary key,
  name varchar(255),
  email varchar(255),
  phone varchar(50),
  whatsapp varchar(50),
  location varchar(100),
  calculation_results jsonb not null default '{}'::jsonb,
  appliances jsonb not null default '[]'::jsonb,
  system_configuration jsonb not null default '{}'::jsonb,
  recommended_bundle_id uuid references bundles(id),
  recommended_products jsonb default '[]'::jsonb,
  generator_comparison jsonb default '{}'::jsonb,
  status varchar(50) default 'new' check (status in ('new', 'contacted', 'quoted', 'converted', 'lost')),
  source varchar(50) default 'calculator',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Settings table (admin configurable values)
create table settings (
  id uuid default uuid_generate_v4() primary key,
  key varchar(100) unique not null,
  value jsonb not null,
  description text,
  category varchar(50) default 'general',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Appliances table (predefined appliances for calculator)
create table appliances (
  id uuid default uuid_generate_v4() primary key,
  name varchar(255) not null,
  watts decimal(8,2) not null,
  category varchar(100),
  description text,
  is_active boolean default true,
  sort_order integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create indexes for performance
create index idx_products_category on products(category);
create index idx_products_availability on products(availability);
create index idx_bundles_category on bundles(category);
create index idx_bundles_availability on bundles(availability);
create index idx_bundles_daily_load on bundles(daily_load_min, daily_load_max);
create index idx_bundles_peak_load on bundles(peak_load_min, peak_load_max);
create index idx_leads_status on leads(status);
create index idx_leads_created_at on leads(created_at);
create index idx_settings_key on settings(key);
create index idx_appliances_category on appliances(category);
create index idx_appliances_active on appliances(is_active);
create index idx_appliances_sort on appliances(sort_order);

-- Row Level Security (RLS)
alter table products enable row level security;
alter table bundles enable row level security;
alter table leads enable row level security;
alter table settings enable row level security;
alter table appliances enable row level security;

-- Public read access for products, bundles, settings, appliances
create policy "Public read access" on products for select using (true);
create policy "Public read access" on bundles for select using (true);
create policy "Public read access" on settings for select using (true);
create policy "Public read access" on appliances for select using (true);

-- Public insert access for leads (calculator submissions)
create policy "Public insert access" on leads for insert with check (true);
create policy "Public read own leads" on leads for select using (true);

-- Admin policies would be added later for authenticated users

-- Insert default settings
insert into settings (key, value, description, category) values
  ('petrol_price', '950', 'Current petrol price per liter in Naira', 'pricing'),
  ('generator_efficiency', '2.5', 'Generator efficiency in kWh per liter', 'technical'),
  ('peak_sun_hours', '{"lagos": 4.5, "abuja": 5.5, "kano": 6.0, "ph": 4.8, "default": 5.0}', 'Peak sun hours by location', 'technical'),
  ('system_losses', '0.75', 'System loss factor for calculations', 'technical'),
  ('inverter_efficiency', '0.9', 'Inverter efficiency factor', 'technical'),
  ('battery_dod', '{"lead_acid": 0.5, "lifepo4": 0.8}', 'Battery depth of discharge by type', 'technical'),
  ('company_info', '{"name": "Solar Solutions Nigeria", "phone": "+2348012345678", "email": "info@solarsolutions.ng", "address": "Lagos, Nigeria"}', 'Company information for quotes', 'branding'),
  ('whatsapp_message_template', 'Hello! I calculated my solar power needs:\n\n🔋 Daily Energy: {daily_load}Wh\n⚡ Peak Load: {peak_load}W\n📍 Location: {location}\n💰 Estimated Cost: ₦{price_range}\n\nRecommended System: {bundle_name}\n\nCan you help me with a detailed quote?', 'WhatsApp message template', 'messaging');