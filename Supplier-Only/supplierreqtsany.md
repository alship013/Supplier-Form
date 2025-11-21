Of course. Here is a structured list of all the requirements from the images, organized into the sections you specified. This format is ideal for providing to a developer to build out the system's interface and database.

---

### *System Requirements: Supplier & Plantation Survey Form*

Here is a breakdown of the required fields for the supplier and plantation survey, organized by section.

---

### *1. Basic Information*

*   *Form ID* (System-generated unique ID for this specific survey entry)
*   *Unique Supplier ID* (A unique identifier for the supplier)
*   *Survey Date* (Date Picker)
*   *Supplier Name* (Text Input)
*   *Contact Person* (Text Input)
*   *Phone Number* (Text Input, number format)
*   *Email* (Text Input, email format)
*   *Plantation Address* (Text Area)
*   *GPS Coordinate* (Input for Latitude/Longitude)
*   *Interactive Map Placeholder* (UI element to display the location based on GPS coordinates)

---

### *2. Land Status and Legality*

*   *Ownership Type* (Dropdown/Radio Buttons: Owned, Rented, Customary, Others)
*   *Proof of Ownership* (Dropdown/Checklist: SHM, HGB, HGU, HP, Girik, Adat, Other)
    *   If "Other" is selected, provide a text field for detailed info.
*   *Certificate Number* (Text Input)
*   *Proof of Ownership Documents (pdf)* (File Upload)
*   *Legal Status of Land* (Dropdown/Radio Buttons: Clear, In Process, Disputed, Others)
    *   If "Others" is selected, provide a text field for detailed info.
*   *Current Buyer (Competitor)* (Dropdown/Radio Buttons: Local, Middleman, Export, Other)

---

### *3. EUDR Compliance*

*   *Has deforestation occurred since Dec 31, 2020?* (Yes/No Radio Buttons)
*   *Evidence of no deforestation* (File Upload or Text Area for notes)
*   *Legality Checklist* (Dropdown with 5 list items)
*   *Proximity to Indigenous/local communities* (Yes/No/Unsure Radio Buttons)
*   *Known land conflicts/disputes* (Yes/No/Unsure Radio Buttons)
*   *Harvest Date/Period* (Date Range Picker)
*   *First Point of Sale/Aggregation* (Text Input)
*   *Plots of Land* (A repeatable section/dynamic list where user can add multiple plots)
    *   For each plot:
        *   *Plot Identifier* (e.g., Plot 1, Plot 2)
        *   *Plot Size (Ha)* (Number Input)
        *   *GPS Coordinates (polygon)* (Interactive map tool to draw the plot boundary)

---

### *4. ISCC Self Assessment*

*   *Principle 1: Land Use*
    *   *ISCC Land Use Check:* conversion after Jan 1, 2008? (Yes/No/Unknown Radio Buttons)
    *   *Previous Land Use (ISCC Definition):* (Checklist: primary forest, peatland, HBD, HCS)
*   *Principle 2: Environmental Management*
    *   *Practices in Place:* (Checklist with 3 items)
*   *Principle 3: Health, Safety and Labor*
    *   *H&S Checklist:* (Checklist with 2 items)
    *   *Worker Rights:* (Checklist with 3 items)
    *   *Grievance mechanism available?* (Yes/No Radio Buttons)
    *   *Freedom of association respected?* (Yes/No Radio Buttons)
*   *Principle 4&5: Management & Traceability*
    *   *Record Keeping:* (Checklist with 5 items)
    *   *Participated in GAP training?* (Yes/No Radio Buttons)

---

### *5. Plantation Profile*

*   *General Profile*
    *   *Main Crop Type* (Text Input or Dropdown)
    *   *Planting Year (avg)* (Number Input)
    *   *Age of Trees (Years)* (Number Input)
    *   *Total Land Size (Ha)* (Number Input)
    *   *Estd. Yield (kg/Ha)* (Number Input)
    *   *Soil Type* (Text Input)
    *   *Topography* (Text Input or Dropdown)
    *   *Farming System:* (Dropdown/Radio Buttons: Monoculture, Intercropped)
*   *Labor*
    *   *Type:* (Dropdown/Checklist: Family, Hired, Local, Migrant)
    *   *Number of workers (permanent)* (Number Input)
    *   *Number of workers (seasonal)* (Number Input)
*   *Access and Logistics*
    *   *Road Condition:* (Dropdown/Radio Buttons: Paved, Semi-paved, No road, Other)
    *   *Distance (km)* (Number Input)
    *   *Access category:* (Dropdown/Radio Buttons: Easy, Hard, Moderate)
*   *Farming Practices & Costs*
    *   *Water Source* (Text Input)
    *   *Pest Control Method* (Text Input)
    *   *Quantity Specs* (Text Input)
    *   *Fertilizer Use* (Text Input)
    *   *Fertilizer Usage Type:* (Dropdown/Radio Buttons: Chemical, Organic, Mix, Other)
    *   *Fertilizer Brand/Type Details* (Text Area)
    *   *Fertilizer Applications Months:* (Checklist: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec)
    *   *Cost: Fertilizer (IDR/year)* (Number Input)
    *   *Cost: Labor (IDR/year)* (Number Input)
    *   *Cost: Transport (IDR/shipment)* (Number Input)
*   *Seasonality*
    *   *Peak Season:* Start Month (Dropdown) & End Month (Dropdown)
    *   *Seed Collection:* Start Month (Dropdown) & End Month (Dropdown)
    *   *Fruit Development:* Start Month (Dropdown) & End Month (Dropdown)

---

### *6. Review and Submit*

*   *Summary* (Auto-generated text field summarizing: name, contact person, crop type)
*   *Final Survey Details: notes* (Text Area)
*   *Observed Red Flags* (Checklist: evidence of burning, child labor, encroachment on protected land)
*   *Photos* (Multiple File Uploads)
    *   1. Supplier
    *   2. Crop Sample
    *   3. Plantation
    *   4. Land Title/Docs
    *   5. Road Access
*   *Recommended FU (Follow-Up) Action* (Dropdown/Radio Buttons: Do not follow up, Require verification, Do not engage)
*   *Reason* (Text Area, required if an action is selected)
*   *Declaration*
    *   (Checkbox) "I, the undersigned, declare that the information provided..."
*   *Signatures*
    *   *Surveyor signature and name* (Digital Signature Pad + Text Input)
    *   *Supplier signature and name* (Digital Signature Pad + Text Input)
*   *Date verified* (Date Picker, auto-populated with current date but editable)