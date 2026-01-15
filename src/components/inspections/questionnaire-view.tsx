"use client";

import { useState, useMemo } from "react";
import {
    Calendar,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Circle,
    AlertCircle,
} from "lucide-react";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

interface FieldOption {
    value: string;
    label: string;
}

interface PhotoConfig {
    minPhotos: number;
    maxPhotos: number;
}

interface SchemaField {
    id: string;
    label: string;
    type: "TEXT" | "TEXTAREA" | "SELECT" | "MULTI_SELECT" | "DATE" | "PHOTO_ARRAY";
    required: boolean;
    validationLevel: "BLOCKER" | "WARNING";
    helpText?: string;
    placeholder?: string;
    maxLength?: number;
    options?: FieldOption[];
    photoConfig?: PhotoConfig;
}

interface SchemaSection {
    id: string;
    title: string;
    category: string;
    sortOrder: number;
    fields: SchemaField[];
}

interface Schema {
    $id: string;
    title: string;
    description: string;
    workflowPath: string;
    validationMode: string;
    sections: SchemaSection[];
}

interface CategoryGroup {
    name: string;
    sections: SchemaSection[];
}

// ============================================================================
// Schema Data (loaded from JSON structure)
// ============================================================================

const SCHEMA: Schema = {
    "$id": "inspectra-cre/sections/origination-mf-v1",
    "title": "Origination (MF) Inspection Sections",
    "description": "Section/field definitions for Path A - App Model Multifamily (SBL) Questionnaire",
    "workflowPath": "ORIGINATION_MF",
    "validationMode": "STRICT",
    "sections": [
        {
            "id": "mf_questionnaire_meta",
            "title": "Questionnaire Information",
            "category": "General Information",
            "sortOrder": 1,
            "fields": [
                { "id": "mf_completed_by", "label": "Questionnaire completed by", "type": "TEXT", "required": true, "validationLevel": "BLOCKER" },
                { "id": "mf_completed_date", "label": "Date questionnaire completed", "type": "DATE", "required": true, "validationLevel": "BLOCKER" },
                { "id": "mf_title_affiliation", "label": "Title/affiliation to subject property", "type": "TEXT", "required": true, "validationLevel": "BLOCKER" }
            ]
        },
        {
            "id": "mf_economic_outlook",
            "title": "Economic Outlook",
            "category": "Market & Operations",
            "sortOrder": 2,
            "fields": [
                { "id": "mf_q1_economic_outlook", "label": "Economic outlook description", "helpText": "Positive/Flat/Downward support.", "type": "TEXTAREA", "required": true, "validationLevel": "BLOCKER", "maxLength": 2000 },
                { "id": "mf_q1_outlook_rating", "label": "Economic outlook rating", "type": "SELECT", "required": true, "validationLevel": "BLOCKER", "options": [{ "value": "POSITIVE", "label": "Positive" }, { "value": "FLAT", "label": "Flat" }, { "value": "DOWNWARD", "label": "Downward" }] },
                { "id": "mf_q2_rental_competition", "label": "Biggest rental competition", "type": "TEXTAREA", "required": true, "validationLevel": "BLOCKER", "maxLength": 500 },
                { "id": "mf_q3_visibility", "label": "Is property visible to traffic?", "type": "SELECT", "required": true, "validationLevel": "BLOCKER", "options": [{ "value": "YES", "label": "Yes" }, { "value": "NO", "label": "No" }] }
            ]
        },
        {
            "id": "mf_income_tenancy",
            "title": "Income and Tenancy",
            "category": "Market & Operations",
            "sortOrder": 3,
            "fields": [
                { "id": "mf_q5_avg_residency", "label": "Avg. length of residency", "type": "TEXT", "required": true, "validationLevel": "BLOCKER" },
                { "id": "mf_q6_restricted_units", "label": "Rent/income restricted units?", "type": "SELECT", "required": true, "validationLevel": "BLOCKER", "options": [{ "value": "YES", "label": "Yes" }, { "value": "NO", "label": "No" }] },
                { "id": "mf_q7_initial_lease_terms", "label": "Initial lease terms", "type": "TEXT", "required": true, "validationLevel": "BLOCKER" },
                { "id": "mf_q8_special_tenants", "label": "Corporate/Student/Military tenants?", "type": "SELECT", "required": true, "validationLevel": "BLOCKER", "options": [{ "value": "YES", "label": "Yes" }, { "value": "NO", "label": "No" }] }
            ]
        },
        {
            "id": "mf_property_management",
            "title": "Property Management",
            "category": "Market & Operations",
            "sortOrder": 4,
            "fields": [
                { "id": "mf_q19_management_type", "label": "Management Type", "type": "SELECT", "required": true, "validationLevel": "BLOCKER", "options": [{ "value": "THIRD_PARTY", "label": "Third party" }, { "value": "BORROWER_AFFILIATED", "label": "Borrower affiliated" }, { "value": "SELF_MANAGED", "label": "Self-managed" }] },
                { "id": "mf_q20_onsite_manager", "label": "Onsite manager?", "type": "SELECT", "required": true, "validationLevel": "BLOCKER", "options": [{ "value": "YES", "label": "Yes" }, { "value": "NO", "label": "No" }] }
            ]
        },
        {
            "id": "mf_specific_incidents",
            "title": "Risk Assessment",
            "category": "Property Condition",
            "sortOrder": 5,
            "fields": [
                { "id": "mf_q4_incidents", "label": "Specific incidents in past 2 years", "type": "MULTI_SELECT", "required": true, "validationLevel": "BLOCKER", "options": [{ "value": "NONE", "label": "None" }, { "value": "FIRE", "label": "Fire" }, { "value": "CRIME", "label": "Crime/Police Activity" }] }
            ]
        },
        {
            "id": "mf_utilities",
            "title": "Utilities",
            "category": "Property Condition",
            "sortOrder": 6,
            "fields": [
                { "id": "mf_q15_tenant_pays", "label": "Tenant paid utilities", "type": "MULTI_SELECT", "required": true, "validationLevel": "BLOCKER", "options": [{ "value": "ELECTRIC", "label": "Electric" }, { "value": "GAS", "label": "Gas" }, { "value": "WATER", "label": "Water" }, { "value": "NONE", "label": "None" }] }
            ]
        },
        {
            "id": "mf_capex",
            "title": "Capital Expenditures",
            "category": "Property Condition",
            "sortOrder": 7,
            "fields": [
                { "id": "mf_q16_past_capex", "label": "CapEx past 3 years", "type": "TEXTAREA", "required": true, "validationLevel": "BLOCKER", "maxLength": 2000 },
                { "id": "mf_q17_future_capex", "label": "Planned future CapEx?", "type": "SELECT", "required": true, "validationLevel": "BLOCKER", "options": [{ "value": "YES", "label": "Yes" }, { "value": "NO", "label": "No" }] }
            ]
        },
        {
            "id": "mf_repairs_maintenance",
            "title": "Repairs & Maintenance",
            "category": "Property Condition",
            "sortOrder": 8,
            "fields": [
                { "id": "mf_q24_roof_age", "label": "Age of roofs", "type": "TEXT", "required": true, "validationLevel": "BLOCKER" },
                { "id": "mf_q25_amenities", "label": "Has amenities?", "type": "SELECT", "required": false, "validationLevel": "WARNING", "options": [{ "value": "YES", "label": "Yes" }, { "value": "NO", "label": "No" }] }
            ]
        },
        {
            "id": "mf_photos",
            "title": "Site Photos",
            "category": "Photos",
            "sortOrder": 9,
            "fields": [
                { "id": "mf_photos_exterior", "label": "Exterior Photos", "type": "PHOTO_ARRAY", "required": true, "validationLevel": "BLOCKER", "photoConfig": { "minPhotos": 4, "maxPhotos": 20 } },
                { "id": "mf_photos_units", "label": "Unit Photos", "type": "PHOTO_ARRAY", "required": true, "validationLevel": "BLOCKER", "photoConfig": { "minPhotos": 6, "maxPhotos": 50 } }
            ]
        }
    ]
};

