"use client";

import { useState } from "react";
import {
    AlertOctagon,
    Calendar,
    Camera,
    CheckCircle2,
    ChevronRight,
    ImagePlus,
    Upload,
    X,
} from "lucide-react";
import { Badge } from "@/components/base/badges/badges";
import { cx } from "@/utils/cx";
import type {
    InspectionTemplate,
    TemplateSection,
    TemplateField,
    FieldType,
    TemplateValidationLevel,
} from "@/types";

// =============================================================================
// Types
// =============================================================================

interface DynamicFormProps {
    template: InspectionTemplate;
    data: Record<string, unknown>;
    onChange: (fieldId: string, value: unknown) => void;
    showValidation?: boolean;
    readOnly?: boolean;
}

interface FieldRendererProps {
    field: TemplateField;
    value: unknown;
    onChange: (value: unknown) => void;
    showValidation: boolean;
    readOnly?: boolean;
}

// =============================================================================
// Validation Helpers
// =============================================================================

const isFieldEmpty = (value: unknown, fieldType: FieldType): boolean => {
    if (value === undefined || value === null) return true;
    if (typeof value === "string" && value.trim() === "") return true;
    if (Array.isArray(value) && value.length === 0) return true;
    return false;
};

const ValidationIndicator = ({ level }: { level: TemplateValidationLevel }) => {
    if (level === "BLOCKER") {
        return (
            <span className="ml-1 inline-flex items-center gap-1 text-error-500">
                <AlertOctagon className="size-3" />
                <span className="text-[10px] font-medium uppercase">Blocker</span>
            </span>
        );
    }
    return null;
};

// =============================================================================
// Field Components
// =============================================================================

// --- Text Input ---
const TextFieldRenderer = ({ field, value, onChange, showValidation, readOnly }: FieldRendererProps) => {
    const isEmpty = isFieldEmpty(value, field.type);
    const showError = showValidation && field.required && isEmpty;
    const stringValue = typeof value === "string" ? value : "";

    return (
        <input
            type="text"
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={readOnly}
            className={cx(
                "w-full rounded-lg border bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary transition-all",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                "disabled:bg-gray-50 disabled:text-tertiary disabled:cursor-not-allowed",
                showError
                    ? "border-error-500 ring-1 ring-error-500"
                    : "border-secondary hover:border-gray-400"
            )}
        />
    );
};

// --- Number Input ---
const NumberFieldRenderer = ({ field, value, onChange, showValidation, readOnly }: FieldRendererProps) => {
    const isEmpty = isFieldEmpty(value, field.type);
    const showError = showValidation && field.required && isEmpty;
    const numValue = typeof value === "number" ? value : (typeof value === "string" ? value : "");

    return (
        <input
            type="number"
            value={numValue}
            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : "")}
            placeholder={field.placeholder}
            disabled={readOnly}
            min={field.validation?.min}
            max={field.validation?.max}
            className={cx(
                "w-full rounded-lg border bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary transition-all",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                "disabled:bg-gray-50 disabled:text-tertiary disabled:cursor-not-allowed",
                showError
                    ? "border-error-500 ring-1 ring-error-500"
                    : "border-secondary hover:border-gray-400"
            )}
        />
    );
};

// --- Textarea ---
const TextareaFieldRenderer = ({ field, value, onChange, showValidation, readOnly }: FieldRendererProps) => {
    const isEmpty = isFieldEmpty(value, field.type);
    const showError = showValidation && field.required && isEmpty;
    const stringValue = typeof value === "string" ? value : "";

    return (
        <textarea
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            disabled={readOnly}
            rows={4}
            className={cx(
                "w-full rounded-lg border bg-primary px-3.5 py-2.5 text-sm text-primary placeholder:text-tertiary transition-all resize-none",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                "disabled:bg-gray-50 disabled:text-tertiary disabled:cursor-not-allowed",
                showError
                    ? "border-error-500 ring-1 ring-error-500"
                    : "border-secondary hover:border-gray-400"
            )}
        />
    );
};

