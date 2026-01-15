"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, Key, MapPin, Search, StickyNote, User } from "lucide-react";
import { SlideoutMenu } from "@/components/application/slideout-menus/slideout-menu";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { DatePicker } from "@/components/ui/date-picker";
import { cx } from "@/utils/cx";
import type { InspectionType, PriorityLevel } from "@/types";
import { INSPECTION_TYPE_OPTIONS, PRIORITY_OPTIONS, USERS } from "@/data/mock-data";

// ============================================================================
// Types
// ============================================================================

interface CreateInspectionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: InspectionFormData) => void;
}

export interface InspectionFormData {
    propertyId: string;
    propertyAddress: string; // Display only
    type: InspectionType | "";
    scheduledDate: string;
    scheduledTime: string;
    inspectorId: string;
    priority: PriorityLevel;
    accessInstructions: string;
    internalNotes: string;
}

// ============================================================================
// Options
// ============================================================================

// Get inspector list from centralized users
const INSPECTORS = Object.values(USERS)
    .filter((u) => u.role === "inspector")
    .map((u) => ({ id: u.id, name: u.fullName }));

// ============================================================================
// Custom Select Component
// ============================================================================

interface SelectFieldProps {
    label: string;
    value: string;
    options: readonly string[];
    placeholder: string;
    icon?: typeof User;
    searchable?: boolean;
    onChange: (value: string) => void;
}