// ============================================================================
// Utility Functions
// ============================================================================

function groupSectionsByCategory(sections: SchemaSection[]): CategoryGroup[] {
    const categoryMap = new Map<string, SchemaSection[]>();

    // Sort sections by sortOrder first
    const sortedSections = [...sections].sort((a, b) => a.sortOrder - b.sortOrder);

    // Group by category while preserving order
    const categoryOrder: string[] = [];
    for (const section of sortedSections) {
        if (!categoryMap.has(section.category)) {
            categoryMap.set(section.category, []);
            categoryOrder.push(section.category);
        }
        categoryMap.get(section.category)!.push(section);
    }

    return categoryOrder.map((name) => ({
        name,
        sections: categoryMap.get(name)!,
    }));
}

// ============================================================================
// Field Components
// ============================================================================

interface FieldProps {
    field: SchemaField;
    value: string;
    onChange: (value: string) => void;
    showValidation: boolean;
}

function TextField({ field, value, onChange, showValidation }: FieldProps) {
    const isEmpty = !value.trim();
    const showError = showValidation && field.required && isEmpty;

    return (
        <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || "Enter text..."}
            className={cx(
                "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                showError
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-300 hover:border-gray-400"
            )}
        />
    );
}

function TextareaField({ field, value, onChange, showValidation }: FieldProps) {
    const isEmpty = !value.trim();
    const showError = showValidation && field.required && isEmpty;

    return (
        <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder || "Enter details..."}
            rows={4}
            maxLength={field.maxLength}
            className={cx(
                "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors resize-none",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                showError
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-300 hover:border-gray-400"
            )}
        />
    );
}