// --- Select Dropdown ---
const SelectFieldRenderer = ({ field, value, onChange, showValidation, readOnly }: FieldRendererProps) => {
    const isEmpty = isFieldEmpty(value, field.type);
    const showError = showValidation && field.required && isEmpty;
    const stringValue = typeof value === "string" ? value : "";

    return (
        <select
            value={stringValue}
            onChange={(e) => onChange(e.target.value)}
            disabled={readOnly}
            className={cx(
                "w-full rounded-lg border bg-primary px-3.5 py-2.5 text-sm transition-all appearance-none cursor-pointer",
                "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                "disabled:bg-gray-50 disabled:text-tertiary disabled:cursor-not-allowed",
                !stringValue ? "text-tertiary" : "text-primary",
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

// --- Date Picker ---
const DateFieldRenderer = ({ field, value, onChange, showValidation, readOnly }: FieldRendererProps) => {
    const isEmpty = isFieldEmpty(value, field.type);
    const showError = showValidation && field.required && isEmpty;
    const stringValue = typeof value === "string" ? value : "";

    return (
        <div className="relative">
            <input
                type="date"
                value={stringValue}
                onChange={(e) => onChange(e.target.value)}
                disabled={readOnly}
                className={cx(
                    "w-full rounded-lg border bg-primary px-3.5 py-2.5 text-sm text-primary transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
                    "disabled:bg-gray-50 disabled:text-tertiary disabled:cursor-not-allowed",
                    showError
                        ? "border-error-500 ring-1 ring-error-500"
                        : "border-secondary hover:border-gray-400"
                )}
            />
            <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
        </div>
    );
};

// --- MBA Rating (1-5 + NA/NX) ---
const RatingFieldRenderer = ({ field, value, onChange, showValidation, readOnly }: FieldRendererProps) => {
    const isEmpty = isFieldEmpty(value, field.type);
    const showError = showValidation && field.required && isEmpty;
    const stringValue = typeof value === "string" ? value : "";

    const ratings = ["1", "2", "3", "4", "5"];
    const specialRatings = ["NA", "NX"];

    const getRatingColor = (rating: string) => {
        switch (rating) {
            case "1":
                return "bg-error-500 text-white border-error-500";
            case "2":
                return "bg-orange-500 text-white border-orange-500";
            case "3":
                return "bg-amber-500 text-white border-amber-500";
            case "4":
                return "bg-lime-500 text-white border-lime-500";
            case "5":
                return "bg-success-500 text-white border-success-500";
            case "NA":
            case "NX":
                return "bg-gray-500 text-white border-gray-500";
            default:
                return "";
        }
    };

    const getRatingLabel = (rating: string) => {
        switch (rating) {
            case "1":
                return "Poor";
            case "2":
                return "Below Avg";
            case "3":
                return "Average";
            case "4":
                return "Good";
            case "5":
                return "Excellent";
            case "NA":
                return "Not Applicable";
            case "NX":
                return "Not Examined";
            default:
                return "";
        }
    };

    return (
        <div className="space-y-2">
            <div className={cx(
                "flex flex-wrap gap-2 p-3 rounded-lg border transition-colors",
                showError ? "border-error-500 bg-error-50" : "border-secondary bg-gray-50"
            )}>
                {/* Numeric Ratings 1-5 */}
                <div className="flex gap-1">
                    {ratings.map((rating) => (
                        <button
                            key={rating}
                            type="button"
                            onClick={() => !readOnly && onChange(rating)}
                            disabled={readOnly}
                            title={getRatingLabel(rating)}
                            className={cx(
                                "flex size-10 items-center justify-center rounded-lg border-2 text-sm font-bold transition-all",
                                "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                                stringValue === rating
                                    ? getRatingColor(rating)
                                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                            )}
                        >
                            {rating}
                        </button>
                    ))}
                </div>

                {/* Divider */}
                <div className="w-px bg-gray-300 mx-1" />

                {/* Special Ratings NA/NX */}
                <div className="flex gap-1">
                    {specialRatings.map((rating) => (
                        <button
                            key={rating}
                            type="button"
                            onClick={() => !readOnly && onChange(rating)}
                            disabled={readOnly}
                            title={getRatingLabel(rating)}
                            className={cx(
                                "flex h-10 px-3 items-center justify-center rounded-lg border-2 text-xs font-bold transition-all",
                                "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-1",
                                "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
                                stringValue === rating
                                    ? getRatingColor(rating)
                                    : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                            )}
                        >
                            {rating}
                        </button>
                    ))}
                </div>
            </div>

            {/* Rating Legend */}
            {stringValue && (
                <div className="flex items-center gap-2 text-xs text-tertiary">
                    <span className={cx(
                        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-medium",
                        getRatingColor(stringValue)
                    )}>
                        {stringValue}
                    </span>
                    <span>= {getRatingLabel(stringValue)}</span>
                </div>
            )}
        </div>
    );
};

// --- Photo Array Upload ---
const PhotoArrayFieldRenderer = ({ field, value, onChange, showValidation, readOnly }: FieldRendererProps) => {
    const photos = Array.isArray(value) ? value : [];
    const isEmpty = photos.length === 0;
    const showError = showValidation && field.required && isEmpty;

    const handleRemovePhoto = (index: number) => {
        const newPhotos = [...photos];
        newPhotos.splice(index, 1);
        onChange(newPhotos);
    };

    // Mock photo upload - in real app this would trigger file picker
    const handleAddPhoto = () => {
        if (readOnly) return;
        // Mock: add a placeholder photo URL
        const mockUrls = [
            "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=200&fit=crop",
            "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200&h=200&fit=crop",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=200&h=200&fit=crop",
        ];
        const randomUrl = mockUrls[Math.floor(Math.random() * mockUrls.length)];
        onChange([...photos, randomUrl]);
    };

    return (
        <div className="space-y-3">
            {/* Photo Grid */}
            {photos.length > 0 && (
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
                    {photos.map((photo, index) => (
                        <div
                            key={index}
                            className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 ring-1 ring-secondary"
                        >
                            <img
                                src={photo as string}
                                alt={`Photo ${index + 1}`}
                                className="size-full object-cover"
                            />
                            {!readOnly && (
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(index)}
                                    className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-error-500 text-white shadow-sm transition-transform hover:scale-110"
                                >
                                    <X className="size-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Upload Zone */}
            <button
                type="button"
                onClick={handleAddPhoto}
                disabled={readOnly}
                className={cx(
                    "flex w-full items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition-colors",
                    "disabled:opacity-50 disabled:cursor-not-allowed",
                    showError
                        ? "border-error-500 bg-error-50 hover:bg-error-100"
                        : "border-gray-300 bg-gray-50 hover:border-brand-400 hover:bg-brand-50"
                )}
            >
                <div className={cx(
                    "flex size-10 items-center justify-center rounded-full",
                    showError ? "bg-error-100" : "bg-gray-200"
                )}>
                    <ImagePlus className={cx("size-5", showError ? "text-error-600" : "text-gray-500")} />
                </div>
                <div className="text-left">
                    <p className={cx("text-sm font-medium", showError ? "text-error-700" : "text-secondary")}>
                        {photos.length === 0 ? "Upload Photos" : "Add More Photos"}
                    </p>
                    <p className="text-xs text-tertiary">
                        Click to add photos • {photos.length} uploaded
                    </p>
                </div>
            </button>
        </div>
    );
};

// --- Checkbox ---
const CheckboxFieldRenderer = ({ field, value, onChange, showValidation, readOnly }: FieldRendererProps) => {
    const checked = value === true || value === "true";

    return (
        <label className="flex items-center gap-3 cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
                disabled={readOnly}
                className={cx(
                    "size-5 rounded border-gray-300 text-brand-600 transition-colors",
                    "focus:ring-2 focus:ring-brand-500 focus:ring-offset-1",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
            />
            <span className="text-sm text-secondary">{field.placeholder || "Yes"}</span>
        </label>
    );
};

// --- Radio Group ---
const RadioFieldRenderer = ({ field, value, onChange, showValidation, readOnly }: FieldRendererProps) => {
    const isEmpty = isFieldEmpty(value, field.type);
    const showError = showValidation && field.required && isEmpty;
    const stringValue = typeof value === "string" ? value : "";

    return (
        <div className={cx(
            "space-y-2 p-3 rounded-lg border transition-colors",
            showError ? "border-error-500 bg-error-50" : "border-secondary bg-gray-50"
        )}>
            {field.options?.map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="radio"
                        name={field.id}
                        value={option.value}
                        checked={stringValue === option.value}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={readOnly}
                        className={cx(
                            "size-4 border-gray-300 text-brand-600 transition-colors",
                            "focus:ring-2 focus:ring-brand-500",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    />
                    <span className="text-sm text-secondary">{option.label}</span>
                </label>
            ))}
        </div>
    );
};

// =============================================================================
// Field Wrapper Component
// =============================================================================

interface FormFieldWrapperProps {
    field: TemplateField;
    value: unknown;
    onChange: (value: unknown) => void;
    showValidation: boolean;
    readOnly?: boolean;
}

const FormFieldWrapper = ({ field, value, onChange, showValidation, readOnly }: FormFieldWrapperProps) => {
    const isEmpty = isFieldEmpty(value, field.type);
    const showError = showValidation && field.required && isEmpty;

    const renderField = () => {
        const props: FieldRendererProps = { field, value, onChange, showValidation, readOnly };

        switch (field.type) {
            case "TEXT":
                return <TextFieldRenderer {...props} />;
            case "NUMBER":
                return <NumberFieldRenderer {...props} />;
            case "TEXTAREA":
                return <TextareaFieldRenderer {...props} />;
            case "SELECT":
                return <SelectFieldRenderer {...props} />;
            case "DATE":
                return <DateFieldRenderer {...props} />;
            case "RATING_1_5":
                return <RatingFieldRenderer {...props} />;
            case "PHOTO_ARRAY":
                return <PhotoArrayFieldRenderer {...props} />;
            case "CHECKBOX":
                return <CheckboxFieldRenderer {...props} />;
            case "RADIO":
                return <RadioFieldRenderer {...props} />;
            default:
                return <TextFieldRenderer {...props} />;
        }
    };

    return (
        <div className="space-y-1.5">
            {/* Label Row */}
            <div className="flex items-center flex-wrap gap-x-2">
                <label className="text-sm font-medium text-primary">
                    {field.label}
                    {field.required && <span className="text-error-500 ml-0.5">*</span>}
                </label>
                {field.validationLevel === "BLOCKER" && (
                    <ValidationIndicator level="BLOCKER" />
                )}
            </div>

            {/* Help Text */}
            {field.helpText && (
                <p className="text-xs text-tertiary">{field.helpText}</p>
            )}

            {/* Field */}
            {renderField()}

            {/* Error Message */}
            {showError && (
                <p className="text-xs text-error-500 flex items-center gap-1">
                    <AlertOctagon className="size-3" />
                    This field is required
                </p>
            )}
        </div>
    );
};

// =============================================================================
// Section Tab Component
// =============================================================================

interface SectionTabProps {
    section: TemplateSection;
    index: number;
    isActive: boolean;
    isComplete: boolean;
    hasBlockers: boolean;
    onClick: () => void;
}

const SectionTab = ({ section, index, isActive, isComplete, hasBlockers, onClick }: SectionTabProps) => {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cx(
                "w-full flex items-center gap-3 px-4 py-3 text-left rounded-lg transition-all",
                isActive
                    ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200 shadow-sm"
                    : "hover:bg-gray-50 text-secondary"
            )}
        >
            {/* Status Icon */}
            <div
                className={cx(
                    "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isComplete && !hasBlockers
                        ? "bg-success-100"
                        : hasBlockers
                            ? "bg-error-100"
                            : isActive
                                ? "bg-brand-100"
                                : "bg-gray-100"
                )}
            >
                {isComplete && !hasBlockers ? (
                    <CheckCircle2 className="size-4 text-success-600" />
                ) : hasBlockers ? (
                    <AlertOctagon className="size-4 text-error-600" />
                ) : (
                    <span className={cx(
                        "text-xs font-semibold",
                        isActive ? "text-brand-600" : "text-gray-500"
                    )}>
                        {index + 1}
                    </span>
                )}
            </div>

            {/* Section Info */}
            <div className="flex-1 min-w-0">
                <p className={cx(
                    "text-sm font-medium truncate",
                    isActive ? "text-brand-700" : "text-primary"
                )}>
                    {section.title}
                </p>
                <p className="text-xs text-tertiary truncate">
                    {section.fields.length} fields
                </p>
            </div>

            {/* Arrow */}
            <ChevronRight
                className={cx(
                    "size-4 shrink-0 transition-transform",
                    isActive ? "text-brand-500 rotate-90" : "text-gray-400"
                )}
            />
        </button>
    );
};

// =============================================================================
// Main Dynamic Form Component
// =============================================================================

export function DynamicForm({
    template,
    data,
    onChange,
    showValidation = false,
    readOnly = false,
}: DynamicFormProps) {
    const [activeSection, setActiveSection] = useState(template.sections[0]?.id || "");

    // Calculate section completion status
    const getSectionStatus = (section: TemplateSection) => {
        const requiredFields = section.fields.filter((f) => f.required);
        const blockerFields = section.fields.filter((f) => f.required && f.validationLevel === "BLOCKER");

        const isComplete = requiredFields.every((f) => !isFieldEmpty(data[f.id], f.type));
        const hasBlockers = blockerFields.some((f) => isFieldEmpty(data[f.id], f.type));

        return { isComplete, hasBlockers };
    };

    // Overall progress calculation
    const totalFields = template.sections.flatMap((s) => s.fields.filter((f) => f.required)).length;
    const completedFields = template.sections.flatMap((s) =>
        s.fields.filter((f) => f.required && !isFieldEmpty(data[f.id], f.type))
    ).length;
    const progress = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0;

    // Total blockers count
    const totalBlockers = template.sections.reduce((count, section) => {
        return count + section.fields.filter((f) =>
            f.required &&
            f.validationLevel === "BLOCKER" &&
            isFieldEmpty(data[f.id], f.type)
        ).length;
    }, 0);

    const currentSection = template.sections.find((s) => s.id === activeSection);
    const currentSectionIndex = template.sections.findIndex((s) => s.id === activeSection);

    return (
        <div className="space-y-6">
            {/* Progress Header */}
            <div className="flex items-center justify-between rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary">
                <div>
                    <h3 className="text-sm font-semibold text-primary">{template.title}</h3>
                    <p className="text-xs text-tertiary mt-0.5">
                        {completedFields} of {totalFields} required fields complete
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    {totalBlockers > 0 && (
                        <div className="flex items-center gap-2 text-error-600">
                            <AlertOctagon className="size-4" />
                            <span className="text-sm font-medium">
                                {totalBlockers} blocker{totalBlockers !== 1 ? "s" : ""}
                            </span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-32 overflow-hidden rounded-full bg-gray-200">
                            <div
                                className={cx(
                                    "h-full rounded-full transition-all",
                                    progress === 100 ? "bg-success-500" : "bg-brand-600"
                                )}
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="text-xs font-medium text-tertiary">{progress}%</span>
                    </div>
                </div>
            </div>

            {/* Main Layout */}
            <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                {/* Section Tabs */}
                <div className="space-y-2">
                    {template.sections.map((section, index) => {
                        const { isComplete, hasBlockers } = getSectionStatus(section);
                        return (
                            <SectionTab
                                key={section.id}
                                section={section}
                                index={index}
                                isActive={activeSection === section.id}
                                isComplete={isComplete}
                                hasBlockers={hasBlockers}
                                onClick={() => setActiveSection(section.id)}
                            />
                        );
                    })}
                </div>

                {/* Form Area */}
                <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
                    {currentSection && (
                        <>
                            {/* Section Header */}
                            <div className="mb-6 border-b border-secondary pb-4">
                                <div className="flex items-center gap-2">
                                    <span className="flex size-6 items-center justify-center rounded bg-brand-100 text-xs font-semibold text-brand-700">
                                        {currentSectionIndex + 1}
                                    </span>
                                    <h2 className="text-lg font-semibold text-primary">
                                        {currentSection.title}
                                    </h2>
                                </div>
                                {currentSection.description && (
                                    <p className="mt-2 text-sm text-tertiary">
                                        {currentSection.description}
                                    </p>
                                )}
                            </div>

                            {/* Fields */}
                            <div className="space-y-6">
                                {currentSection.fields.map((field) => (
                                    <FormFieldWrapper
                                        key={field.id}
                                        field={field}
                                        value={data[field.id]}
                                        onChange={(value) => onChange(field.id, value)}
                                        showValidation={showValidation}
                                        readOnly={readOnly}
                                    />
                                ))}
                            </div>

                            {/* Section Navigation */}
                            <div className="mt-8 flex items-center justify-between border-t border-secondary pt-6">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (currentSectionIndex > 0) {
                                            setActiveSection(template.sections[currentSectionIndex - 1].id);
                                        }
                                    }}
                                    disabled={currentSectionIndex === 0}
                                    className={cx(
                                        "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                        currentSectionIndex === 0
                                            ? "text-gray-300 cursor-not-allowed"
                                            : "text-secondary hover:bg-gray-100"
                                    )}
                                >
                                    ← Previous
                                </button>

                                <span className="text-xs text-tertiary">
                                    Section {currentSectionIndex + 1} of {template.sections.length}
                                </span>

                                <button
                                    type="button"
                                    onClick={() => {
                                        if (currentSectionIndex < template.sections.length - 1) {
                                            setActiveSection(template.sections[currentSectionIndex + 1].id);
                                        }
                                    }}
                                    disabled={currentSectionIndex === template.sections.length - 1}
                                    className={cx(
                                        "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                                        currentSectionIndex === template.sections.length - 1
                                            ? "bg-success-600 text-white hover:bg-success-700"
                                            : "bg-brand-600 text-white hover:bg-brand-700"
                                    )}
                                >
                                    {currentSectionIndex === template.sections.length - 1
                                        ? "Complete"
                                        : "Next →"}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

// =============================================================================
// Exports
// =============================================================================

export default DynamicForm;
