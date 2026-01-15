import type { InspectionTemplate } from "@/types";

// =============================================================================
// ORIGINATION MULTI-FAMILY TEMPLATE (Path A)
// Form-based questionnaire for loan origination inspections
// =============================================================================

export const ORIGINATION_TEMPLATE: InspectionTemplate = {
    id: "origination-mf-v1",
    title: "Origination - Multi-Family Property Inspection",
    version: "1.0.0",
    workflowType: "ORIGINATION_MF",
    validationMode: "STRICT",
    sections: [
        {
            id: "economic-outlook",
            title: "Economic Outlook",
            description: "Assess the local market conditions and economic factors affecting the property.",
            fields: [
                {
                    id: "mf_market_trend",
                    label: "Market Trend",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    placeholder: "Select trend",
                    helpText: "Overall direction of the local real estate market.",
                    options: [
                        { value: "positive", label: "Positive" },
                        { value: "flat", label: "Flat" },
                        { value: "downward", label: "Downward" },
                    ],
                },
                {
                    id: "mf_vacancy_rate",
                    label: "Estimated Area Vacancy Rate (%)",
                    type: "NUMBER",
                    required: true,
                    validationLevel: "BLOCKER",
                    placeholder: "e.g., 5",
                    helpText: "Current vacancy rate in the immediate area.",
                    validation: { min: 0, max: 100 },
                },
                {
                    id: "mf_rent_trend",
                    label: "Rent Trend",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    options: [
                        { value: "increasing", label: "Increasing" },
                        { value: "stable", label: "Stable" },
                        { value: "decreasing", label: "Decreasing" },
                    ],
                },
                {
                    id: "mf_economic_notes",
                    label: "Economic Assessment Notes",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "WARNING",
                    placeholder: "Describe local economic conditions, major employers, development trends...",
                },
            ],
        },
        {
            id: "incidents",
            title: "Incidents",
            description: "Document any incidents or adverse events at the property.",
            fields: [
                {
                    id: "mf_incident_occurred",
                    label: "Has an incident occurred at this property?",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    options: [
                        { value: "yes", label: "Yes" },
                        { value: "no", label: "No" },
                    ],
                },
                {
                    id: "mf_incident_type",
                    label: "Type of Incident",
                    type: "SELECT",
                    required: false,
                    validationLevel: "BLOCKER",
                    placeholder: "Select type",
                    helpText: "Required if incident occurred.",
                    options: [
                        { value: "fire", label: "Fire" },
                        { value: "flood", label: "Flood" },
                        { value: "crime", label: "Crime" },
                        { value: "death", label: "Death/Murder" },
                        { value: "environmental", label: "Environmental Hazard" },
                        { value: "structural", label: "Structural Damage" },
                        { value: "other", label: "Other" },
                    ],
                },
                {
                    id: "mf_incident_date",
                    label: "Date of Incident",
                    type: "DATE",
                    required: false,
                    validationLevel: "WARNING",
                },
                {
                    id: "mf_incident_description",
                    label: "Describe the incident in detail",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "BLOCKER",
                    placeholder: "Provide a detailed description of what occurred...",
                    helpText: "Include all relevant details for underwriting purposes.",
                },
                {
                    id: "mf_incident_remediation",
                    label: "Remediation Status",
                    type: "SELECT",
                    required: false,
                    validationLevel: "WARNING",
                    options: [
                        { value: "completed", label: "Completed" },
                        { value: "in_progress", label: "In Progress" },
                        { value: "pending", label: "Pending" },
                        { value: "na", label: "Not Applicable" },
                    ],
                },
            ],
        },
        {
            id: "utilities",
            title: "Utilities",
            description: "Verify utility connections, providers, and metering configuration.",
            fields: [
                {
                    id: "mf_electric_provider",
                    label: "Electric Provider",
                    type: "TEXT",
                    required: true,
                    validationLevel: "WARNING",
                    placeholder: "e.g., ComEd",
                },
                {
                    id: "mf_gas_provider",
                    label: "Gas Provider",
                    type: "TEXT",
                    required: false,
                    validationLevel: "WARNING",
                    placeholder: "e.g., Peoples Gas (or N/A if all-electric)",
                },
                {
                    id: "mf_water_provider",
                    label: "Water Provider",
                    type: "TEXT",
                    required: true,
                    validationLevel: "WARNING",
                    placeholder: "e.g., Chicago Water",
                },
                {
                    id: "mf_metering_type",
                    label: "Metering Type",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    helpText: "How are utilities metered for the property?",
                    options: [
                        { value: "individual", label: "Individual Meters (tenant-paid)" },
                        { value: "master", label: "Master Metered (owner-paid)" },
                        { value: "mixed", label: "Mixed (varies by utility)" },
                    ],
                },
                {
                    id: "mf_hvac_type",
                    label: "HVAC System Type",
                    type: "SELECT",
                    required: true,
                    validationLevel: "WARNING",
                    options: [
                        { value: "central", label: "Central HVAC" },
                        { value: "individual", label: "Individual Unit Systems" },
                        { value: "boiler", label: "Boiler/Radiator" },
                        { value: "ptac", label: "PTAC Units" },
                        { value: "other", label: "Other" },
                    ],
                },
                {
                    id: "mf_utility_notes",
                    label: "Additional Utility Notes",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "WARNING",
                    placeholder: "Note any utility concerns, recent upgrades, or issues...",
                },
            ],
        },
        {
            id: "property-condition",
            title: "Property Condition",
            description: "Overall assessment of the physical condition of the property.",
            fields: [
                {
                    id: "mf_overall_condition",
                    label: "Overall Property Condition",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    options: [
                        { value: "excellent", label: "Excellent" },
                        { value: "good", label: "Good" },
                        { value: "fair", label: "Fair" },
                        { value: "poor", label: "Poor" },
                    ],
                },
                {
                    id: "mf_deferred_maintenance",
                    label: "Evidence of Deferred Maintenance?",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    options: [
                        { value: "none", label: "None" },
                        { value: "minor", label: "Minor" },
                        { value: "moderate", label: "Moderate" },
                        { value: "significant", label: "Significant" },
                    ],
                },
                {
                    id: "mf_roof_condition",
                    label: "Roof Condition",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    options: [
                        { value: "excellent", label: "Excellent (0-5 years old)" },
                        { value: "good", label: "Good (5-10 years old)" },
                        { value: "fair", label: "Fair (10-15 years old)" },
                        { value: "poor", label: "Poor (needs replacement)" },
                    ],
                },
                {
                    id: "mf_estimated_repairs",
                    label: "Estimated Immediate Repair Costs ($)",
                    type: "NUMBER",
                    required: false,
                    validationLevel: "BLOCKER",
                    placeholder: "e.g., 15000",
                    helpText: "Estimated cost to address immediate repair items.",
                    validation: { min: 0 },
                },
                {
                    id: "mf_condition_photos",
                    label: "Condition Documentation Photos",
                    type: "PHOTO_ARRAY",
                    required: true,
                    validationLevel: "BLOCKER",
                    helpText: "Upload photos documenting property condition.",
                },
                {
                    id: "mf_condition_notes",
                    label: "Detailed Condition Notes",
                    type: "TEXTAREA",
                    required: true,
                    validationLevel: "BLOCKER",
                    placeholder: "Describe the overall condition, any deficiencies observed, recommended repairs...",
                },
            ],
        },
        {
            id: "occupancy",
            title: "Occupancy",
            description: "Verify occupancy status, unit mix, and tenant information.",
            fields: [
                {
                    id: "mf_occupancy_status",
                    label: "Current Occupancy Status",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    options: [
                        { value: "fully_occupied", label: "Fully Occupied (95%+)" },
                        { value: "mostly_occupied", label: "Mostly Occupied (80-95%)" },
                        { value: "partially_occupied", label: "Partially Occupied (50-80%)" },
                        { value: "mostly_vacant", label: "Mostly Vacant (<50%)" },
                        { value: "vacant", label: "Completely Vacant" },
                    ],
                },
                {
                    id: "mf_total_units",
                    label: "Total Number of Units",
                    type: "NUMBER",
                    required: true,
                    validationLevel: "BLOCKER",
                    placeholder: "e.g., 12",
                    validation: { min: 1 },
                },
                {
                    id: "mf_occupied_units",
                    label: "Number of Occupied Units",
                    type: "NUMBER",
                    required: true,
                    validationLevel: "BLOCKER",
                    placeholder: "e.g., 10",
                    validation: { min: 0 },
                },
                {
                    id: "mf_lease_verification",
                    label: "Leases Verified?",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    helpText: "Were lease documents reviewed and verified?",
                    options: [
                        { value: "yes_all", label: "Yes - All leases verified" },
                        { value: "yes_sample", label: "Yes - Sample leases verified" },
                        { value: "partial", label: "Partial - Some leases missing" },
                        { value: "no", label: "No - Unable to verify" },
                    ],
                },
                {
                    id: "mf_rent_roll_match",
                    label: "Does Rent Roll Match Physical Inspection?",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    options: [
                        { value: "yes", label: "Yes - Matches" },
                        { value: "minor_variance", label: "Minor Variance" },
                        { value: "significant_variance", label: "Significant Variance" },
                    ],
                },
                {
                    id: "mf_occupancy_notes",
                    label: "Occupancy Notes",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "WARNING",
                    placeholder: "Note any tenant concerns, lease terms, or occupancy issues...",
                },
            ],
        },
        {
            id: "environmental",
            title: "Environmental",
            description: "Environmental considerations and potential hazards.",
            fields: [
                {
                    id: "mf_flood_zone",
                    label: "Is property in a FEMA Flood Zone?",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    options: [
                        { value: "no", label: "No (Zone X)" },
                        { value: "yes_moderate", label: "Yes - Moderate Risk (Zone B/C)" },
                        { value: "yes_high", label: "Yes - High Risk (Zone A/V)" },
                        { value: "unknown", label: "Unknown - Requires Verification" },
                    ],
                },
                {
                    id: "mf_asbestos",
                    label: "Evidence of Asbestos?",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    helpText: "Based on building age and visual inspection.",
                    options: [
                        { value: "none", label: "None Observed" },
                        { value: "possible", label: "Possible - Testing Recommended" },
                        { value: "confirmed", label: "Confirmed - Abatement Required" },
                        { value: "abated", label: "Previously Abated" },
                    ],
                },
                {
                    id: "mf_lead_paint",
                    label: "Lead Paint Concern? (Pre-1978 Construction)",
                    type: "SELECT",
                    required: true,
                    validationLevel: "WARNING",
                    options: [
                        { value: "na", label: "N/A - Built after 1978" },
                        { value: "no_concern", label: "No Concern - Good condition" },
                        { value: "potential", label: "Potential - Testing recommended" },
                        { value: "confirmed", label: "Confirmed - Disclosed" },
                    ],
                },
                {
                    id: "mf_environmental_notes",
                    label: "Environmental Notes",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "WARNING",
                    placeholder: "Note any environmental concerns, nearby hazards, or required testing...",
                },
            ],
        },
    ],
};

