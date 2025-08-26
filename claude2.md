<!-- CALCULATOR -->
// -----------------------------
// INPUTS
// -----------------------------
devices[] = [ {name, watts, hours_per_day}, ... ]   // chosen from Quick Mode OR entered in Expert Mode

// Total daily load
daily_load_wh = sum(devices.watts * devices.hours_per_day * devices.quantity)

// Peak load
peak_load_w = sum_of_max_devices_running_at_once

// Settings
autonomy_days = user_input OR default = 1
system_voltage = 12 / 24 / 48
battery_chemistry = Lead Acid (DoD 0.5) OR LiFePO4 (DoD 0.8)
panel_wattage = default 400W
location = Lagos, Abuja, Kano, PH (lookup Peak Sun Hours)
    Lagos = 4.5, Abuja = 5.5, Kano = 6.0, PH = 4.8

inverter_efficiency = 0.9
loss_factor = 0.75

// -----------------------------
// CALCULATIONS
// -----------------------------

// Step 1: Inverter
inverter_size = peak_load_w * 1.25
inverter_size = round_up_to_nearest_available(inverter_size)

// Step 2: Battery
battery_wh = (daily_load_wh * autonomy_days) / inverter_efficiency
battery_ah = battery_wh / (system_voltage * DoD)
battery_count = ceil(battery_ah / standard_battery_size)   // default 200Ah

// Step 3: PV Array
pv_array_w = daily_load_wh / (psh * loss_factor)
panel_count = ceil(pv_array_w / panel_wattage)

// Step 4: Charge Controller
controller_current = (pv_array_w / system_voltage) * 1.25
controller_current = round_up_to_nearest_available(controller_current)

// -----------------------------
// OUTPUT
// -----------------------------
return {
    "Daily Energy Need (Wh/day)": daily_load_wh,
    "Inverter Size (W)": inverter_size,
    "Battery Requirement (Wh)": battery_wh,
    "Battery Capacity (Ah)": battery_ah,
    "Batteries Needed": battery_count,
    "PV Array Size (W)": pv_array_w,
    "Number of Panels": panel_count,
    "Charge Controller Rating (A)": controller_current
}

Quick Mode (Default – For Non-Technical Users)

Prefilled Nigerian appliances with average wattages:

| Device             | Default Wattage | Notes                     |
| ------------------ | --------------- | ------------------------- |
| LED Bulb           | 10W             | Per bulb                  |
| LED Lamp           | 20W             | Desk/reading lamp         |
| Ceiling Fan        | 60W             | Standard ceiling fan      |
| Rechargeable Fan   | 20W             | Small portable fan        |
| Cut Fan (Standing) | 70W             | Bigger standing fan       |
| 32" TV             | 120W            | Mid-size LED TV           |
| CCTV Camera        | 15W             | Typical security camera   |
| Fridge             | 150W            | Small to medium fridge    |
| Freezer            | 200W            | Chest freezer             |
| AC (1.5hp)         | 1500W           | Standard split unit       |
| Laptop             | 70W             | Average power consumption |
| Desktop Computer   | 300W            | With monitor              |
| Phone Charger      | 7W              | Per unit                  |
| Pumping Machine    | 800W            | Water pump (domestic)     |
| Washing Machine    | 400W            | Medium size               |


Expert Mode (For Technical Users)

User clicks “Add Device”.

Inputs: Device Name, Power Rating (Watts), Hours per Day, Quantity.

Unlimited entries possible.

3. User Scenarios
🧑🏽 Non-Technical User (Quick Mode)

Ngozi in Enugu doesn’t know the wattages of her appliances.

She opens the calculator → Quick Mode is default.

She sees a list of appliances with checkboxes.

She selects:

6 LED Bulbs (10W each, 6 hrs/day)

2 Fans (70W each, 8 hrs/day)

1 TV (100W, 5 hrs/day)

1 Fridge (150W, 24 hrs/day)

Calculator runs:

Daily Load ≈ 3,400 Wh/day

Peak Load ≈ 460W

Recommended Inverter = 600W (rounded to 1kVA)

Batteries = ~330Ah @12V → 2 × 200Ah batteries

Panels = 1,133W → 3 × 400W panels

Charge Controller = 50A MPPT

Ngozi sees recommendation: “Comfort Home Kit (₦650k–₦900k)” and a Request Quote button.

