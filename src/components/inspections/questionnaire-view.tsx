"use client";

import { useState } from "react";
import { AlertOctagon, Calendar, CheckCircle2, ChevronRight } from "lucide-react";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import type {
    OriginationSection,
    OriginationField,
    OriginationFieldOption,
    ValidationLevel,
} from "@/types";

// ============================================================================
// Mock Template Data (Path A - Origination Multi-Family)
// ============================================================================

const ORIGINATION_SECTIONS: OriginationSection[] = [
    {
        id: "economic-outlook",
        title: "Economic Outlook",
        description: "Assess the local market conditions and economic factors.",
        fields: [
            {
                id: "market-trend",
                label: "Market Trend",
                type: "select",
                required: true,
                validationLevel: "blocker",
                placeholder: "Select trend",
                helpText: "Overall direction of the local real estate market.",
                options: [
                    { value: "positive", label: "Positive" },
                    { value: "flat", label: "Flat" },
                    { value: "downward", label: "Downward" },
                ],
            },
            {
                id: "vacancy-rate",
                label: "Estimated Vacancy Rate (%)",
                type: "number",
                required: true,
                validationLevel: "warning",
                placeholder: "e.g., 5",
                helpText: "Current vacancy rate in the immediate area.",
            },
            {
                id: "economic-notes",
                label: "Economic Assessment Notes",
                type: "textarea",
                required: false,
                validationLevel: "warning",
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
                id: "incident-occurred",
                label: "Has an incident occurred at this property?",
                type: "select",
                required: true,
                validationLevel: "blocker",
                options: [
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                ],
            },
            {
                id: "incident-type",
                label: "Type of Incident",
                type: "select",
                required: false,
                validationLevel: "warning",
                placeholder: "Select type",
                options: [
                    { value: "fire", label: "Fire" },
                    { value: "flood", label: "Flood" },
                    { value: "crime", label: "Crime" },
                    { value: "death", label: "Death/Murder" },
                    { value: "other", label: "Other" },
                ],
            },
            {
                id: "incident-date",
                label: "Date of Incident",
                type: "date",
                required: false,
                validationLevel: "warning",
            },
            {
                id: "incident-description",
                label: "Describe the incident in detail",
                type: "textarea",
                required: false,
                validationLevel: "blocker",
                placeholder: "Provide a detailed description of what occurred...",
                helpText: "Include all relevant details for underwriting purposes.",
            },
        ],
    },
    {
        id: "utilities",
        title: "Utilities",
        description: "Verify utility connections and metering.",
        fields: [
            {
                id: "electric-provider",
                label: "Electric Provider",
                type: "text",
                required: true,
                validationLevel: "warning",
                placeholder: "e.g., ComEd",
            },
            {
                id: "gas-provider",
                label: "Gas Provider",
                type: "text",
                required: false,
                validationLevel: "warning",
                placeholder: "e.g., Peoples Gas",
            },
            {
                id: "water-provider",
                label: "Water Provider",
                type: "text",
                required: true,
                validationLevel: "warning",
                placeholder: "e.g., Chicago Water",
            },
            {
                id: "metering-type",
                label: "Metering Type",
                type: "select",
                required: true,
                validationLevel: "blocker",
                options: [
                    { value: "individual", label: "Individual Meters" },
                    { value: "master", label: "Master Metered" },
                    { value: "mixed", label: "Mixed" },
                ],
            },
            {
                id: "utility-notes",
                label: "Additional Utility Notes",
                type: "textarea",
                required: false,
                validationLevel: "warning",
                placeholder: "Note any utility concerns, recent upgrades, or issues...",
            },
        ],
    },
    {
        id: "property-condition",
        title: "Property Condition",
        description: "Overall assessment of the physical condition.",
        fields: [
            {
                id: "overall-condition",
                label: "Overall Property Condition",
                type: "select",
                required: true,
                validationLevel: "blocker",
                options: [
                    { value: "excellent", label: "Excellent" },
                    { value: "good", label: "Good" },
                    { value: "fair", label: "Fair" },
                    { value: "poor", label: "Poor" },
                ],
            },
            {
                id: "deferred-maintenance",
                label: "Evidence of Deferred Maintenance?",
                type: "select",
                required: true,
                validationLevel: "blocker",
                options: [
                    { value: "none", label: "None" },
                    { value: "minor", label: "Minor" },
                    { value: "moderate", label: "Moderate" },
                    { value: "significant", label: "Significant" },
                ],
            },
            {
                id: "estimated-repairs",
                label: "Estimated Repair Costs ($)",
                type: "number",
                required: false,
                validationLevel: "warning",
                placeholder: "e.g., 15000",
                helpText: "Estimated cost to address any identified issues.",
            },
            {
                id: "condition-notes",
                label: "Detailed Condition Notes",
                type: "textarea",
                required: true,
                validationLevel: "blocker",
                placeholder: "Describe the overall condition, any deficiencies observed, recommended repairs...",
            },
        ],
    },
    {
        id: "occupancy",
        title: "Occupancy",
        description: "Verify occupancy status and tenant information.",
        fields: [
            {
                id: "occupancy-status",
                label: "Current Occupancy Status",
                type: "select",
                required: true,
                validationLevel: "blocker",
                options: [
                    { value: "owner-occupied", label: "Owner Occupied" },
                    { value: "tenant-occupied", label: "Tenant Occupied" },
                    { value: "vacant", label: "Vacant" },
                    { value: "partially-occupied", label: "Partially Occupied" },
                ],
            },
            {
                id: "unit-count",
                label: "Number of Units",
                type: "number",
                required: true,
                validationLevel: "blocker",
                placeholder: "e.g., 4",
            },
            {
                id: "occupied-units",
                label: "Number of Occupied Units",
                type: "number",
                required: true,
                validationLevel: "warning",
                placeholder: "e.g., 3",
            },
            {
                id: "lease-verification",
                label: "Leases Verified?",
                type: "select",
                required: true,
                validationLevel: "blocker",
                options: [
                    { value: "yes", label: "Yes - All leases verified" },
                    { value: "partial", label: "Partial - Some leases missing" },
                    { value: "no", label: "No - Unable to verify" },
                ],
            },
            {
                id: "occupancy-notes",
                label: "Occupancy Notes",
                type: "textarea",
                required: false,
                validationLevel: "warning",
                placeholder: "Note any tenant concerns, lease terms, or occupancy issues...",
            },
        ],
    },
];