function SelectField({ field, value, onChange, showValidation }: FieldProps) {
    const isEmpty = !value;
    const showError = showValidation && field.required && isEmpty;

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={cx(
                "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm transition-colors appearance-none cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                !value ? "text-gray-400" : "text-gray-900",
                showError
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-300 hover:border-gray-400"
            )}
        >
            <option value="">Select...</option>
            {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    );
}

function MultiSelectField({ field, value, onChange, showValidation }: FieldProps) {
    const selectedValues = value ? value.split(",").filter(Boolean) : [];
    const isEmpty = selectedValues.length === 0;
    const showError = showValidation && field.required && isEmpty;

    const toggleValue = (optionValue: string) => {
        const newValues = selectedValues.includes(optionValue)
            ? selectedValues.filter((v) => v !== optionValue)
            : [...selectedValues, optionValue];
        onChange(newValues.join(","));
    };

    return (
        <div
            className={cx(
                "rounded-lg border p-3 space-y-2",
                showError ? "border-red-500" : "border-gray-300"
            )}
        >
            {field.options?.map((option) => (
                <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-md transition-colors"
                >
                    <input
                        type="checkbox"
                        checked={selectedValues.includes(option.value)}
                        onChange={() => toggleValue(option.value)}
                        className="size-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className="text-sm text-gray-700">{option.label}</span>
                </label>
            ))}
        </div>
    );
}

function DateField({ field, value, onChange, showValidation }: FieldProps) {
    const isEmpty = !value;
    const showError = showValidation && field.required && isEmpty;

    return (
        <div className="relative">
            <input
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cx(
                    "w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-gray-900 transition-colors",
                    "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                    showError
                        ? "border-red-500 ring-1 ring-red-500"
                        : "border-gray-300 hover:border-gray-400"
                )}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
        </div>
    );
}

function PhotoArrayField({ field, value, onChange, showValidation }: FieldProps) {
    const photoCount = value ? parseInt(value, 10) || 0 : 0;
    const minPhotos = field.photoConfig?.minPhotos || 1;
    const maxPhotos = field.photoConfig?.maxPhotos || 10;
    const showError = showValidation && field.required && photoCount < minPhotos;

    return (
        <div
            className={cx(
                "rounded-lg border-2 border-dashed p-6 text-center",
                showError ? "border-red-300 bg-red-50" : "border-gray-300 bg-gray-50"
            )}
        >
            <div className="text-gray-400 mb-2">
                <Camera className="size-8 mx-auto" />
            </div>
            <p className="text-sm text-gray-600 mb-1">
                {photoCount} / {minPhotos}-{maxPhotos} photos uploaded
            </p>
            <button
                type="button"
                onClick={() => onChange(String(Math.min(photoCount + 1, maxPhotos)))}
                className="mt-2 px-4 py-2 text-sm font-medium text-brand-600 bg-white border border-brand-300 rounded-lg hover:bg-brand-50 transition-colors"
            >
                Add Photo (Mock)
            </button>
        </div>
    );
}

