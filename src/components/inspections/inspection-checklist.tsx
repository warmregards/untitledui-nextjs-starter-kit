"use client";

import { useState } from "react";
import {
    AlertTriangle,
    Camera,
    CheckCircle2,
    ChevronDown,
    ImagePlus,
    Minus,
    Upload,
    X,
    XCircle,
} from "lucide-react";
import { cx } from "@/utils/cx";
import type { Inspection } from "@/types";

// ============================================================================
// Types
// ============================================================================

type ItemStatus = "pass" | "fail" | "na" | "pending";
type Severity = "low" | "medium" | "high";

interface ChecklistItem {
    id: string;
    name: string;
    status: ItemStatus;
    defect?: {
        severity: Severity;
        description: string;
        photos: string[];
    };
}

interface Room {
    id: string;
    name: string;
    items: ChecklistItem[];
}

interface DefectData {
    severity: Severity;
    description: string;
    photos: string[];
}

// ============================================================================
// Initial Checklist Data
// ============================================================================

const INITIAL_ROOMS: Room[] = [
    {
        id: "exterior",
        name: "Exterior",
        items: [
            { id: "ext-1", name: "Roof Condition", status: "pending" },
            { id: "ext-2", name: "Gutters & Downspouts", status: "pending" },
            { id: "ext-3", name: "Siding & Paint", status: "pending" },
            { id: "ext-4", name: "Foundation", status: "pending" },
            { id: "ext-5", name: "Driveway & Walkways", status: "pending" },
            { id: "ext-6", name: "Landscaping", status: "pending" },
        ],
    },
    {
        id: "kitchen",
        name: "Kitchen",
        items: [
            { id: "kit-1", name: "Countertops", status: "pending" },
            { id: "kit-2", name: "Cabinets", status: "pending" },
            { id: "kit-3", name: "Appliances", status: "pending" },
            { id: "kit-4", name: "Sink & Faucet", status: "pending" },
            { id: "kit-5", name: "Flooring", status: "pending" },
            { id: "kit-6", name: "Lighting", status: "pending" },
        ],
    },
    {
        id: "living-room",
        name: "Living Room",
        items: [
            { id: "lr-1", name: "Walls & Paint", status: "pending" },
            { id: "lr-2", name: "Windows", status: "pending" },
            { id: "lr-3", name: "Flooring", status: "pending" },
            { id: "lr-4", name: "Electrical Outlets", status: "pending" },
            { id: "lr-5", name: "Ceiling", status: "pending" },
        ],
    },
    {
        id: "bathroom",
        name: "Bathroom",
        items: [
            { id: "bath-1", name: "Toilet", status: "pending" },
            { id: "bath-2", name: "Shower/Tub", status: "pending" },
            { id: "bath-3", name: "Vanity & Sink", status: "pending" },
            { id: "bath-4", name: "Tile & Grout", status: "pending" },
            { id: "bath-5", name: "Ventilation", status: "pending" },
        ],
    },
    {
        id: "bedroom",
        name: "Bedroom",
        items: [
            { id: "bed-1", name: "Walls & Paint", status: "pending" },
            { id: "bed-2", name: "Windows", status: "pending" },
            { id: "bed-3", name: "Closet", status: "pending" },
            { id: "bed-4", name: "Flooring", status: "pending" },
            { id: "bed-5", name: "Lighting", status: "pending" },
        ],
    },
    {
        id: "systems",
        name: "Systems",
        items: [
            { id: "sys-1", name: "HVAC System", status: "pending" },
            { id: "sys-2", name: "Water Heater", status: "pending" },
            { id: "sys-3", name: "Electrical Panel", status: "pending" },
            { id: "sys-4", name: "Plumbing", status: "pending" },
            { id: "sys-5", name: "Smoke/CO Detectors", status: "pending" },
        ],
    },
];

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Segmented Control - Pass / Fail / N/A toggle
 */
