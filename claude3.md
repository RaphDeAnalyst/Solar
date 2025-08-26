I want the calculator to support two main calculation paths:

1. Full Solar System Sizing
   - Calculate inverter size, battery capacity, number of panels, and charge controller rating.
   - Use Nigerian Peak Sun Hours (Lagos 4.5, Abuja 5.5, Kano 6.0, PH 4.8).
   - Use efficiency factors (inverter 0.9, system loss 0.75).
   - Support Lead Acid (DoD 0.5) and LiFePO4 (DoD 0.8).
   - Output intermediate steps and final recommended bundle.

2. Solar Generator Matching
   - Compare the user's total daily load and peak load with available solar generator products in the database.
   - Recommend the smallest generator that can handle the load.
   - Show recharge time using formula: battery_capacity_wh / (solar_input_w × PSH × 0.9).
   - If no match exists, suggest "custom system".

---

For each path, there should be two input modes:

A. Quick Mode (Non-Technical)
   - Show a predefined list of Nigerian appliances with default wattages (from Luminous Nigeria).
   - User selects quantity and hours per day.
   - Wattages are prefilled but editable.
   - This is the default mode for most users.

B. Expert Mode (Technical)
   - user can add devices manually (name, watts, hours/day, quantity).
   - Update this so that it starts with the same predefined appliance list prefilled with wattages.
   - The technical user can edit wattages, remove devices, or add new devices.
   - This saves time and gives flexibility.

---

Flow:

1. User first chooses Calculation Type:
   - (a) Full Solar System
   - (b) Solar Generator

2. Then user chooses Input Mode:
   - (a) Quick Mode (with prefilled list)
   - (b) Expert Mode (customizable list)

3. After calculation:
   - Show detailed breakdown of system sizing or generator match.
   - Map result to nearest available bundle in the database.
   - Include generator vs solar monthly cost comparison for added value.

---

Appliance Dataset (to preload in Quick Mode and Expert Mode defaults):

[
  { "name": "LED Bulb", "watts": 10 },
  { "name": "LED Lamp", "watts": 20 },
  { "name": "Ceiling Fan", "watts": 60 },
  { "name": "Rechargeable Fan", "watts": 20 },
  { "name": "Standing Fan", "watts": 70 },
  { "name": "32 inch TV", "watts": 120 },
  { "name": "CCTV Camera", "watts": 15 },
  { "name": "Fridge", "watts": 150 },
  { "name": "Freezer", "watts": 200 },
  { "name": "AC (1.5hp)", "watts": 1500 },
  { "name": "Laptop", "watts": 70 },
  { "name": "Desktop Computer", "watts": 300 },
  { "name": "Phone Charger", "watts": 7 },
  { "name": "Pumping Machine", "watts": 800 },
  { "name": "Washing Machine", "watts": 400 }
]

---

Important Notes:
- Quick Mode should feel simple like Luminous Nigeria’s calculator but with hours/day input.
- Expert Mode should feel advanced but should not start blank: load the appliance dataset as default rows, editable by the user.
- Always show intermediate steps so the user can trust the math.
- After calculation, show the closest bundle match and a “Request Quote” button.
- For Solar Generator mode, include recharge time as an extra insight.