// =============================================================================
// SERVICING MBA TEMPLATE (Path B)
// Checklist-based inspection with MBA 1-5 rating scale
// =============================================================================

export const SERVICING_TEMPLATE: InspectionTemplate = {
    id: "servicing-mba-v1",
    title: "Servicing - MBA Property Condition Assessment",
    version: "1.0.0",
    workflowType: "SERVICING_MBA",
    validationMode: "FLEXIBLE",
    sections: [
        {
            id: "exterior",
            title: "Exterior",
            description: "Assess exterior building components and grounds.",
            fields: [
                {
                    id: "pc_roof_rating",
                    label: "Roof Condition",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                    helpText: "1=Poor, 2=Below Average, 3=Average, 4=Good, 5=Excellent",
                },
                {
                    id: "pc_roof_notes",
                    label: "Roof Notes",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "WARNING",
                    placeholder: "Describe any issues, estimated age, material type...",
                },
                {
                    id: "pc_roof_photos",
                    label: "Roof Photos",
                    type: "PHOTO_ARRAY",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_siding_rating",
                    label: "Siding/Exterior Walls",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_siding_notes",
                    label: "Siding Notes",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "WARNING",
                },
                {
                    id: "pc_windows_rating",
                    label: "Windows & Doors",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_windows_notes",
                    label: "Windows & Doors Notes",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "WARNING",
                },
                {
                    id: "pc_foundation_rating",
                    label: "Foundation",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_foundation_notes",
                    label: "Foundation Notes",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "WARNING",
                    placeholder: "Note any cracks, settling, water intrusion signs...",
                },
                {
                    id: "pc_parking_rating",
                    label: "Parking Areas & Driveways",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "WARNING",
                },
                {
                    id: "pc_landscaping_rating",
                    label: "Landscaping & Grounds",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "WARNING",
                },
                {
                    id: "pc_exterior_photos",
                    label: "General Exterior Photos",
                    type: "PHOTO_ARRAY",
                    required: true,
                    validationLevel: "BLOCKER",
                    helpText: "Include front, sides, and rear views.",
                },
            ],
        },
        {
            id: "interior-common",
            title: "Interior - Common Areas",
            description: "Assess common areas, hallways, and shared spaces.",
            fields: [
                {
                    id: "pc_lobby_rating",
                    label: "Lobby/Entry",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_lobby_notes",
                    label: "Lobby Notes",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "WARNING",
                },
                {
                    id: "pc_hallways_rating",
                    label: "Hallways & Corridors",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_stairwells_rating",
                    label: "Stairwells",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "WARNING",
                },
                {
                    id: "pc_elevator_rating",
                    label: "Elevators (if applicable)",
                    type: "RATING_1_5",
                    required: false,
                    validationLevel: "WARNING",
                    helpText: "Rate N/A if no elevators present.",
                },
                {
                    id: "pc_laundry_rating",
                    label: "Laundry Facilities (if applicable)",
                    type: "RATING_1_5",
                    required: false,
                    validationLevel: "WARNING",
                },
                {
                    id: "pc_common_photos",
                    label: "Common Area Photos",
                    type: "PHOTO_ARRAY",
                    required: true,
                    validationLevel: "BLOCKER",
                },
            ],
        },
        {
            id: "interior-units",
            title: "Interior - Unit Interiors",
            description: "Assess representative unit conditions.",
            fields: [
                {
                    id: "pc_units_inspected",
                    label: "Number of Units Inspected",
                    type: "NUMBER",
                    required: true,
                    validationLevel: "BLOCKER",
                    placeholder: "e.g., 3",
                    helpText: "Minimum 10% of units or 3 units, whichever is greater.",
                },
                {
                    id: "pc_unit_floors_rating",
                    label: "Unit Flooring (Average)",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_unit_walls_rating",
                    label: "Unit Walls & Ceilings (Average)",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_unit_kitchen_rating",
                    label: "Kitchen Appliances & Cabinets (Average)",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_unit_bath_rating",
                    label: "Bathroom Fixtures (Average)",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_unit_hvac_rating",
                    label: "Unit HVAC Systems (Average)",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_unit_notes",
                    label: "Unit Condition Summary",
                    type: "TEXTAREA",
                    required: true,
                    validationLevel: "BLOCKER",
                    placeholder: "Summarize overall unit conditions, variations between units, any concerns...",
                },
                {
                    id: "pc_unit_photos",
                    label: "Unit Interior Photos",
                    type: "PHOTO_ARRAY",
                    required: true,
                    validationLevel: "BLOCKER",
                    helpText: "Include kitchen, bathroom, and living areas from inspected units.",
                },
            ],
        },
        {
            id: "mechanical-systems",
            title: "Mechanical Systems",
            description: "Assess building mechanical systems and utilities.",
            fields: [
                {
                    id: "pc_hvac_central_rating",
                    label: "Central HVAC System",
                    type: "RATING_1_5",
                    required: false,
                    validationLevel: "BLOCKER",
                    helpText: "Rate N/A if no central system.",
                },
                {
                    id: "pc_hvac_age",
                    label: "HVAC System Age (Years)",
                    type: "NUMBER",
                    required: false,
                    validationLevel: "WARNING",
                    placeholder: "e.g., 8",
                },
                {
                    id: "pc_boiler_rating",
                    label: "Boiler/Hot Water System",
                    type: "RATING_1_5",
                    required: false,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_electrical_rating",
                    label: "Electrical Systems",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_electrical_notes",
                    label: "Electrical Notes",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "WARNING",
                    placeholder: "Panel type, capacity, any concerns...",
                },
                {
                    id: "pc_plumbing_rating",
                    label: "Plumbing Systems",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                },
                {
                    id: "pc_plumbing_notes",
                    label: "Plumbing Notes",
                    type: "TEXTAREA",
                    required: false,
                    validationLevel: "WARNING",
                    placeholder: "Pipe material, hot water heater condition, any leaks...",
                },
                {
                    id: "pc_fire_safety_rating",
                    label: "Fire Safety Systems",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                    helpText: "Smoke detectors, sprinklers, extinguishers, alarms.",
                },
                {
                    id: "pc_mechanical_photos",
                    label: "Mechanical Room Photos",
                    type: "PHOTO_ARRAY",
                    required: true,
                    validationLevel: "WARNING",
                },
            ],
        },
        {
            id: "overall-assessment",
            title: "Overall Assessment",
            description: "Summary ratings and final assessment.",
            fields: [
                {
                    id: "pc_overall_rating",
                    label: "Overall Property Condition Rating",
                    type: "RATING_1_5",
                    required: true,
                    validationLevel: "BLOCKER",
                    helpText: "Weighted average of all component ratings.",
                },
                {
                    id: "pc_immediate_repairs",
                    label: "Immediate Repairs Required?",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    options: [
                        { value: "none", label: "None" },
                        { value: "minor", label: "Minor (< $5,000)" },
                        { value: "moderate", label: "Moderate ($5,000 - $25,000)" },
                        { value: "major", label: "Major (> $25,000)" },
                    ],
                },
                {
                    id: "pc_repair_estimate",
                    label: "Estimated Repair Costs ($)",
                    type: "NUMBER",
                    required: false,
                    validationLevel: "WARNING",
                    placeholder: "e.g., 12500",
                },
                {
                    id: "pc_capital_needs",
                    label: "Capital Needs (Next 5 Years)",
                    type: "TEXTAREA",
                    required: true,
                    validationLevel: "BLOCKER",
                    placeholder: "List anticipated capital expenditures...",
                },
                {
                    id: "pc_recommendation",
                    label: "Inspector Recommendation",
                    type: "SELECT",
                    required: true,
                    validationLevel: "BLOCKER",
                    options: [
                        { value: "acceptable", label: "Acceptable - No Issues" },
                        { value: "acceptable_repairs", label: "Acceptable - With Repairs" },
                        { value: "review", label: "Requires Further Review" },
                        { value: "unacceptable", label: "Unacceptable" },
                    ],
                },
                {
                    id: "pc_summary_notes",
                    label: "Executive Summary",
                    type: "TEXTAREA",
                    required: true,
                    validationLevel: "BLOCKER",
                    placeholder: "Provide an overall summary of the property condition, key findings, and recommendations...",
                },
            ],
        },
    ],
};