function SegmentedControl({
    value,
    onChange,
    disabled = false,
}: {
    value: ItemStatus;
    onChange: (status: ItemStatus) => void;
    disabled?: boolean;
}) {
    return (
        <div className="inline-flex rounded-lg border border-gray-200 bg-gray-50 p-0.5">
            {/* Pass Button */}
            <button
                type="button"
                onClick={() => onChange("pass")}
                disabled={disabled}
                className={cx(
                    "flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    value === "pass"
                        ? "bg-green-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                )}
            >
                <CheckCircle2 className="size-3.5" />
                Pass
            </button>

            {/* Fail Button */}
            <button
                type="button"
                onClick={() => onChange("fail")}
                disabled={disabled}
                className={cx(
                    "flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    value === "fail"
                        ? "bg-red-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                )}
            >
                <XCircle className="size-3.5" />
                Fail
            </button>

            {/* N/A Button */}
            <button
                type="button"
                onClick={() => onChange("na")}
                disabled={disabled}
                className={cx(
                    "flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    value === "na"
                        ? "bg-gray-500 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                )}
            >
                <Minus className="size-3.5" />
                N/A
            </button>
        </div>
    );
}

/**
 * Severity Toggle - Low / Medium / High
 */
function SeverityToggle({
    value,
    onChange,
}: {
    value: Severity;
    onChange: (severity: Severity) => void;
}) {
    return (
        <div className="flex gap-2">
            <button
                type="button"
                onClick={() => onChange("low")}
                className={cx(
                    "px-3 py-1.5 text-xs font-medium rounded-md border transition-all",
                    value === "low"
                        ? "bg-yellow-100 border-yellow-300 text-yellow-800"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                )}
            >
                Low
            </button>
            <button
                type="button"
                onClick={() => onChange("medium")}
                className={cx(
                    "px-3 py-1.5 text-xs font-medium rounded-md border transition-all",
                    value === "medium"
                        ? "bg-orange-100 border-orange-300 text-orange-800"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                )}
            >
                Medium
            </button>
            <button
                type="button"
                onClick={() => onChange("high")}
                className={cx(
                    "px-3 py-1.5 text-xs font-medium rounded-md border transition-all",
                    value === "high"
                        ? "bg-red-100 border-red-300 text-red-800"
                        : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                )}
            >
                High
            </button>
        </div>
    );
}

/**
 * Defect Form - Slides open when Fail is selected
 */
function DefectForm({
    defect,
    onChange,
}: {
    defect: DefectData;
    onChange: (defect: DefectData) => void;
}) {
    const handlePhotoUpload = () => {
        // In a real app, this would open a file picker or camera
        // For demo, we'll add a placeholder
        const placeholderUrl = `https://images.unsplash.com/photo-${Date.now()}?w=100&h=100&fit=crop`;
        onChange({
            ...defect,
            photos: [...defect.photos, placeholderUrl],
        });
    };

    const handleRemovePhoto = (index: number) => {
        onChange({
            ...defect,
            photos: defect.photos.filter((_, i) => i !== index),
        });
    };

    return (
        <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="size-4" />
                <span className="text-sm font-medium">Defect Details</span>
            </div>

            {/* Severity */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                    Severity
                </label>
                <SeverityToggle
                    value={defect.severity}
                    onChange={(severity) => onChange({ ...defect, severity })}
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={defect.description}
                    onChange={(e) => onChange({ ...defect, description: e.target.value })}
                    placeholder="Describe the issue..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                />
            </div>

            {/* Evidence Photos */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                    Evidence
                </label>
                <div className="flex flex-wrap gap-2">
                    {/* Existing Photos */}
                    {defect.photos.map((photo, index) => (
                        <div key={index} className="relative group">
                            <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden">
                                <img
                                    src={photo}
                                    alt={`Evidence ${index + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemovePhoto(index)}
                                className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="size-3" />
                            </button>
                        </div>
                    ))}

                    {/* Add Photo Dropzone */}
                    <button
                        type="button"
                        onClick={handlePhotoUpload}
                        className="w-16 h-16 rounded-lg border-2 border-dashed border-red-300 bg-white hover:bg-red-50 flex flex-col items-center justify-center gap-1 transition-colors"
                    >
                        <ImagePlus className="size-5 text-red-400" />
                        <span className="text-[10px] text-red-500 font-medium">Add</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Checklist Item Row
 */
function ChecklistItemRow({
    item,
    onStatusChange,
    onDefectChange,
    isEditable,
}: {
    item: ChecklistItem;
    onStatusChange: (status: ItemStatus) => void;
    onDefectChange: (defect: DefectData) => void;
    isEditable: boolean;
}) {
    const isFailed = item.status === "fail";

    return (
        <div className="py-3">
            {/* Main Row */}
            <div className="flex items-center justify-between gap-4">
                {/* Item Name with Status Indicator */}
                <div className="flex items-center gap-3 min-w-0">
                    {/* Status Dot */}
                    <div
                        className={cx(
                            "w-2 h-2 rounded-full shrink-0",
                            item.status === "pass" && "bg-green-500",
                            item.status === "fail" && "bg-red-500",
                            item.status === "na" && "bg-gray-400",
                            item.status === "pending" && "bg-gray-200"
                        )}
                    />
                    <span
                        className={cx(
                            "text-sm font-medium",
                            item.status === "pending" ? "text-gray-700" : "text-gray-900"
                        )}
                    >
                        {item.name}
                    </span>
                </div>

                {/* Segmented Control */}
                <SegmentedControl
                    value={item.status}
                    onChange={onStatusChange}
                    disabled={!isEditable}
                />
            </div>

            {/* Defect Form (slides open on Fail) */}
            {isFailed && isEditable && (
                <DefectForm
                    defect={item.defect || { severity: "medium", description: "", photos: [] }}
                    onChange={onDefectChange}
                />
            )}
        </div>
    );
}

/**
 * Room Accordion - Collapsible section for each room
 */
function RoomAccordion({
    room,
    isOpen,
    onToggle,
    onItemStatusChange,
    onItemDefectChange,
    isEditable,
}: {
    room: Room;
    isOpen: boolean;
    onToggle: () => void;
    onItemStatusChange: (itemId: string, status: ItemStatus) => void;
    onItemDefectChange: (itemId: string, defect: DefectData) => void;
    isEditable: boolean;
}) {
    // Calculate room stats
    const passCount = room.items.filter((i) => i.status === "pass").length;
    const failCount = room.items.filter((i) => i.status === "fail").length;
    const completedCount = room.items.filter((i) => i.status !== "pending").length;
    const totalCount = room.items.length;

    // Determine room status
    const hasFailures = failCount > 0;
    const isComplete = completedCount === totalCount;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Accordion Header */}
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {/* Room Status Icon */}
                    <div
                        className={cx(
                            "w-8 h-8 rounded-lg flex items-center justify-center",
                            hasFailures
                                ? "bg-red-100 text-red-600"
                                : isComplete
                                    ? "bg-green-100 text-green-600"
                                    : "bg-gray-100 text-gray-500"
                        )}
                    >
                        {hasFailures ? (
                            <AlertTriangle className="size-4" />
                        ) : isComplete ? (
                            <CheckCircle2 className="size-4" />
                        ) : (
                            <span className="text-xs font-bold">{completedCount}/{totalCount}</span>
                        )}
                    </div>

                    {/* Room Name */}
                    <span className="font-semibold text-gray-900">{room.name}</span>

                    {/* Failure Badge */}
                    {failCount > 0 && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                            {failCount} {failCount === 1 ? "issue" : "issues"}
                        </span>
                    )}
                </div>

                {/* Progress + Chevron */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                        {completedCount} of {totalCount}
                    </span>
                    <ChevronDown
                        className={cx(
                            "size-5 text-gray-400 transition-transform",
                            isOpen && "rotate-180"
                        )}
                    />
                </div>
            </button>

            {/* Accordion Content */}
            {isOpen && (
                <div className="px-4 pb-3 border-t border-gray-100">
                    <div className="divide-y divide-gray-100">
                        {room.items.map((item) => (
                            <ChecklistItemRow
                                key={item.id}
                                item={item}
                                onStatusChange={(status) => onItemStatusChange(item.id, status)}
                                onDefectChange={(defect) => onItemDefectChange(item.id, defect)}
                                isEditable={isEditable}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

interface InspectionChecklistProps {
    inspection: Inspection;
    isEditable?: boolean;
}

export function InspectionChecklist({
    inspection,
    isEditable = true,
}: InspectionChecklistProps) {
    // Local state for rooms and their items
    const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);

    // Track which accordions are open (all open by default)
    const [openRooms, setOpenRooms] = useState<Set<string>>(
        new Set(INITIAL_ROOMS.map((r) => r.id))
    );

    // Toggle accordion
    const handleToggleRoom = (roomId: string) => {
        setOpenRooms((prev) => {
            const next = new Set(prev);
            if (next.has(roomId)) {
                next.delete(roomId);
            } else {
                next.add(roomId);
            }
            return next;
        });
    };

    // Update item status
    const handleItemStatusChange = (roomId: string, itemId: string, status: ItemStatus) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) => {
                if (room.id !== roomId) return room;
                return {
                    ...room,
                    items: room.items.map((item) => {
                        if (item.id !== itemId) return item;
                        return {
                            ...item,
                            status,
                            // Initialize defect data when failing
                            defect:
                                status === "fail"
                                    ? item.defect || { severity: "medium", description: "", photos: [] }
                                    : undefined,
                        };
                    }),
                };
            })
        );
    };

    // Update item defect data
    const handleItemDefectChange = (roomId: string, itemId: string, defect: DefectData) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) => {
                if (room.id !== roomId) return room;
                return {
                    ...room,
                    items: room.items.map((item) => {
                        if (item.id !== itemId) return item;
                        return { ...item, defect };
                    }),
                };
            })
        );
    };

    // Calculate overall stats
    const allItems = rooms.flatMap((r) => r.items);
    const totalItems = allItems.length;
    const completedItems = allItems.filter((i) => i.status !== "pending").length;
    const failedItems = allItems.filter((i) => i.status === "fail").length;
    const progressPercent = Math.round((completedItems / totalItems) * 100);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Inspection Checklist</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        Complete all items in each room
                    </p>
                </div>

                {/* Progress Summary */}
                <div className="flex items-center gap-4">
                    {failedItems > 0 && (
                        <div className="flex items-center gap-1.5 text-red-600">
                            <AlertTriangle className="size-4" />
                            <span className="text-sm font-medium">{failedItems} issues</span>
                        </div>
                    )}
                    <div className="text-sm text-gray-500">
                        <span className="font-semibold text-gray-900">{progressPercent}%</span> complete
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                    className={cx(
                        "h-full transition-all duration-500",
                        failedItems > 0 ? "bg-gradient-to-r from-green-500 to-red-500" : "bg-green-500"
                    )}
                    style={{ width: `${progressPercent}%` }}
                />
            </div>

            {/* Room Accordions */}
            <div className="space-y-3">
                {rooms.map((room) => (
                    <RoomAccordion
                        key={room.id}
                        room={room}
                        isOpen={openRooms.has(room.id)}
                        onToggle={() => handleToggleRoom(room.id)}
                        onItemStatusChange={(itemId, status) =>
                            handleItemStatusChange(room.id, itemId, status)
                        }
                        onItemDefectChange={(itemId, defect) =>
                            handleItemDefectChange(room.id, itemId, defect)
                        }
                        isEditable={isEditable}
                    />
                ))}
            </div>

            {/* Summary Footer */}
            {completedItems === totalItems && (
                <div
                    className={cx(
                        "p-4 rounded-xl border",
                        failedItems > 0
                            ? "bg-amber-50 border-amber-200"
                            : "bg-green-50 border-green-200"
                    )}
                >
                    <div className="flex items-center gap-3">
                        {failedItems > 0 ? (
                            <>
                                <AlertTriangle className="size-5 text-amber-600" />
                                <div>
                                    <p className="font-medium text-amber-800">
                                        Checklist Complete with Issues
                                    </p>
                                    <p className="text-sm text-amber-600 mt-0.5">
                                        {failedItems} {failedItems === 1 ? "item" : "items"} flagged for review.
                                        Please ensure all defect details are documented.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="size-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-800">
                                        All Items Passed
                                    </p>
                                    <p className="text-sm text-green-600 mt-0.5">
                                        Property inspection completed successfully with no issues found.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
