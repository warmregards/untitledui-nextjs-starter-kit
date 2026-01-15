"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import {
    Calendar,
    Check,
    ChevronDown,
    ClipboardList,
    Clock,
    FileSignature,
    MapPin,
    Search,
    X,
} from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

type WorkflowType = "origination" | "servicing" | null;

interface Inspector {
    id: string;
    fullName: string;
    avatar: string;
    distance: string;
    available: boolean;
}

interface FormData {
    workflow: WorkflowType;
    propertyAddress: string;
    date: string;
    time: string;
    inspectorId: string | null;
    // Origination-specific
    loanNumber: string;
    borrowerName: string;
    // Servicing-specific
    propertyManagerName: string;
    yearBuilt: string;
}

interface ScheduleInspectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: FormData) => void;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_INSPECTORS: Inspector[] = [
    { id: "insp-1", fullName: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", distance: "2.3 mi", available: true },
    { id: "insp-2", fullName: "Michael Torres", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", distance: "5.2 mi", available: true },
    { id: "insp-3", fullName: "Emily Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", distance: "7.8 mi", available: true },
    { id: "insp-4", fullName: "James Wilson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", distance: "12.1 mi", available: false },
    { id: "insp-5", fullName: "Amanda Rodriguez", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop", distance: "15.4 mi", available: true },
    { id: "insp-6", fullName: "David Kim", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop", distance: "18.7 mi", available: true },
];

// ============================================================================
// Workflow Selection Cards (Accessible)
// ============================================================================

interface WorkflowCardProps {
    type: "origination" | "servicing";
    selected: boolean;
    onClick: () => void;
}

function WorkflowCard({ type, selected, onClick }: WorkflowCardProps) {
    const isOrigination = type === "origination";
    const Icon = isOrigination ? FileSignature : ClipboardList;
    const title = isOrigination ? "Origination" : "Servicing";
    const description = isOrigination
        ? "Pre-funding inspection for new loans"
        : "Ongoing property condition assessment";

    return (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            aria-label={`${title} inspection type. ${description}${selected ? ". Currently selected" : ""}`}
            className={cx(
                "relative flex flex-col items-start p-4 rounded-xl border-2 text-left transition-all",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                selected
                    ? "bg-brand-50 border-brand-500"
                    : "bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            )}
        >
            {/* Selected Checkmark Badge */}
            {selected && (
                <div className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-brand-500" aria-hidden="true">
                    <Check className="size-3 text-white" />
                </div>
            )}

            {/* Icon */}
            <div
                className={cx(
                    "flex size-10 items-center justify-center rounded-lg",
                    selected ? "bg-brand-100" : "bg-gray-100"
                )}
                aria-hidden="true"
            >
                <Icon
                    className={cx(
                        "size-5",
                        selected ? "text-brand-600" : "text-gray-500"
                    )}
                />
            </div>

            {/* Title */}
            <span
                className={cx(
                    "mt-3 text-sm font-semibold",
                    selected ? "text-brand-700" : "text-gray-900"
                )}
            >
                {title}
            </span>

            {/* Description */}
            <span
                className={cx(
                    "mt-1 text-xs",
                    selected ? "text-brand-600" : "text-gray-500"
                )}
            >
                {description}
            </span>
        </button>
    );
}

// ============================================================================
// Inspector Combobox (Accessible with ARIA & Keyboard Navigation)
// ============================================================================

interface InspectorComboboxProps {
    value: string | null;
    onChange: (inspectorId: string | null) => void;
}

function InspectorCombobox({ value, onChange }: InspectorComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);

    // Generate unique IDs for ARIA
    const comboboxId = useId();
    const listboxId = `${comboboxId}-listbox`;
    const searchInputId = `${comboboxId}-search`;

    const selectedInspector = MOCK_INSPECTORS.find((i) => i.id === value);

    // Filter inspectors based on search query
    const filteredInspectors = MOCK_INSPECTORS.filter((inspector) =>
        inspector.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get only available inspectors for keyboard navigation
    const availableInspectors = filteredInspectors.filter((i) => i.available);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchQuery("");
                setHighlightedIndex(-1);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Focus input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setHighlightedIndex(-1);
        }
    }, [isOpen]);

    // Scroll highlighted option into view
    useEffect(() => {
        if (highlightedIndex >= 0 && listRef.current) {
            const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlightedIndex]);

    const handleSelect = useCallback((inspectorId: string) => {
        onChange(inspectorId);
        setIsOpen(false);
        setSearchQuery("");
        setHighlightedIndex(-1);
        triggerRef.current?.focus();
    }, [onChange]);

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange(null);
        setSearchQuery("");
    };

    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown" || e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen(true);
        }
    };

    const handleInputKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) => {
                    const nextIndex = prev + 1;
                    return nextIndex >= availableInspectors.length ? 0 : nextIndex;
                });
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => {
                    const nextIndex = prev - 1;
                    return nextIndex < 0 ? availableInspectors.length - 1 : nextIndex;
                });
                break;
            case "Enter":
                e.preventDefault();
                if (highlightedIndex >= 0 && availableInspectors[highlightedIndex]) {
                    handleSelect(availableInspectors[highlightedIndex].id);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                setSearchQuery("");
                setHighlightedIndex(-1);
                triggerRef.current?.focus();
                break;
            case "Tab":
                setIsOpen(false);
                setSearchQuery("");
                setHighlightedIndex(-1);
                break;
        }
    };

    const getHighlightedInspectorId = () => {
        if (highlightedIndex >= 0 && availableInspectors[highlightedIndex]) {
            return `${comboboxId}-option-${availableInspectors[highlightedIndex].id}`;
        }
        return undefined;
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Hidden label for screen readers */}
            <label id={`${comboboxId}-label`} className="sr-only">
                Select an inspector
            </label>

            {/* Combobox Trigger Button */}
            <button
                ref={triggerRef}
                type="button"
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls={listboxId}
                aria-labelledby={`${comboboxId}-label`}
                aria-activedescendant={isOpen ? getHighlightedInspectorId() : undefined}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleTriggerKeyDown}
                className={cx(
                    "w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg border text-left transition-colors",
                    "focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                    isOpen
                        ? "border-brand-500 ring-1 ring-brand-500 bg-white"
                        : "border-gray-300 bg-white hover:border-gray-400"
                )}
            >
                {selectedInspector ? (
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Avatar
                            size="xs"
                            src={selectedInspector.avatar}
                            alt=""
                            initials={selectedInspector.fullName.split(" ").map(n => n[0]).join("")}
                        />
                        <span className="text-sm text-gray-900 truncate">{selectedInspector.fullName}</span>
                        <span className="text-xs text-gray-400">{selectedInspector.distance}</span>
                    </div>
                ) : (
                    <span className="text-sm text-gray-400">Select inspector...</span>
                )}
                <div className="flex items-center gap-1 shrink-0">
                    {selectedInspector && (
                        <button
                            type="button"
                            onClick={handleClear}
                            aria-label="Clear selection"
                            className="p-0.5 rounded hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                        >
                            <X className="size-3.5 text-gray-400" aria-hidden="true" />
                        </button>
                    )}
                    <ChevronDown className={cx("size-4 text-gray-400 transition-transform", isOpen && "rotate-180")} aria-hidden="true" />
                </div>
            </button>

            {/* Dropdown - Opens upward */}
            {isOpen && (
                <div className="absolute z-50 bottom-full mb-1 left-0 right-0 w-full rounded-lg border border-gray-200 bg-white shadow-xl overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
                            <input
                                ref={inputRef}
                                id={searchInputId}
                                type="text"
                                role="searchbox"
                                aria-label="Search inspectors"
                                aria-autocomplete="list"
                                aria-controls={listboxId}
                                aria-activedescendant={getHighlightedInspectorId()}
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setHighlightedIndex(-1);
                                }}
                                onKeyDown={handleInputKeyDown}
                                placeholder="Type to search..."
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md bg-gray-50 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-brand-500 focus:bg-white focus:ring-1 focus:ring-brand-500"
                            />
                        </div>
                    </div>

                    {/* Inspector List */}
                    <ul
                        ref={listRef}
                        id={listboxId}
                        role="listbox"
                        aria-label="Available inspectors"
                        className="max-h-60 overflow-y-auto overscroll-contain"
                    >
                        {filteredInspectors.length > 0 ? (
                            filteredInspectors.map((inspector, index) => {
                                const availableIndex = availableInspectors.findIndex((i) => i.id === inspector.id);
                                const isHighlighted = availableIndex === highlightedIndex && inspector.available;
                                const isSelected = value === inspector.id;

                                return (
                                    <li
                                        key={inspector.id}
                                        id={`${comboboxId}-option-${inspector.id}`}
                                        role="option"
                                        aria-selected={isSelected}
                                        aria-disabled={!inspector.available}
                                        onClick={() => inspector.available && handleSelect(inspector.id)}
                                        onMouseEnter={() => {
                                            if (inspector.available) {
                                                setHighlightedIndex(availableIndex);
                                            }
                                        }}
                                        className={cx(
                                            "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors cursor-pointer",
                                            inspector.available
                                                ? "hover:bg-gray-50"
                                                : "opacity-50 cursor-not-allowed",
                                            isHighlighted && "bg-brand-50",
                                            isSelected && !isHighlighted && "bg-gray-50"
                                        )}
                                    >
                                        <Avatar
                                            size="sm"
                                            src={inspector.avatar}
                                            alt=""
                                            initials={inspector.fullName.split(" ").map(n => n[0]).join("")}
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900">{inspector.fullName}</p>
                                            <p className="text-xs text-gray-500">
                                                {inspector.available ? "Available" : "Unavailable"}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-gray-500 shrink-0">
                                            <MapPin className="size-3.5" aria-hidden="true" />
                                            <span>{inspector.distance}</span>
                                        </div>
                                        {isSelected && (
                                            <Check className="size-4 text-brand-600 shrink-0" aria-hidden="true" />
                                        )}
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-4 py-8 text-center" role="option" aria-disabled="true">
                                <p className="text-sm text-gray-500">No inspectors found</p>
                            </li>
                        )}
                    </ul>

                    {/* Keyboard hint */}
                    <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500" aria-hidden="true">
                        <span className="font-medium">↑↓</span> to navigate, <span className="font-medium">Enter</span> to select, <span className="font-medium">Esc</span> to close
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Form Field Components (Accessible with proper label association)
// ============================================================================

interface FormFieldProps {
    label: string;
    htmlFor: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: React.ReactNode;
}

function FormField({ label, htmlFor, required, hint, error, children }: FormFieldProps) {
    const hintId = hint ? `${htmlFor}-hint` : undefined;
    const errorId = error ? `${htmlFor}-error` : undefined;

    return (
        <div>
            <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700 mb-1.5">
                {label}
                {required && <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>}
                {required && <span className="sr-only">(required)</span>}
            </label>
            {children}
            {hint && !error && (
                <p id={hintId} className="mt-1.5 text-xs text-gray-500">{hint}</p>
            )}
            {error && (
                <p id={errorId} className="mt-1.5 text-xs text-red-600" role="alert">{error}</p>
            )}
        </div>
    );
}

interface TextInputProps {
    id: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    icon?: typeof Calendar;
    required?: boolean;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
}

function TextInput({
    id,
    value,
    onChange,
    placeholder,
    icon: Icon,
    required,
    "aria-describedby": ariaDescribedBy,
    "aria-invalid": ariaInvalid,
}: TextInputProps) {
    return (
        <div className="relative">
            {Icon && (
                <Icon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" aria-hidden="true" />
            )}
            <input
                id={id}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                required={required}
                aria-describedby={ariaDescribedBy}
                aria-invalid={ariaInvalid}
                className={cx(
                    "w-full py-2.5 rounded-lg border bg-white text-sm text-gray-900 placeholder:text-gray-400",
                    "focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500",
                    ariaInvalid ? "border-red-500" : "border-gray-300",
                    Icon ? "pl-10 pr-4" : "px-4"
                )}
            />
        </div>
    );
}

// ============================================================================
// Main Modal Component (Accessible Dialog)
// ============================================================================

export function ScheduleInspectionModal({ isOpen, onClose, onSubmit }: ScheduleInspectionModalProps) {
    const [formData, setFormData] = useState<FormData>({
        workflow: null,
        propertyAddress: "",
        date: "",
        time: "",
        inspectorId: null,
        loanNumber: "",
        borrowerName: "",
        propertyManagerName: "",
        yearBuilt: "",
    });

    const modalRef = useRef<HTMLDivElement>(null);
    const titleId = useId();
    const descriptionId = useId();

    // Generate unique IDs for form fields
    const fieldIds = {
        propertyAddress: useId(),
        date: useId(),
        time: useId(),
        loanNumber: useId(),
        borrowerName: useId(),
        propertyManagerName: useId(),
        yearBuilt: useId(),
    };

    // Reset form when modal closes
    useEffect(() => {
        if (!isOpen) {
            setFormData({
                workflow: null,
                propertyAddress: "",
                date: "",
                time: "",
                inspectorId: null,
                loanNumber: "",
                borrowerName: "",
                propertyManagerName: "",
                yearBuilt: "",
            });
        }
    }, [isOpen]);

    // Focus trap and escape key handling
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        // Focus the modal when it opens
        modalRef.current?.focus();

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // Validation
    const isValid = formData.workflow !== null && formData.propertyAddress.trim().length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) {
            console.log("Scheduling inspection:", formData);
            onSubmit(formData);
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="presentation"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Dialog */}
            <div
                ref={modalRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                aria-describedby={descriptionId}
                tabIndex={-1}
                className="relative z-10 mx-4 w-full max-w-xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col focus:outline-none"
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 shrink-0">
                    <div>
                        <h2 id={titleId} className="text-lg font-semibold text-gray-900">
                            Schedule Inspection
                        </h2>
                        <p id={descriptionId} className="text-sm text-gray-500 mt-0.5">
                            Create a new property inspection
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close dialog"
                        className="flex size-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    >
                        <X className="size-5" aria-hidden="true" />
                    </button>
                </div>

                {/* Content - Form */}
                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5">
                    <div className="space-y-6">
                        {/* ============================================
                            Step 1: Workflow Selection
                        ============================================ */}
                        <fieldset>
                            <legend className="text-sm font-semibold text-gray-900 mb-3">
                                Inspection Type <span className="text-red-500" aria-hidden="true">*</span>
                                <span className="sr-only">(required)</span>
                            </legend>
                            <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-required="true">
                                <WorkflowCard
                                    type="origination"
                                    selected={formData.workflow === "origination"}
                                    onClick={() => updateField("workflow", "origination")}
                                />
                                <WorkflowCard
                                    type="servicing"
                                    selected={formData.workflow === "servicing"}
                                    onClick={() => updateField("workflow", "servicing")}
                                />
                            </div>
                        </fieldset>

                        {/* ============================================
                            Step 2: Form Fields (shown after workflow selection)
                        ============================================ */}
                        {formData.workflow && (
                            <>
                                {/* Divider */}
                                <div className="border-t border-gray-200" role="separator" />

                                {/* Common Fields */}
                                <div className="space-y-4">
                                    <FormField label="Property Address" htmlFor={fieldIds.propertyAddress} required>
                                        <TextInput
                                            id={fieldIds.propertyAddress}
                                            value={formData.propertyAddress}
                                            onChange={(v) => updateField("propertyAddress", v)}
                                            placeholder="123 Main Street, Chicago, IL"
                                            icon={MapPin}
                                            required
                                        />
                                    </FormField>

                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Date" htmlFor={fieldIds.date} required>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none z-10" aria-hidden="true" />
                                                <input
                                                    id={fieldIds.date}
                                                    type="date"
                                                    value={formData.date}
                                                    onChange={(e) => updateField("date", e.target.value)}
                                                    required
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                                />
                                            </div>
                                        </FormField>
                                        <FormField label="Time" htmlFor={fieldIds.time} required>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none z-10" aria-hidden="true" />
                                                <input
                                                    id={fieldIds.time}
                                                    type="time"
                                                    value={formData.time}
                                                    onChange={(e) => updateField("time", e.target.value)}
                                                    required
                                                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                                />
                                            </div>
                                        </FormField>
                                    </div>

                                    {/* Conditional Fields - Origination */}
                                    {formData.workflow === "origination" && (
                                        <>
                                            <FormField label="Loan Number" htmlFor={fieldIds.loanNumber}>
                                                <TextInput
                                                    id={fieldIds.loanNumber}
                                                    value={formData.loanNumber}
                                                    onChange={(v) => updateField("loanNumber", v)}
                                                    placeholder="e.g., LN-2024-00123"
                                                />
                                            </FormField>
                                            <FormField label="Borrower Name" htmlFor={fieldIds.borrowerName}>
                                                <TextInput
                                                    id={fieldIds.borrowerName}
                                                    value={formData.borrowerName}
                                                    onChange={(v) => updateField("borrowerName", v)}
                                                    placeholder="Enter borrower's full name"
                                                />
                                            </FormField>
                                        </>
                                    )}

                                    {/* Conditional Fields - Servicing */}
                                    {formData.workflow === "servicing" && (
                                        <>
                                            <FormField label="Property Manager Name" htmlFor={fieldIds.propertyManagerName}>
                                                <TextInput
                                                    id={fieldIds.propertyManagerName}
                                                    value={formData.propertyManagerName}
                                                    onChange={(v) => updateField("propertyManagerName", v)}
                                                    placeholder="Enter property manager's name"
                                                />
                                            </FormField>
                                            <FormField label="Year Built" htmlFor={fieldIds.yearBuilt}>
                                                <TextInput
                                                    id={fieldIds.yearBuilt}
                                                    value={formData.yearBuilt}
                                                    onChange={(v) => updateField("yearBuilt", v)}
                                                    placeholder="e.g., 1995"
                                                />
                                            </FormField>
                                        </>
                                    )}
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-200" role="separator" />

                                {/* Inspector Assignment */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">
                                        Assign Inspector
                                    </h3>
                                    <InspectorCombobox
                                        value={formData.inspectorId}
                                        onChange={(v) => updateField("inspectorId", v)}
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        Optional. You can assign an inspector later.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </form>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4 bg-gray-50 shrink-0">
                    <Button type="button" color="tertiary" size="md" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        color="primary"
                        size="md"
                        onClick={handleSubmit}
                        disabled={!isValid}
                        aria-disabled={!isValid}
                        className={!isValid ? "opacity-50 cursor-not-allowed" : ""}
                    >
                        Schedule Inspection
                    </Button>
                </div>
            </div>
        </div>
    );
}
