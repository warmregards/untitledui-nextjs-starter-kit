"use client";

import { useState } from "react";
import {
    AlertTriangle,
    Camera,
    CheckCircle,
    ChevronDown,
    Circle,
    ImagePlus,
    MinusCircle,
    Upload,
    X,
    XCircle,
} from "lucide-react";
import { cx } from "@/utils/cx";
import type { Inspection } from "@/types";

// ============================================================================
// Types
// ============================================================================

type ItemStatus = "pending" | "pass" | "fail" | "na";
type Severity = "low" | "medium" | "high";

interface ChecklistItemState {
    id: string;
    name: string;
    status: ItemStatus;
    isPhotoOpen: boolean;
    photos: string[];
    defect: {
        severity: Severity;
        description: string;
    };
}

interface RoomState {
    id: string;
    name: string;
    isExpanded: boolean;
    items: ChecklistItemState[];
}

// ============================================================================
// Initial Data
// ============================================================================

function createInitialRooms(): RoomState[] {
    return [
        {
            id: "exterior",
            name: "Exterior",
            isExpanded: true,
            items: [
                { id: "ext-1", name: "Roof Condition", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "ext-2", name: "Gutters & Downspouts", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "ext-3", name: "Siding & Paint", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "ext-4", name: "Foundation", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "ext-5", name: "Driveway & Walkways", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "ext-6", name: "Landscaping", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
            ],
        },
        {
            id: "kitchen",
            name: "Kitchen",
            isExpanded: true,
            items: [
                { id: "kit-1", name: "Countertops", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "kit-2", name: "Cabinets", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "kit-3", name: "Appliances", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "kit-4", name: "Sink & Faucet", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "kit-5", name: "Flooring", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "kit-6", name: "Lighting", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
            ],
        },
        {
            id: "living-room",
            name: "Living Room",
            isExpanded: true,
            items: [
                { id: "lr-1", name: "Walls & Paint", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "lr-2", name: "Windows", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "lr-3", name: "Flooring", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "lr-4", name: "Electrical Outlets", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "lr-5", name: "Ceiling", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
            ],
        },
        {
            id: "bathroom",
            name: "Bathroom",
            isExpanded: true,
            items: [
                { id: "bath-1", name: "Toilet", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "bath-2", name: "Shower/Tub", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "bath-3", name: "Vanity & Sink", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "bath-4", name: "Tile & Grout", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "bath-5", name: "Ventilation", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
            ],
        },
        {
            id: "bedroom",
            name: "Bedroom",
            isExpanded: true,
            items: [
                { id: "bed-1", name: "Walls & Paint", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "bed-2", name: "Windows", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "bed-3", name: "Closet", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "bed-4", name: "Flooring", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "bed-5", name: "Lighting", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
            ],
        },
        {
            id: "systems",
            name: "Systems",
            isExpanded: true,
            items: [
                { id: "sys-1", name: "HVAC System", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "sys-2", name: "Water Heater", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "sys-3", name: "Electrical Panel", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "sys-4", name: "Plumbing", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
                { id: "sys-5", name: "Smoke/CO Detectors", status: "pending", isPhotoOpen: false, photos: [], defect: { severity: "medium", description: "" } },
            ],
        },
    ];
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Leading Icon - Changes based on item status
 */
function LeadingIcon({ status }: { status: ItemStatus }) {
    switch (status) {
        case "pass":
            return <CheckCircle className="size-5 text-green-500" />;
        case "fail":
            return <XCircle className="size-5 text-red-500" />;
        case "na":
            return <MinusCircle className="size-5 text-gray-400" />;
        case "pending":
        default:
            return <Circle className="size-5 text-gray-300" strokeWidth={1.5} />;
    }
}

/**
 * Segmented Control - [Pass] [Fail] [N/A] with color states
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
        <div
            className={cx(
                "inline-flex rounded-lg border p-0.5 transition-colors",
                value === "pass" && "border-green-300 bg-green-50",
                value === "fail" && "border-red-300 bg-red-50",
                value === "na" && "border-gray-300 bg-gray-100",
                value === "pending" && "border-gray-200 bg-gray-50"
            )}
        >
            {/* Pass */}
            <button
                type="button"
                onClick={() => onChange("pass")}
                disabled={disabled}
                className={cx(
                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                    value === "pass"
                        ? "bg-green-500 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
                )}
            >
                Pass
            </button>

            {/* Fail */}
            <button
                type="button"
                onClick={() => onChange("fail")}
                disabled={disabled}
                className={cx(
                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                    value === "fail"
                        ? "bg-red-500 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
                )}
            >
                Fail
            </button>

            {/* N/A */}
            <button
                type="button"
                onClick={() => onChange("na")}
                disabled={disabled}
                className={cx(
                    "px-3 py-1.5 text-xs font-semibold rounded-md transition-all",
                    value === "na"
                        ? "bg-gray-500 text-white shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
                )}
            >
                N/A
            </button>
        </div>
    );
}

/**
 * Camera Ghost Button - Toggles photo dropzone
 */
function CameraGhostButton({
    isActive,
    photoCount,
    onClick,
    disabled = false,
}: {
    isActive: boolean;
    photoCount: number;
    onClick: () => void;
    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={cx(
                "relative flex items-center justify-center w-9 h-9 rounded-lg transition-all",
                isActive
                    ? "bg-brand-100 text-brand-600"
                    : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            )}
            title="Add photo evidence"
        >
            <Camera className="size-4" />
            {photoCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {photoCount}
                </span>
            )}
        </button>
    );
}

/**
 * Severity Buttons - Low / Medium / High
 */
function SeverityButtons({
    value,
    onChange,
}: {
    value: Severity;
    onChange: (severity: Severity) => void;
}) {
    return (
        <div className="inline-flex rounded-lg border border-red-200 bg-white p-0.5">
            <button
                type="button"
                onClick={() => onChange("low")}
                className={cx(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    value === "low"
                        ? "bg-yellow-100 text-yellow-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
            >
                Low
            </button>
            <button
                type="button"
                onClick={() => onChange("medium")}
                className={cx(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    value === "medium"
                        ? "bg-orange-100 text-orange-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
            >
                Medium
            </button>
            <button
                type="button"
                onClick={() => onChange("high")}
                className={cx(
                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                    value === "high"
                        ? "bg-red-100 text-red-800 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
            >
                High
            </button>
        </div>
    );
}

/**
 * Photo Evidence Dropzone - Toggled by camera button
 */
function PhotoDropzone({
    photos,
    onAddPhoto,
    onRemovePhoto,
}: {
    photos: string[];
    onAddPhoto: () => void;
    onRemovePhoto: (index: number) => void;
}) {
    return (
        <div className="mt-3 p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50/50 animate-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <Upload className="size-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">Photo Evidence</span>
                {photos.length > 0 && (
                    <span className="text-xs text-gray-400">
                        ({photos.length} photo{photos.length !== 1 ? "s" : ""})
                    </span>
                )}
            </div>

            {/* Photo Grid */}
            <div className="flex flex-wrap gap-2">
                {photos.map((photo, index) => (
                    <div key={index} className="relative group">
                        <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden ring-1 ring-gray-200">
                            <img
                                src={photo}
                                alt={`Evidence ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => onRemovePhoto(index)}
                            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-700 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="size-3" />
                        </button>
                    </div>
                ))}

                {/* Add Button */}
                <button
                    type="button"
                    onClick={onAddPhoto}
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 flex flex-col items-center justify-center gap-0.5 transition-colors"
                >
                    <ImagePlus className="size-5 text-gray-400" />
                    <span className="text-[10px] text-gray-500 font-medium">Add</span>
                </button>
            </div>

            {/* Empty Hint */}
            {photos.length === 0 && (
                <p className="mt-2 text-xs text-gray-400">
                    Tap to upload evidence photos for this item.
                </p>
            )}
        </div>
    );
}

/**
 * Defect Form - Auto-expands when status is "fail"
 */
function DefectForm({
    severity,
    description,
    onSeverityChange,
    onDescriptionChange,
}: {
    severity: Severity;
    description: string;
    onSeverityChange: (severity: Severity) => void;
    onDescriptionChange: (description: string) => void;
}) {
    return (
        <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-xl space-y-4 animate-in slide-in-from-top-2 duration-200">
            {/* Header */}
            <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-red-600" />
                <span className="text-sm font-semibold text-red-700">Defect Details</span>
            </div>

            {/* Severity */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                    Severity
                </label>
                <SeverityButtons value={severity} onChange={onSeverityChange} />
            </div>

            {/* Description */}
            <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder="Describe the defect found..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                />
            </div>
        </div>
    );
}

/**
 * Checklist Item Row - Complete interactive row
 */
function ChecklistItemRow({
    item,
    onStatusChange,
    onTogglePhoto,
    onSeverityChange,
    onDescriptionChange,
    onAddPhoto,
    onRemovePhoto,
    isEditable,
}: {
    item: ChecklistItemState;
    onStatusChange: (status: ItemStatus) => void;
    onTogglePhoto: () => void;
    onSeverityChange: (severity: Severity) => void;
    onDescriptionChange: (description: string) => void;
    onAddPhoto: () => void;
    onRemovePhoto: (index: number) => void;
    isEditable: boolean;
}) {
    const showDefectForm = item.status === "fail" && isEditable;
    const showPhotoDropzone = item.isPhotoOpen && isEditable;

    return (
        <div className="py-3">
            {/* Main Row */}
            <div className="flex items-center justify-between gap-4">
                {/* Left: Leading Icon + Item Name */}
                <div className="flex items-center gap-3 min-w-0">
                    <LeadingIcon status={item.status} />
                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                    {/* Photo badge when collapsed */}
                    {item.photos.length > 0 && !item.isPhotoOpen && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-medium rounded">
                            <Camera className="size-2.5" />
                            {item.photos.length}
                        </span>
                    )}
                </div>

                {/* Right: Segmented Control + Camera Ghost Button */}
                <div className="flex items-center gap-2">
                    <SegmentedControl
                        value={item.status}
                        onChange={onStatusChange}
                        disabled={!isEditable}
                    />
                    {isEditable && (
                        <CameraGhostButton
                            isActive={item.isPhotoOpen}
                            photoCount={item.photos.length}
                            onClick={onTogglePhoto}
                        />
                    )}
                </div>
            </div>

            {/* Photo Dropzone (toggled by Camera button - independent of status) */}
            {showPhotoDropzone && (
                <PhotoDropzone
                    photos={item.photos}
                    onAddPhoto={onAddPhoto}
                    onRemovePhoto={onRemovePhoto}
                />
            )}

            {/* Defect Form (auto-expands when status === "fail") */}
            {showDefectForm && (
                <DefectForm
                    severity={item.defect.severity}
                    description={item.defect.description}
                    onSeverityChange={onSeverityChange}
                    onDescriptionChange={onDescriptionChange}
                />
            )}
        </div>
    );
}

/**
 * Room Accordion - Collapsible room section
 */
function RoomAccordion({
    room,
    onToggleExpanded,
    onItemStatusChange,
    onItemTogglePhoto,
    onItemSeverityChange,
    onItemDescriptionChange,
    onItemAddPhoto,
    onItemRemovePhoto,
    isEditable,
}: {
    room: RoomState;
    onToggleExpanded: () => void;
    onItemStatusChange: (itemId: string, status: ItemStatus) => void;
    onItemTogglePhoto: (itemId: string) => void;
    onItemSeverityChange: (itemId: string, severity: Severity) => void;
    onItemDescriptionChange: (itemId: string, description: string) => void;
    onItemAddPhoto: (itemId: string) => void;
    onItemRemovePhoto: (itemId: string, photoIndex: number) => void;
    isEditable: boolean;
}) {
    // Stats
    const failCount = room.items.filter((i) => i.status === "fail").length;
    const completedCount = room.items.filter((i) => i.status !== "pending").length;
    const totalCount = room.items.length;
    const totalPhotos = room.items.reduce((sum, i) => sum + i.photos.length, 0);

    const hasFailures = failCount > 0;
    const isComplete = completedCount === totalCount;

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Header */}
            <button
                type="button"
                onClick={onToggleExpanded}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    {/* Status Icon */}
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
                            <CheckCircle className="size-4" />
                        ) : (
                            <span className="text-xs font-bold">
                                {completedCount}/{totalCount}
                            </span>
                        )}
                    </div>

                    {/* Room Name */}
                    <span className="font-semibold text-gray-900">{room.name}</span>

                    {/* Badges */}
                    <div className="flex items-center gap-2">
                        {failCount > 0 && (
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                {failCount} issue{failCount !== 1 ? "s" : ""}
                            </span>
                        )}
                        {totalPhotos > 0 && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                <Camera className="size-3" />
                                {totalPhotos}
                            </span>
                        )}
                    </div>
                </div>

                {/* Progress + Chevron */}
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                        {completedCount} of {totalCount}
                    </span>
                    <ChevronDown
                        className={cx(
                            "size-5 text-gray-400 transition-transform",
                            room.isExpanded && "rotate-180"
                        )}
                    />
                </div>
            </button>

            {/* Content */}
            {room.isExpanded && (
                <div className="px-4 pb-3 border-t border-gray-100">
                    <div className="divide-y divide-gray-100">
                        {room.items.map((item) => (
                            <ChecklistItemRow
                                key={item.id}
                                item={item}
                                onStatusChange={(status) => onItemStatusChange(item.id, status)}
                                onTogglePhoto={() => onItemTogglePhoto(item.id)}
                                onSeverityChange={(severity) => onItemSeverityChange(item.id, severity)}
                                onDescriptionChange={(desc) => onItemDescriptionChange(item.id, desc)}
                                onAddPhoto={() => onItemAddPhoto(item.id)}
                                onRemovePhoto={(index) => onItemRemovePhoto(item.id, index)}
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
    // -------------------------------------------------------------------------
    // State - Single source of truth for all rooms/items
    // -------------------------------------------------------------------------
    const [rooms, setRooms] = useState<RoomState[]>(createInitialRooms);

    // -------------------------------------------------------------------------
    // Update Helpers
    // -------------------------------------------------------------------------

    const updateItem = (
        roomId: string,
        itemId: string,
        updater: (item: ChecklistItemState) => ChecklistItemState
    ) => {
        setRooms((prev) =>
            prev.map((room) => {
                if (room.id !== roomId) return room;
                return {
                    ...room,
                    items: room.items.map((item) => {
                        if (item.id !== itemId) return item;
                        return updater(item);
                    }),
                };
            })
        );
    };

    // -------------------------------------------------------------------------
    // Handlers
    // -------------------------------------------------------------------------

    // Toggle room expanded/collapsed
    const handleToggleRoom = (roomId: string) => {
        setRooms((prev) =>
            prev.map((room) => {
                if (room.id !== roomId) return room;
                return { ...room, isExpanded: !room.isExpanded };
            })
        );
    };

    // Change item status
    const handleItemStatusChange = (roomId: string, itemId: string, status: ItemStatus) => {
        updateItem(roomId, itemId, (item) => ({
            ...item,
            status,
        }));
    };

    // Toggle item photo dropzone (independent of status)
    const handleItemTogglePhoto = (roomId: string, itemId: string) => {
        updateItem(roomId, itemId, (item) => ({
            ...item,
            isPhotoOpen: !item.isPhotoOpen,
        }));
    };

    // Change item defect severity
    const handleItemSeverityChange = (roomId: string, itemId: string, severity: Severity) => {
        updateItem(roomId, itemId, (item) => ({
            ...item,
            defect: { ...item.defect, severity },
        }));
    };

    // Change item defect description
    const handleItemDescriptionChange = (roomId: string, itemId: string, description: string) => {
        updateItem(roomId, itemId, (item) => ({
            ...item,
            defect: { ...item.defect, description },
        }));
    };

    // Add photo to item (mock)
    const handleItemAddPhoto = (roomId: string, itemId: string) => {
        const placeholders = [
            "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1585128792020-803d29415281?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=100&h=100&fit=crop",
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&h=100&fit=crop",
        ];
        const url = placeholders[Math.floor(Math.random() * placeholders.length)];

        updateItem(roomId, itemId, (item) => ({
            ...item,
            photos: [...item.photos, url],
        }));
    };

    // Remove photo from item
    const handleItemRemovePhoto = (roomId: string, itemId: string, photoIndex: number) => {
        updateItem(roomId, itemId, (item) => ({
            ...item,
            photos: item.photos.filter((_, i) => i !== photoIndex),
        }));
    };

    // -------------------------------------------------------------------------
    // Computed Stats
    // -------------------------------------------------------------------------

    const allItems = rooms.flatMap((r) => r.items);
    const totalItems = allItems.length;
    const completedItems = allItems.filter((i) => i.status !== "pending").length;
    const failedItems = allItems.filter((i) => i.status === "fail").length;
    const totalPhotos = allItems.reduce((sum, i) => sum + i.photos.length, 0);
    const progressPercent = Math.round((completedItems / totalItems) * 100);

    // -------------------------------------------------------------------------
    // Render
    // -------------------------------------------------------------------------

    return (
        <div className="space-y-6">
            {/* Read-Only Banner (Completed/Scheduled inspections) */}
            {!isEditable && (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                            <CheckCircle className="size-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-blue-900">
                                {inspection.status === "Completed" ? "Inspection Completed" : "View Only Mode"}
                            </p>
                            <p className="text-sm text-blue-700 mt-0.5">
                                {inspection.status === "Completed"
                                    ? "This inspection has been completed and submitted. No changes can be made."
                                    : "This inspection is not currently in progress. Checklist is read-only."}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">Inspection Checklist</h2>
                    <p className="text-sm text-gray-500 mt-0.5">
                        {isEditable ? "Complete all items in each room" : "Review the inspection results below"}
                    </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4">
                    {totalPhotos > 0 && (
                        <div className="flex items-center gap-1.5 text-gray-600">
                            <Camera className="size-4" />
                            <span className="text-sm font-medium">{totalPhotos} photos</span>
                        </div>
                    )}
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
                        failedItems > 0
                            ? "bg-gradient-to-r from-green-500 to-red-500"
                            : "bg-green-500"
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
                        onToggleExpanded={() => handleToggleRoom(room.id)}
                        onItemStatusChange={(itemId, status) =>
                            handleItemStatusChange(room.id, itemId, status)
                        }
                        onItemTogglePhoto={(itemId) =>
                            handleItemTogglePhoto(room.id, itemId)
                        }
                        onItemSeverityChange={(itemId, severity) =>
                            handleItemSeverityChange(room.id, itemId, severity)
                        }
                        onItemDescriptionChange={(itemId, desc) =>
                            handleItemDescriptionChange(room.id, itemId, desc)
                        }
                        onItemAddPhoto={(itemId) =>
                            handleItemAddPhoto(room.id, itemId)
                        }
                        onItemRemovePhoto={(itemId, index) =>
                            handleItemRemovePhoto(room.id, itemId, index)
                        }
                        isEditable={isEditable}
                    />
                ))}
            </div>

            {/* Completion Summary */}
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
                                        {failedItems} item{failedItems !== 1 ? "s" : ""} flagged for review.
                                        {totalPhotos > 0 && ` ${totalPhotos} photos captured.`}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <CheckCircle className="size-5 text-green-600" />
                                <div>
                                    <p className="font-medium text-green-800">
                                        All Items Passed
                                    </p>
                                    <p className="text-sm text-green-600 mt-0.5">
                                        Inspection completed successfully.
                                        {totalPhotos > 0 && ` ${totalPhotos} photos captured.`}
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