// ============================================================================
// Field Components
// ============================================================================

interface FieldProps {
    field: OriginationField;
    value: string;
    onChange: (value: string) => void;
    showValidation: boolean;
}

const TextField = ({ field, value, onChange, showValidation }: FieldProps) => {
    const isEmpty = !value.trim();
    const showError = showValidation && field.required && isEmpty;

    return (
        <input
            type={field.type === "number" ? "number" : "text"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            className={cx(
                "w-full rounded-lg border bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                showError
                    ? "border-error-500 ring-1 ring-error-500"
                    : "border-secondary hover:border-gray-400"
            )}
        />
    );
};

const TextareaField = ({ field, value, onChange, showValidation }: FieldProps) => {
    const isEmpty = !value.trim();
    const showError = showValidation && field.required && isEmpty;

    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            rows={4}
            className={cx(
                "w-full rounded-lg border bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary transition-colors resize-none",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                showError
                    ? "border-error-500 ring-1 ring-error-500"
                    : "border-secondary hover:border-gray-400"
            )}
        />
    );
};

const SelectField = ({ field, value, onChange, showValidation }: FieldProps) => {
    const isEmpty = !value;
    const showError = showValidation && field.required && isEmpty;

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cx(
                "w-full rounded-lg border bg-primary px-3.5 py-2.5 text-sm transition-colors appearance-none cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                !value ? "text-tertiary" : "text-primary",
                showError
                    ? "border-error-500 ring-1 ring-error-500"
                    : "border-secondary hover:border-gray-400"
            )}
        >
            <option value="">{field.placeholder || "Select..."}</option>
            {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
};

const DateField = ({ field, value, onChange, showValidation }: FieldProps) => {
    const isEmpty = !value;
    const showError = showValidation && field.required && isEmpty;

    return (
        <div className="relative">
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cx(
                    "w-full rounded-lg border bg-primary px-3.5 py-2.5 text-sm text-primary transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                    showError
                        ? "border-error-500 ring-1 ring-error-500"
                        : "border-secondary hover:border-gray-400"
                )}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
        </div>
    );
};

// ============================================================================
// Validation Badge
// ============================================================================