✅ She didn’t type any wattages — easy, fast, trustworthy.

👨🏾‍💻 Technical User (Expert Mode)

Emeka in Abuja is an engineer who knows exact wattages.

He switches to Expert Mode.

He enters:

Workstation PC (350W, 6 hrs/day, 1 unit)

Air Conditioner (1,500W, 8 hrs/day, 1 unit)

Router (15W, 24 hrs/day, 1 unit)

Calculator runs:

Daily Load = 14,790 Wh/day

Peak Load = 1,865W

Recommended Inverter = 2,331W (round up to 3.5kVA)

Batteries = ~20,500 Wh → ~427Ah @48V (LiFePO4) → 4 × 200Ah batteries

Panels = 4,476W → 12 × 400W panels

Charge Controller = 120A MPPT

Emeka sees recommendation: “Premium Home Kit (₦3.5m–₦4.2m)” plus custom option.

✅ He gets a professional-grade calculation with detailed breakdown.


After user selects appliances (Quick Mode or Expert Mode), they should configure the system with these settings:

1. Location → Determines Peak Sun Hours for PV sizing.
2. Battery Type → Determines Depth of Discharge (0.5 AGM, 0.8 LiFePO4).
3. Backup Days → Multiplies daily load for battery sizing.
4. Panel Size → Defines how PV array is split into panel count.

These settings must be factored into the main formulas:

- Daily Load (Wh/day) = sum of device watts × qty × hours
- Inverter Size = peak_load × 1.25
- Battery Size (Ah) = (Daily_Load × Backup_Days) / (System_Voltage × DoD × Efficiency)
- PV Array Size (W) = Daily_Load / (PSH × Loss_Factor)
- Panel Count = PV_Array / Panel_Size
- Controller Current (A) = (PV_Array / System_Voltage) × 1.25

This ensures the system sizing adapts dynamically to Nigerian cities, battery types, backup requirements, and available panel options.

I want to extend the solar calculator with four business-focused features that improve sales conversion and user trust:

---

1. Generator Comparison (Fuel Cost Calculator)
- After the calculator computes the daily load, add a generator comparison module.
- Formula:
   Monthly Fuel Cost (₦) = (daily_load_wh / generator_efficiency_kwh_per_litre) × petrol_price × 30
- Default values:
   - Generator efficiency: 2.5 kWh/litre
   - Petrol price: ₦950/litre (configurable in admin panel)
- Output:
   - Daily fuel consumption in litres
   - Monthly fuel cost in Naira
   - Comparison vs solar system cost (“Solar saves you ₦XX per month”)
- Purpose: Clearly show cost savings and motivate solar adoption.

---

2. Bundle Recommendation Engine
- After calculation results (inverter, battery, panels, controller), map the system to the nearest product bundle in the database.
- Each bundle should have specs stored in the database (inverter size, number of batteries, number of panels, price).
- Matching logic:
   - Select the smallest bundle that meets or exceeds the calculated requirements.
   - If no bundle matches, suggest “custom system.”
- Output:
   - Display bundle name, specs, and price.
   - “Request Quote” button → saves lead and forwards data to admin.

---

3. WhatsApp Share & Lead Capture
- After results, add a CTA (Call To Action) button: “Share My Results on WhatsApp.”
- This should open WhatsApp with a prefilled message containing:
   - User’s load summary
   - Recommended system/bundle
   - Estimated generator savings
- Use WhatsApp Business API deep links so messages go directly to our business line.
- Also capture user details (name, phone, email) in the database for lead management.

---

4. PDF Quote Generator
- After calculation, allow the user to download a professional PDF with:
   - User’s selected appliances and load breakdown
   - System configuration (location, battery type, backup days, panel size)
   - Recommended system or generator
   - Generator cost comparison
   - Bundle details and price
   - Company branding (logo, contact details)
- Format: A4, clean design, company colors.
- PDF generation should use server-side rendering for accuracy.
- Admin panel should allow updating branding info and footer notes.

---

Important Notes:
- These features should integrate smoothly into the calculator flow, appearing after the main results.
- Lead capture (WhatsApp share, Request Quote, PDF download) must log results into the database for analytics and follow-up.
- The admin panel must allow updates to petrol price, bundle specs, and branding info without redeployment.
- All CTAs should drive towards lead capture and sales conversion.