// Camera icon for photo field
function Camera({ className }: { className?: string }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
        </svg>
    );
}

// ============================================================================
// Form Field Wrapper
// ============================================================================

interface FormFieldWrapperProps {
    field: SchemaField;
    value: string;
    onChange: (value: string) => void;
    showValidation: boolean;
}

function FormFieldWrapper({ field, value, onChange, showValidation }: FormFieldWrapperProps) {
    const isEmpty = field.type === "TEXTAREA" || field.type === "TEXT"
        ? !value.trim()
        : field.type === "MULTI_SELECT"
            ? !value || value.split(",").filter(Boolean).length === 0
            : !value;
    const showError = showValidation && field.required && isEmpty;

    return (
        <div className="space-y-1.5">
            {/* Label */}
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-900">
                    {field.label}
                </label>
                {field.required ? (
                    <span className="text-red-500 text-sm">*</span>
                ) : (
                    <span className="text-xs text-gray-400">(Optional)</span>
                )}
            </div>

            {/* Help Text */}
            {field.helpText && (
                <p className="text-xs text-gray-500">{field.helpText}</p>
            )}

            {/* Field Input */}
            {field.type === "TEXT" && (
                <TextField field={field} value={value} onChange={onChange} showValidation={showValidation} />
            )}
            {field.type === "TEXTAREA" && (
                <TextareaField field={field} value={value} onChange={onChange} showValidation={showValidation} />
            )}
            {field.type === "SELECT" && (
                <SelectField field={field} value={value} onChange={onChange} showValidation={showValidation} />
            )}
            {field.type === "MULTI_SELECT" && (
                <MultiSelectField field={field} value={value} onChange={onChange} showValidation={showValidation} />
            )}
            {field.type === "DATE" && (
                <DateField field={field} value={value} onChange={onChange} showValidation={showValidation} />
            )}
            {field.type === "PHOTO_ARRAY" && (
                <PhotoArrayField field={field} value={value} onChange={onChange} showValidation={showValidation} />
            )}

            {/* Error Message */}
            {showError && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="size-3" />
                    This field is required
                </p>
            )}
        </div>
    );
}

// ============================================================================
// Sidebar Components
// ============================================================================

interface SectionItemProps {
    section: SchemaSection;
    isActive: boolean;
    isComplete: boolean;
    onClick: () => void;
    index: number;
}

function SectionItem({ section, isActive, isComplete, onClick, index }: SectionItemProps) {
    return (
        <button
            onClick={onClick}
            className={cx(
                "w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors",
                isActive
                    ? "bg-brand-50 text-brand-700"
                    : "hover:bg-gray-50 text-gray-700"
            )}
        >
            {/* Status Icon */}
            <div
                className={cx(
                    "flex size-6 shrink-0 items-center justify-center rounded-full",
                    isComplete
                        ? "bg-green-100"
                        : isActive
                            ? "bg-brand-100"
                            : "bg-gray-100"
                )}
            >
                {isComplete ? (
                    <CheckCircle2 className="size-3.5 text-green-600" />
                ) : (
                    <Circle className="size-3 text-gray-400" />
                )}
            </div>

            {/* Section Title */}
            <span className={cx("text-sm font-medium truncate flex-1", isActive && "text-brand-700")}>
                {section.title}
            </span>

            {/* Chevron */}
            <ChevronRight
                className={cx(
                    "size-4 shrink-0",
                    isActive ? "text-brand-500" : "text-gray-400"
                )}
            />
        </button>
    );
}

interface CategoryAccordionProps {
    category: CategoryGroup;
    isExpanded: boolean;
    onToggle: () => void;
    activeSectionId: string;
    onSectionClick: (sectionId: string) => void;
    isSectionComplete: (section: SchemaSection) => boolean;
    globalIndex: number;
}