const SelectField = ({ label, value, options, placeholder, icon: Icon, searchable = false, onChange }: SelectFieldProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredOptions = searchable && searchQuery
        ? options.filter((option) => option.toLowerCase().includes(searchQuery.toLowerCase()))
        : options;

    const handleClose = () => {
        setIsOpen(false);
        setSearchQuery("");
    };

    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-secondary">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cx(
                        "flex w-full items-center gap-2 rounded-lg bg-primary px-3 py-2.5 text-left shadow-xs ring-1 ring-primary transition-all ring-inset",
                        isOpen ? "ring-2 ring-brand" : "hover:ring-gray-300",
                        !value && "text-placeholder"
                    )}
                >
                    {Icon && <Icon className="size-5 text-fg-quaternary" />}
                    <span className={cx("flex-1 text-md", value ? "text-primary" : "text-placeholder")}>
                        {value || placeholder}
                    </span>
                    <ChevronDown
                        className={cx(
                            "size-5 text-fg-quaternary transition-transform",
                            isOpen && "rotate-180"
                        )}
                    />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={handleClose} />
                        <div className="absolute top-full left-0 z-20 mt-1 w-full rounded-lg border border-secondary bg-primary shadow-lg">
                            {/* Search Input (if searchable) */}
                            {searchable && (
                                <div className="border-b border-secondary p-2">
                                    <div className="relative">
                                        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full rounded-md border border-secondary bg-white py-1.5 pl-8 pr-3 text-sm text-primary placeholder:text-gray-400 focus:border-brand-300 focus:outline-none focus:ring-1 focus:ring-brand-100"
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Options List */}
                            <div className="max-h-48 overflow-y-auto py-1">
                                {filteredOptions.length === 0 ? (
                                    <p className="px-3 py-2 text-sm text-tertiary">No results found</p>
                                ) : (
                                    filteredOptions.map((option) => (
                                        <button
                                            key={option}
                                            type="button"
                                            onClick={() => {
                                                onChange(option);
                                                handleClose();
                                            }}
                                            className={cx(
                                                "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50",
                                                value === option
                                                    ? "bg-gray-50 font-medium text-primary"
                                                    : "text-secondary"
                                            )}
                                        >
                                            {option}
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

// ============================================================================
// Main Component
// ============================================================================

const DEFAULT_FORM_DATA: InspectionFormData = {
    propertyId: "",
    propertyAddress: "",
    type: "",
    scheduledDate: "",
    scheduledTime: "09:00",
    inspectorId: "",
    priority: "Standard",
    accessInstructions: "",
    internalNotes: "",
};

export const CreateInspectionSheet = ({ isOpen, onClose, onSubmit }: CreateInspectionSheetProps) => {
    const [formData, setFormData] = useState<InspectionFormData>(DEFAULT_FORM_DATA);

    const handleSubmit = () => {
        onSubmit?.(formData);
        // Reset form
        setFormData(DEFAULT_FORM_DATA);
        onClose();
    };

    // Get inspector name for display
    const getInspectorName = (id: string): string => {
        return INSPECTORS.find((i) => i.id === id)?.name || "";
    };

    const isFormValid =
        formData.propertyAddress &&
        formData.type &&
        formData.scheduledDate &&
        formData.inspectorId;

    return (
        <SlideoutMenu isOpen={isOpen} onOpenChange={(open) => !open && onClose()}>
            {({ close }) => (
                <>
                    {/* Header */}
                    <SlideoutMenu.Header onClose={close}>
                        <div className="pr-8">
                            <h2 className="text-lg font-semibold text-primary">
                                Schedule Inspection
                            </h2>
                            <p className="mt-1 text-sm text-tertiary">
                                Create a new property inspection order
                            </p>
                        </div>
                    </SlideoutMenu.Header>

                    {/* Content */}
                    <SlideoutMenu.Content>
                        <form className="space-y-6">
                            {/* Section: Property Details */}
                            <div>
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-tertiary">
                                    Property Details
                                </h3>
                                <div className="space-y-4">
                                    {/* Property Address */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-secondary">
                                            Property Address
                                        </label>
                                        <Input
                                            placeholder="Enter property address"
                                            icon={MapPin}
                                            value={formData.propertyAddress}
                                            onChange={(value) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    propertyAddress: value.toString(),
                                                }))
                                            }
                                        />
                                    </div>

                                    {/* Inspection Type */}
                                    <SelectField
                                        label="Inspection Type"
                                        value={formData.type}
                                        options={INSPECTION_TYPE_OPTIONS}
                                        placeholder="Select inspection type"
                                        onChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                type: value as InspectionType,
                                            }))
                                        }
                                    />
                                </div>
                            </div>

                            {/* Section: Scheduling */}
                            <div>
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-tertiary">
                                    Scheduling
                                </h3>
                                <div className="space-y-4">
                                    {/* Date */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-secondary">
                                            Inspection Date
                                        </label>
                                        <DatePicker
                                            value={formData.scheduledDate ? new Date(formData.scheduledDate) : null}
                                            onChange={(date) =>
                                                setFormData((prev) => ({
                                                    ...prev,
                                                    scheduledDate: date ? date.toISOString().split("T")[0] : "",
                                                }))
                                            }
                                            placeholder="Select inspection date"
                                        />
                                    </div>

                                    {/* Inspector */}
                                    <SelectField
                                        label="Assign Inspector"
                                        value={getInspectorName(formData.inspectorId)}
                                        options={INSPECTORS.map((i) => i.name)}
                                        placeholder="Select inspector"
                                        icon={User}
                                        searchable
                                        onChange={(value) => {
                                            const inspector = INSPECTORS.find((i) => i.name === value);
                                            setFormData((prev) => ({
                                                ...prev,
                                                inspectorId: inspector?.id || "",
                                            }));
                                        }}
                                    />

                                    {/* Priority */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-secondary">
                                            Priority
                                        </label>
                                        <div className="flex gap-2">
                                            {PRIORITY_OPTIONS.map((priority) => (
                                                <button
                                                    key={priority}
                                                    type="button"
                                                    onClick={() =>
                                                        setFormData((prev) => ({
                                                            ...prev,
                                                            priority,
                                                        }))
                                                    }
                                                    className={cx(
                                                        "flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                                                        formData.priority === priority
                                                            ? priority === "Urgent"
                                                                ? "border-amber-300 bg-amber-50 text-amber-700"
                                                                : "border-brand-300 bg-brand-50 text-brand-700"
                                                            : "border-secondary bg-primary text-secondary hover:bg-gray-50"
                                                    )}
                                                >
                                                    {priority === "Urgent" && (
                                                        <AlertTriangle className="size-4" />
                                                    )}
                                                    {priority}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Logistics */}
                            <div>
                                <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-tertiary">
                                    Logistics
                                </h3>
                                <div className="space-y-4">
                                    {/* Access Instructions */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-secondary">
                                            Access Instructions
                                        </label>
                                        <div className="relative">
                                            <Input
                                                placeholder="e.g., Lockbox 1234, call tenant first"
                                                icon={Key}
                                                value={formData.accessInstructions}
                                                onChange={(value) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        accessInstructions: value.toString(),
                                                    }))
                                                }
                                            />
                                        </div>
                                        <p className="text-xs text-tertiary">
                                            Entry codes, lockbox info, or special instructions
                                        </p>
                                    </div>

                                    {/* Internal Notes */}
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium text-secondary">
                                            Internal Notes
                                        </label>
                                        <div className="relative">
                                            <textarea
                                                value={formData.internalNotes}
                                                onChange={(e) =>
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        internalNotes: e.target.value,
                                                    }))
                                                }
                                                placeholder="Add any notes for the inspector..."
                                                rows={3}
                                                className="w-full rounded-lg bg-primary px-3 py-2.5 pl-10 text-md text-primary shadow-xs ring-1 ring-primary transition-all ring-inset placeholder:text-placeholder hover:ring-gray-300 focus:ring-2 focus:ring-brand focus:outline-none"
                                            />
                                            <StickyNote className="pointer-events-none absolute top-3 left-3 size-5 text-fg-quaternary" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Summary Preview */}
                            {isFormValid && (
                                <div className="rounded-lg bg-gray-50 p-4 ring-1 ring-secondary">
                                    <h4 className="text-sm font-medium text-secondary">
                                        Order Summary
                                    </h4>
                                    <dl className="mt-2 space-y-1 text-sm">
                                        <div className="flex justify-between">
                                            <dt className="text-tertiary">Property</dt>
                                            <dd className="font-medium text-primary">
                                                {formData.propertyAddress}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-tertiary">Type</dt>
                                            <dd className="font-medium text-primary">
                                                {formData.type}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-tertiary">Date</dt>
                                            <dd className="font-medium text-primary">
                                                {new Date(formData.scheduledDate).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-tertiary">Inspector</dt>
                                            <dd className="font-medium text-primary">
                                                {getInspectorName(formData.inspectorId)}
                                            </dd>
                                        </div>
                                        <div className="flex justify-between">
                                            <dt className="text-tertiary">Priority</dt>
                                            <dd className={cx(
                                                "font-medium",
                                                formData.priority === "Urgent"
                                                    ? "text-amber-600"
                                                    : "text-primary"
                                            )}>
                                                {formData.priority}
                                            </dd>
                                        </div>
                                        {formData.accessInstructions && (
                                            <div className="flex justify-between">
                                                <dt className="text-tertiary">Access</dt>
                                                <dd className="font-medium text-primary">
                                                    {formData.accessInstructions}
                                                </dd>
                                            </div>
                                        )}
                                    </dl>
                                </div>
                            )}
                        </form>
                    </SlideoutMenu.Content>

                    {/* Footer */}
                    <SlideoutMenu.Footer>
                        <div className="flex gap-3">
                            <Button
                                color="tertiary"
                                size="lg"
                                className="flex-1"
                                onClick={close}
                            >
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                size="lg"
                                className="flex-1"
                                isDisabled={!isFormValid}
                                onClick={handleSubmit}
                            >
                                Schedule Inspection
                            </Button>
                        </div>
                    </SlideoutMenu.Footer>
                </>
            )}
        </SlideoutMenu>
    );
};