// =============================================================================
// TEMPLATES REGISTRY
// =============================================================================

export const TEMPLATES: Record<string, InspectionTemplate> = {
    "origination-mf-v1": ORIGINATION_TEMPLATE,
    "servicing-mba-v1": SERVICING_TEMPLATE,
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get a template by ID
 */
export const getTemplateById = (templateId: string): InspectionTemplate | undefined => {
    return TEMPLATES[templateId];
};

/**
 * Get template for a workflow type
 */
export const getTemplateForWorkflow = (workflowType: "ORIGINATION_MF" | "SERVICING_MBA"): InspectionTemplate => {
    return workflowType === "ORIGINATION_MF" ? ORIGINATION_TEMPLATE : SERVICING_TEMPLATE;
};

/**
 * Get all field IDs from a template
 */
export const getTemplateFieldIds = (template: InspectionTemplate): string[] => {
    return template.sections.flatMap((section) => section.fields.map((field) => field.id));
};

/**
 * Validate inspection data against template
 */
export const validateInspectionData = (
    template: InspectionTemplate,
    data: Record<string, unknown>
): { valid: boolean; blockers: string[]; warnings: string[] } => {
    const blockers: string[] = [];
    const warnings: string[] = [];

    for (const section of template.sections) {
        for (const field of section.fields) {
            if (field.required) {
                const value = data[field.id];
                const isEmpty = value === undefined || value === null || value === "";

                if (isEmpty) {
                    if (field.validationLevel === "BLOCKER") {
                        blockers.push(field.id);
                    } else {
                        warnings.push(field.id);
                    }
                }
            }
        }
    }

    return {
        valid: blockers.length === 0,
        blockers,
        warnings,
    };
};