function CategoryAccordion({
    category,
    isExpanded,
    onToggle,
    activeSectionId,
    onSectionClick,
    isSectionComplete,
    globalIndex,
}: CategoryAccordionProps) {
    const completedCount = category.sections.filter(isSectionComplete).length;
    const totalCount = category.sections.length;
    const allComplete = completedCount === totalCount;

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
            {/* Category Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {/* Category Status */}
                    <div
                        className={cx(
                            "flex size-7 items-center justify-center rounded-lg",
                            allComplete ? "bg-green-100" : "bg-gray-100"
                        )}
                    >
                        {allComplete ? (
                            <CheckCircle2 className="size-4 text-green-600" />
                        ) : (
                            <span className="text-xs font-semibold text-gray-500">
                                {completedCount}/{totalCount}
                            </span>
                        )}
                    </div>

                    {/* Category Name */}
                    <span className="text-sm font-semibold text-gray-900">{category.name}</span>
                </div>

                {/* Toggle Icon */}
                {isExpanded ? (
                    <ChevronUp className="size-4 text-gray-400" />
                ) : (
                    <ChevronDown className="size-4 text-gray-400" />
                )}
            </button>

            {/* Section List */}
            {isExpanded && (
                <div className="px-3 pb-3 space-y-1 border-t border-gray-100 pt-2">
                    {category.sections.map((section, idx) => (
                        <SectionItem
                            key={section.id}
                            section={section}
                            isActive={activeSectionId === section.id}
                            isComplete={isSectionComplete(section)}
                            onClick={() => onSectionClick(section.id)}
                            index={globalIndex + idx}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

interface QuestionnaireViewProps {
    inspectionId: string;
    initialData?: Record<string, string>;
    onDataChange?: (data: Record<string, string>) => void;
}

export function QuestionnaireView({
    inspectionId,
    initialData = {},
    onDataChange,
}: QuestionnaireViewProps) {
    // -------------------------------------------------------------------------
    // State
    // -------------------------------------------------------------------------
    const [formData, setFormData] = useState<Record<string, string>>(initialData);
    const [activeSectionId, setActiveSectionId] = useState(SCHEMA.sections[0]?.id || "");
    const [showValidation, setShowValidation] = useState(false);

    // Category expansion state - default all expanded
    const categories = useMemo(() => groupSectionsByCategory(SCHEMA.sections), []);
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
        new Set(categories.map((c) => c.name))
    );

    // -------------------------------------------------------------------------
    // Computed Values
    // -------------------------------------------------------------------------
    const allSections = SCHEMA.sections;
    const currentSection = allSections.find((s) => s.id === activeSectionId);
    const currentSectionIndex = allSections.findIndex((s) => s.id === activeSectionId);
    const isLastSection = currentSectionIndex === allSections.length - 1;
    const isFirstSection = currentSectionIndex === 0;

    // Count required fields remaining
    const requiredFieldsRemaining = useMemo(() => {
        let count = 0;
        for (const section of allSections) {
            for (const field of section.fields) {
                if (field.required) {
                    const value = formData[field.id] || "";
                    const isEmpty =
                        field.type === "TEXT" || field.type === "TEXTAREA"
                            ? !value.trim()
                            : field.type === "MULTI_SELECT"
                                ? !value || value.split(",").filter(Boolean).length === 0
                                : field.type === "PHOTO_ARRAY"
                                    ? parseInt(value, 10) < (field.photoConfig?.minPhotos || 1)
                                    : !value;
                    if (isEmpty) count++;
                }
            }
        }
        return count;
    }, [formData, allSections]);

    const completedSectionsCount = useMemo(() => {
        return allSections.filter((section) => isSectionComplete(section)).length;
    }, [formData, allSections]);

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------
    function isSectionComplete(section: SchemaSection): boolean {
        return section.fields
            .filter((f) => f.required)
            .every((f) => {
                const value = formData[f.id] || "";
                if (f.type === "TEXT" || f.type === "TEXTAREA") {
                    return value.trim() !== "";
                }
                if (f.type === "MULTI_SELECT") {
                    return value && value.split(",").filter(Boolean).length > 0;
                }
                if (f.type === "PHOTO_ARRAY") {
                    return parseInt(value, 10) >= (f.photoConfig?.minPhotos || 1);
                }
                return value !== "";
            });
    }

    // -------------------------------------------------------------------------
    // Handlers
    // -------------------------------------------------------------------------
    const handleFieldChange = (fieldId: string, value: string) => {
        const newData = { ...formData, [fieldId]: value };
        setFormData(newData);
        onDataChange?.(newData);
    };

    const handleToggleCategory = (categoryName: string) => {
        setExpandedCategories((prev) => {
            const next = new Set(prev);
            if (next.has(categoryName)) {
                next.delete(categoryName);
            } else {
                next.add(categoryName);
            }
            return next;
        });
    };

    const handleNextSection = () => {
        setShowValidation(true);
        if (!isLastSection) {
            setActiveSectionId(allSections[currentSectionIndex + 1].id);
        }
    };

    const handlePreviousSection = () => {
        if (!isFirstSection) {
            setActiveSectionId(allSections[currentSectionIndex - 1].id);
        }
    };

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------
    let globalSectionIndex = 0;

    return (
        <div className="space-y-6">
            {/* Progress Header */}
            <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-sm font-semibold text-gray-900">Origination Questionnaire</h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                            {completedSectionsCount} of {allSections.length} sections complete
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Required Fields Status */}
                        {requiredFieldsRemaining > 0 ? (
                            <div className="flex items-center gap-2 text-amber-600">
                                <AlertCircle className="size-4" />
                                <span className="text-sm font-medium">
                                    {requiredFieldsRemaining} required field{requiredFieldsRemaining !== 1 ? "s" : ""} remaining
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-green-600">
                                <CheckCircle2 className="size-4" />
                                <span className="text-sm font-medium">All required fields complete</span>
                            </div>
                        )}

                        {/* Progress Bar */}
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                            <div
                                className={cx(
                                    "h-full rounded-full transition-all",
                                    requiredFieldsRemaining === 0 ? "bg-green-500" : "bg-brand-600"
                                )}
                                style={{
                                    width: `${(completedSectionsCount / allSections.length) * 100}%`,
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Layout - 2 Column */}
            <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                {/* Left Sidebar - Categorized Navigation */}
                <div className="space-y-3">
                    {categories.map((category) => {
                        const accordion = (
                            <CategoryAccordion
                                key={category.name}
                                category={category}
                                isExpanded={expandedCategories.has(category.name)}
                                onToggle={() => handleToggleCategory(category.name)}
                                activeSectionId={activeSectionId}
                                onSectionClick={setActiveSectionId}
                                isSectionComplete={isSectionComplete}
                                globalIndex={globalSectionIndex}
                            />
                        );
                        globalSectionIndex += category.sections.length;
                        return accordion;
                    })}
                </div>

                {/* Right - Form Area */}
                <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                    {currentSection && (
                        <>
                            {/* Section Header */}
                            <div className="mb-6 border-b border-gray-200 pb-4">
                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                                    <span>{currentSection.category}</span>
                                    <ChevronRight className="size-3" />
                                    <span>Section {currentSectionIndex + 1} of {allSections.length}</span>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900">{currentSection.title}</h2>
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-6">
                                {currentSection.fields.map((field) => (
                                    <FormFieldWrapper
                                        key={field.id}
                                        field={field}
                                        value={formData[field.id] || ""}
                                        onChange={(value) => handleFieldChange(field.id, value)}
                                        showValidation={showValidation}
                                    />
                                ))}
                            </div>

                            {/* Footer Navigation */}
                            <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                                <button
                                    onClick={handlePreviousSection}
                                    disabled={isFirstSection}
                                    className={cx(
                                        "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                        isFirstSection
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "text-gray-700 hover:bg-gray-100"
                                    )}
                                >
                                    ← Previous Section
                                </button>

                                <button
                                    onClick={handleNextSection}
                                    className="px-5 py-2.5 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors"
                                >
                                    {isLastSection ? "Complete Questionnaire" : "Next Section →"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