const ValidationBadge = ({ level }: { level: ValidationLevel }) => {
    if (level === "blocker") {
        return (
            <Badge color="error" size="sm" className="ml-2">
                <AlertOctagon className="size-3 mr-1" />
                Blocker
            </Badge>
        );
    }
    return null;
};

// ============================================================================
// Form Field Wrapper
// ============================================================================

interface FormFieldProps {
    field: OriginationField;
    value: string;
    onChange: (value: string) => void;
    showValidation: boolean;
}

const FormField = ({ field, value, onChange, showValidation }: FormFieldProps) => {
    const isEmpty = field.type === "textarea" || field.type === "text" || field.type === "number"
        ? !value.trim()
        : !value;
    const showError = showValidation && field.required && isEmpty;

    return (
        <div className="space-y-1.5">
            <div className="flex items-center">
                <label className="text-sm font-medium text-primary">
                    {field.label}
                    {field.required && <span className="text-error-500 ml-0.5">*</span>}
                </label>
                {field.validationLevel === "blocker" && <ValidationBadge level="blocker" />}
            </div>

            {field.helpText && (
                <p className="text-xs text-tertiary">{field.helpText}</p>
            )}

            {field.type === "text" || field.type === "number" ? (
                <TextField field={field} value={value} onChange={onChange} showValidation={showValidation} />
            ) : field.type === "textarea" ? (
                <TextareaField field={field} value={value} onChange={onChange} showValidation={showValidation} />
            ) : field.type === "select" ? (
                <SelectField field={field} value={value} onChange={onChange} showValidation={showValidation} />
            ) : field.type === "date" ? (
                <DateField field={field} value={value} onChange={onChange} showValidation={showValidation} />
            ) : null}

            {showError && (
                <p className="text-xs text-error-500">This field is required</p>
            )}
        </div>
    );
};

// ============================================================================
// Section Tab
// ============================================================================

interface SectionTabProps {
    section: OriginationSection;
    isActive: boolean;
    isComplete: boolean;
    hasBlockers: boolean;
    onClick: () => void;
}

