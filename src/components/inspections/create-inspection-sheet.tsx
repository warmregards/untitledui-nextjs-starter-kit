"use client";

import { useState } from "react";
import { Calendar, ChevronDown, MapPin, User, X } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

interface CreateInspectionSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit?: (data: InspectionFormData) => void;
}

interface InspectionFormData {
    address: string;
    type: string;
    date: string;
    inspector: string;
}

// ============================================================================
// Options
// ============================================================================

const INSPECTION_TYPES = ["Move-In", "Move-Out", "Annual"] as const;
const INSPECTORS = ["John Doe", "Sarah Miller", "Mike Johnson", "Emily Chen"] as const;

// ============================================================================
// Select Field Component
// ============================================================================

interface SelectFieldProps {
    label: string;
    value: string;
    options: readonly string[];
    placeholder: string;
    onChange: (value: string) => void;
}

const SelectField = ({ label, value, options, placeholder, onChange }: SelectFieldProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-secondary">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className={cx(
                        "flex w-full items-center justify-between rounded-lg bg-primary px-3 py-2.5 text-left shadow-xs ring-1 ring-primary transition-all ring-inset",
                        isOpen ? "ring-2 ring-brand" : "hover:ring-gray-300"
                    )}
                >
                    <span className={cx("text-md", value ? "text-primary" : "text-placeholder")}>
                        {value || placeholder}
                    </span>
                    <ChevronDown className={cx("size-5 text-fg-quaternary transition-transform", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                        <div className="absolute top-full left-0 z-20 mt-1 w-full rounded-lg border border-secondary bg-primary py-1 shadow-lg">
                            {options.map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => {
                                        onChange(option);
                                        setIsOpen(false);
                                    }}
                                    className={cx(
                                        "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50",
                                        value === option ? "bg-gray-50 font-medium text-primary" : "text-secondary"
                                    )}
                                >
                                    {option}
                                </button>
                            ))}
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

export const CreateInspectionSheet = ({ isOpen, onClose, onSubmit }: CreateInspectionSheetProps) => {
    const [formData, setFormData] = useState<InspectionFormData>({
        address: "",
        type: "",
        date: "",
        inspector: "",
    });

    const handleSubmit = () => {
        onSubmit?.(formData);
        setFormData({ address: "", type: "", date: "", inspector: "" });
        onClose();
    };

    const isFormValid = formData.address && formData.type && formData.date && formData.inspector;

    return (
        <>
            {/* Backdrop */}
            <div
                className={cx(
                    "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
                    isOpen ? "opacity-100" : "pointer-events-none opacity-0"
                )}
                onClick={onClose}
            />

            {/* Sheet */}
            <div
                className={cx(
                    "fixed inset-y-0 right-0 z-50 flex h-full w-full max-w-md flex-col bg-primary shadow-xl transition-transform duration-300 ease-out",
                    isOpen ? "translate-x-0" : "translate-x-full"
                )}
            >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-secondary px-6 py-5">
                    <div>
                        <h2 className="text-lg font-semibold text-primary">New Inspection Order</h2>
                        <p className="mt-1 text-sm text-tertiary">Schedule a new property inspection</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <form className="space-y-5">
                        {/* Address */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-secondary">Property Address</label>
                            <Input
                                placeholder="Enter property address"
                                icon={MapPin}
                                value={formData.address}
                                onChange={(value) => setFormData((prev) => ({ ...prev, address: value.toString() }))}
                            />
                        </div>

                        {/* Inspection Type */}
                        <SelectField
                            label="Inspection Type"
                            value={formData.type}
                            options={INSPECTION_TYPES}
                            placeholder="Select type"
                            onChange={(value) => setFormData((prev) => ({ ...prev, type: value }))}
                        />

                        {/* Date */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-secondary">Inspection Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData((prev) => ({ ...prev, date: e.target.value }))}
                                    className="w-full rounded-lg bg-primary px-3 py-2.5 text-md text-primary shadow-xs ring-1 ring-primary transition-all ring-inset hover:ring-gray-300 focus:ring-2 focus:ring-brand focus:outline-none"
                                />
                                <Calendar className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-fg-quaternary" />
                            </div>
                        </div>

                        {/* Inspector */}
                        <SelectField
                            label="Assign Inspector"
                            value={formData.inspector}
                            options={INSPECTORS}
                            placeholder="Select inspector"
                            onChange={(value) => setFormData((prev) => ({ ...prev, inspector: value }))}
                        />

                        {/* Summary */}
                        {isFormValid && (
                            <div className="rounded-lg bg-gray-50 p-4 ring-1 ring-secondary">
                                <h4 className="text-sm font-medium text-secondary">Order Summary</h4>
                                <dl className="mt-2 space-y-1 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-tertiary">Property</dt>
                                        <dd className="font-medium text-primary">{formData.address}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-tertiary">Type</dt>
                                        <dd className="font-medium text-primary">{formData.type}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-tertiary">Date</dt>
                                        <dd className="font-medium text-primary">
                                            {new Date(formData.date).toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-tertiary">Inspector</dt>
                                        <dd className="font-medium text-primary">{formData.inspector}</dd>
                                    </div>
                                </dl>
                            </div>
                        )}
                    </form>
                </div>

                {/* Footer */}
                <div className="flex gap-3 border-t border-secondary p-6">
                    <Button color="tertiary" size="lg" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        size="lg"
                        className="flex-1"
                        isDisabled={!isFormValid}
                        onClick={handleSubmit}
                    >
                        Create Order
                    </Button>
                </div>
            </div>
        </>
    );
};
