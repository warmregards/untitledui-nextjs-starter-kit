"use client";

import { useState, useEffect } from "react";
import {
    Building2,
    Image,
    Key,
    Lock,
    Mail,
    MapPin,
    StickyNote,
    User,
    X,
} from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { DatePicker } from "@/components/ui/date-picker";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

export interface PropertyFormData {
    // Asset Details
    address: string;
    city: string;
    state: string;
    zip: string;
    imageUrl: string;
    // People
    ownerName: string;
    ownerEmail: string;
    tenantName: string;
    leaseEndDate: string;
    // Access
    lockboxCode: string;
    alarmCode: string;
    accessNotes: string;
}

export interface PropertyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: "add" | "edit";
    initialData?: Partial<PropertyFormData>;
    onSubmit?: (data: PropertyFormData) => void;
}

// ============================================================================
// Default Values
// ============================================================================

const DEFAULT_FORM_DATA: PropertyFormData = {
    address: "",
    city: "",
    state: "",
    zip: "",
    imageUrl: "",
    ownerName: "",
    ownerEmail: "",
    tenantName: "",
    leaseEndDate: "",
    lockboxCode: "",
    alarmCode: "",
    accessNotes: "",
};

// ============================================================================
// Component
// ============================================================================

export function PropertyFormModal({
    isOpen,
    onClose,
    mode,
    initialData,
    onSubmit,
}: PropertyFormModalProps) {
    const [formData, setFormData] = useState<PropertyFormData>(DEFAULT_FORM_DATA);

    // Reset form when modal opens/closes or initialData changes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                ...DEFAULT_FORM_DATA,
                ...initialData,
            });
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleChange = (field: keyof PropertyFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        onSubmit?.(formData);
        onClose();
    };

    const isFormValid =
        formData.address.trim() !== "" &&
        formData.city.trim() !== "" &&
        formData.ownerName.trim() !== "";

    return (
        <>
            {/* Overlay */}
            <div className="fixed inset-0 z-[100] bg-black/50" onClick={onClose} />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 z-[100] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-secondary p-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-brand-50 p-2">
                            <Building2 className="size-5 text-brand-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-primary">
                                {mode === "add" ? "Add New Property" : "Edit Property"}
                            </h2>
                            <p className="text-sm text-tertiary">
                                {mode === "add"
                                    ? "Enter property details below"
                                    : "Update property information"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="max-h-[60vh] overflow-y-auto p-5">
                    {/* Asset Details Section */}
                    <div className="mb-6">
                        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-tertiary">
                            <MapPin className="size-4" />
                            Asset Details
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-secondary">
                                    Street Address <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="123 N Michigan Ave"
                                    value={formData.address}
                                    onChange={(v) => handleChange("address", v.toString())}
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-secondary">
                                    City <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="Chicago"
                                    value={formData.city}
                                    onChange={(v) => handleChange("city", v.toString())}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-secondary">
                                        State
                                    </label>
                                    <Input
                                        placeholder="IL"
                                        value={formData.state}
                                        onChange={(v) => handleChange("state", v.toString())}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-secondary">
                                        Zip Code
                                    </label>
                                    <Input
                                        placeholder="60601"
                                        value={formData.zip}
                                        onChange={(v) => handleChange("zip", v.toString())}
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-secondary">
                                    Property Image URL
                                </label>
                                <div className="relative">
                                    <Input
                                        placeholder="https://images.unsplash.com/..."
                                        icon={Image}
                                        value={formData.imageUrl}
                                        onChange={(v) => handleChange("imageUrl", v.toString())}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* People Section */}
                    <div className="mb-6">
                        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-tertiary">
                            <User className="size-4" />
                            People
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-secondary">
                                    Owner Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    placeholder="Robert Chen"
                                    value={formData.ownerName}
                                    onChange={(v) => handleChange("ownerName", v.toString())}
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-secondary">
                                    Owner Email
                                </label>
                                <Input
                                    placeholder="robert@example.com"
                                    icon={Mail}
                                    value={formData.ownerEmail}
                                    onChange={(v) => handleChange("ownerEmail", v.toString())}
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-secondary">
                                    Tenant Name
                                </label>
                                <Input
                                    placeholder="Jessica Martinez"
                                    value={formData.tenantName}
                                    onChange={(v) => handleChange("tenantName", v.toString())}
                                />
                            </div>
                            <div>
                                <label className="mb-1.5 block text-sm font-medium text-secondary">
                                    Lease End Date
                                </label>
                                <DatePicker
                                    value={formData.leaseEndDate ? new Date(formData.leaseEndDate) : null}
                                    onChange={(date) =>
                                        handleChange(
                                            "leaseEndDate",
                                            date ? date.toISOString().split("T")[0] : ""
                                        )
                                    }
                                    placeholder="Select lease end date"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Access Section */}
                    <div>
                        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-tertiary">
                            <Key className="size-4" />
                            Access Information
                        </h3>
                        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-secondary">
                                        Lockbox / Entry Code
                                    </label>
                                    <Input
                                        placeholder="4589"
                                        icon={Key}
                                        value={formData.lockboxCode}
                                        onChange={(v) => handleChange("lockboxCode", v.toString())}
                                    />
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-secondary">
                                        Alarm Code
                                    </label>
                                    <Input
                                        placeholder="9911"
                                        icon={Lock}
                                        value={formData.alarmCode}
                                        onChange={(v) => handleChange("alarmCode", v.toString())}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-secondary">
                                        Access Notes
                                    </label>
                                    <div className="relative">
                                        <StickyNote className="absolute left-3 top-3 size-5 text-gray-400" />
                                        <textarea
                                            placeholder="Dog in yard. Ring doorbell first."
                                            value={formData.accessNotes}
                                            onChange={(e) => handleChange("accessNotes", e.target.value)}
                                            rows={3}
                                            className="w-full rounded-lg bg-white pl-10 pr-3 py-2.5 text-md text-primary shadow-xs ring-1 ring-gray-300 transition-all ring-inset placeholder:text-gray-400 hover:ring-gray-400 focus:ring-2 focus:ring-brand focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 border-t border-secondary p-5">
                    <Button color="tertiary" size="lg" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        size="lg"
                        onClick={handleSubmit}
                        isDisabled={!isFormValid}
                    >
                        {mode === "add" ? "Add Property" : "Save Changes"}
                    </Button>
                </div>
            </div>
        </>
    );
}

export default PropertyFormModal;