const SectionTab = ({ section, isActive, isComplete, hasBlockers, onClick }: SectionTabProps) => {
    return (
        <button
            onClick={onClick}
            className={cx(
                "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-colors",
                isActive
                    ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                    : "hover:bg-gray-50 text-secondary"
            )}
        >
            <div
                className={cx(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg",
                    isComplete && !hasBlockers
                        ? "bg-success-100"
                        : hasBlockers
                            ? "bg-error-100"
                            : "bg-gray-100"
                )}
            >
                {isComplete && !hasBlockers ? (
                    <CheckCircle2 className="size-4 text-success-600" />
                ) : hasBlockers ? (
                    <AlertOctagon className="size-4 text-error-600" />
                ) : (
                    <span className="text-xs font-medium text-gray-500">
                        {ORIGINATION_SECTIONS.findIndex((s) => s.id === section.id) + 1}
                    </span>
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className={cx("text-sm font-medium truncate", isActive && "text-brand-700")}>
                    {section.title}
                </p>
                <p className="text-xs text-tertiary truncate">
                    {section.fields.length} fields
                </p>
            </div>
            <ChevronRight
                className={cx(
                    "size-4 shrink-0 transition-transform",
                    isActive ? "text-brand-500 rotate-90" : "text-gray-400"
                )}
            />
        </button>
    );
};

// ============================================================================
// Main Component
// ============================================================================

interface QuestionnaireViewProps {
    inspectionId: string;
    initialData?: Record<string, string>;
    onDataChange?: (data: Record<string, string>) => void;
}

export function QuestionnaireView({ inspectionId, initialData = {}, onDataChange }: QuestionnaireViewProps) {
    const [activeSection, setActiveSection] = useState(ORIGINATION_SECTIONS[0].id);
    const [formData, setFormData] = useState<Record<string, string>>(initialData);
    const [showValidation, setShowValidation] = useState(false);

    const handleFieldChange = (fieldId: string, value: string) => {
        const newData = { ...formData, [fieldId]: value };
        setFormData(newData);
        onDataChange?.(newData);
    };

    const isSectionComplete = (section: OriginationSection): boolean => {
        return section.fields
            .filter((f) => f.required)
            .every((f) => {
                const value = formData[f.id];
                return value && value.trim() !== "";
            });
    };

    const sectionHasBlockers = (section: OriginationSection): boolean => {
        return section.fields
            .filter((f) => f.required && f.validationLevel === "blocker")
            .some((f) => {
                const value = formData[f.id];
                return !value || value.trim() === "";
            });
    };

    const currentSection = ORIGINATION_SECTIONS.find((s) => s.id === activeSection);

    const completedCount = ORIGINATION_SECTIONS.filter((s) => isSectionComplete(s)).length;
    const totalBlockers = ORIGINATION_SECTIONS.reduce((count, section) => {
        return count + section.fields.filter((f) =>
            f.required &&
            f.validationLevel === "blocker" &&
            (!formData[f.id] || formData[f.id].trim() === "")
        ).length;
    }, 0);

    return (
        <div className="space-y-6">
            {/* Progress Header */}
            <div className="flex items-center justify-between rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary">
                <div>
                    <h3 className="text-sm font-semibold text-primary">Origination Questionnaire</h3>
                    <p className="text-xs text-tertiary mt-0.5">
                        {completedCount} of {ORIGINATION_SECTIONS.length} sections complete
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {totalBlockers > 0 && (
                        <div className="flex items-center gap-2 text-error-600">
                            <AlertOctagon className="size-4" />
                            <span className="text-sm font-medium">{totalBlockers} blocker{totalBlockers !== 1 ? "s" : ""}</span>
                        </div>
                    )}
                    <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-brand-600 transition-all"
                            style={{ width: `${(completedCount / ORIGINATION_SECTIONS.length) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Main Layout - Vertical Tabs */}
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* Tabs Column */}
                <div className="space-y-2">
                    {ORIGINATION_SECTIONS.map((section) => (
                        <SectionTab
                            key={section.id}
                            section={section}
                            isActive={activeSection === section.id}
                            isComplete={isSectionComplete(section)}
                            hasBlockers={sectionHasBlockers(section)}
                            onClick={() => setActiveSection(section.id)}
                        />
                    ))}
                </div>

                {/* Form Area */}
                <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
                    {currentSection && (
                        <>
                            <div className="mb-6 border-b border-secondary pb-4">
                                <h2 className="text-lg font-semibold text-primary">{currentSection.title}</h2>
                                {currentSection.description && (
                                    <p className="mt-1 text-sm text-tertiary">{currentSection.description}</p>
                                )}
                            </div>

                            <div className="space-y-6">
                                {currentSection.fields.map((field) => (
                                    <FormField
                                        key={field.id}
                                        field={field}
                                        value={formData[field.id] || ""}
                                        onChange={(value) => handleFieldChange(field.id, value)}
                                        showValidation={showValidation}
                                    />
                                ))}
                            </div>

                            {/* Section Navigation */}
                            <div className="mt-8 flex items-center justify-between border-t border-secondary pt-6">
                                <button
                                    onClick={() => {
                                        const currentIndex = ORIGINATION_SECTIONS.findIndex((s) => s.id === activeSection);
                                        if (currentIndex > 0) {
                                            setActiveSection(ORIGINATION_SECTIONS[currentIndex - 1].id);
                                        }
                                    }}
                                    disabled={activeSection === ORIGINATION_SECTIONS[0].id}
                                    className={cx(
                                        "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                        activeSection === ORIGINATION_SECTIONS[0].id
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "text-secondary hover:bg-gray-100"
                                    )}
                                >
                                    ← Previous Section
                                </button>
                                <button
                                    onClick={() => {
                                        setShowValidation(true);
                                        const currentIndex = ORIGINATION_SECTIONS.findIndex((s) => s.id === activeSection);
                                        if (currentIndex < ORIGINATION_SECTIONS.length - 1) {
                                            setActiveSection(ORIGINATION_SECTIONS[currentIndex + 1].id);
                                        }
                                    }}
                                    className={cx(
                                        "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                        activeSection === ORIGINATION_SECTIONS[ORIGINATION_SECTIONS.length - 1].id
                                            ? "bg-brand-600 text-white hover:bg-brand-700"
                                            : "bg-brand-600 text-white hover:bg-brand-700"
                                    )}
                                >
                                    {activeSection === ORIGINATION_SECTIONS[ORIGINATION_SECTIONS.length - 1].id
                                        ? "Complete Questionnaire"
                                        : "Next Section →"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
