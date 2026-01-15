"use client";

import { useState } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    ClipboardList,
    Clock,
    FileSignature,
    Filter,
    List as ListIcon,
    Map as MapIcon,
    MapPin,
    PlayCircle,
    Plus,
    Search,
    UserPlus,
    X,
    XCircle,
    Zap,
} from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { PropertyImage } from "@/components/ui/property-image";
import { INSPECTIONS } from "@/data/mock-data";
import { useUserRole } from "@/contexts/user-role-context";
import { cx } from "@/utils/cx";
import type { Inspection, InspectionStatus } from "@/types";

// ============================================================================
// Types
// ============================================================================

type WorkflowFilter = "all" | "origination" | "servicing";

// ============================================================================
// Status Configuration - "Hot vs. Cold" Logic
// Active states (In Progress, Pending Review) get color
// Passive states (Scheduled, Completed, Cancelled) are gray
// ============================================================================

const STATUS_CONFIG: Record<
    InspectionStatus,
    {
        icon: typeof Clock;
        iconColor?: string; // Optional icon color override
        bgColor: string;
        textColor: string;
        borderColor: string;
    }
> = {
    // ACTIVE STATES - Colored
    "In Progress": {
        icon: PlayCircle,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
    },
    "Pending Review": {
        icon: Clock,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
    },
    // PASSIVE STATES - Gray/Neutral
    Scheduled: {
        icon: Clock,
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        borderColor: "border-gray-200",
    },
    Completed: {
        icon: CheckCircle2,
        iconColor: "text-green-600", // Green check icon on gray bg
        bgColor: "bg-gray-100",
        textColor: "text-gray-600",
        borderColor: "border-gray-200",
    },
    Cancelled: {
        icon: XCircle,
        bgColor: "bg-gray-100",
        textColor: "text-gray-500",
        borderColor: "border-gray-200",
    },
};

// ============================================================================
// Mock Inspector Data for Assignment
// ============================================================================

const MOCK_INSPECTORS = [
    { id: "insp-1", fullName: "Sarah Chen", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", distance: "2.3 mi" },
    { id: "insp-2", fullName: "Michael Torres", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop", distance: "5.2 mi" },
    { id: "insp-3", fullName: "Emily Davis", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop", distance: "7.8 mi" },
    { id: "insp-4", fullName: "James Wilson", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", distance: "12.1 mi" },
];

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Status Badge - Pill-shaped badge with icon
 * Uses "Hot vs. Cold" logic - active states colored, passive states gray
 */
function StatusBadge({ status }: { status: InspectionStatus }) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border h-6",
                config.bgColor,
                config.textColor,
                config.borderColor
            )}
        >
            <Icon className={cx("size-3", config.iconColor)} />
            {status}
        </span>
    );
}

/**
 * Urgent Badge - Pill-shaped badge matching Status badge styling
 * Orange/Red color to draw attention
 */
function UrgentBadge() {
    return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border h-6 bg-orange-50 text-orange-700 border-orange-200">
            <Zap className="size-3 fill-orange-500 text-orange-500" />
            Urgent
        </span>
    );
}

/**
 * Gray Badge - Monochrome style for Type
 */
function GrayBadge({ children }: { children: React.ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 h-6">
            {children}
        </span>
    );
}

/**
 * Workflow Icon - Monochrome circular icon indicator
 */
function WorkflowIcon({ workflow }: { workflow: string }) {
    const isOrigination = workflow === "ORIGINATION_MF";
    const Icon = isOrigination ? FileSignature : ClipboardList;
    const tooltip = isOrigination ? "Origination Inspection" : "Servicing Inspection";

    return (
        <div
            className="flex size-8 items-center justify-center rounded-full shrink-0 bg-gray-100"
            title={tooltip}
        >
            <Icon className="size-4 text-gray-500" />
        </div>
    );
}

/**
 * Date Box - For Map View Cards
 */
function DateBox({ date }: { date: Date }) {
    const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    const day = date.getDate();

    return (
        <div className="flex flex-col items-center justify-center w-14 h-14 bg-gray-100 rounded-lg shrink-0">
            <span className="text-[10px] font-bold tracking-wider text-gray-500">{month}</span>
            <span className="text-xl font-bold leading-none text-gray-900">{day}</span>
        </div>
    );
}

/**
 * Format date for table display
 */
function formatDate(date: Date): string {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

/**
 * Format time with proper AM/PM
 */
function formatTime(time: string): string {
    if (time.includes("AM") || time.includes("PM")) {
        return time;
    }
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
}

// ============================================================================
// Workflow Filter Toggles
// ============================================================================

function WorkflowFilterToggle({
    value,
    onChange,
}: {
    value: WorkflowFilter;
    onChange: (filter: WorkflowFilter) => void;
}) {
    return (
        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
            <button
                onClick={() => onChange("all")}
                className={cx(
                    "px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    value === "all"
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
            >
                All
            </button>
            <button
                onClick={() => onChange("origination")}
                className={cx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    value === "origination"
                        ? "bg-white text-purple-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
            >
                <FileSignature className="size-3.5" />
                Origination
            </button>
            <button
                onClick={() => onChange("servicing")}
                className={cx(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                    value === "servicing"
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                )}
            >
                <ClipboardList className="size-3.5" />
                Servicing
            </button>
        </div>
    );
}

// ============================================================================
// Assign Inspector Modal
// ============================================================================

interface AssignInspectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAssign: (inspectorId: string) => void;
    propertyAddress: string;
}

function AssignInspectorModal({ isOpen, onClose, onAssign, propertyAddress }: AssignInspectorModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Assign Inspector</h2>
                        <p className="text-sm text-gray-500 mt-0.5 truncate max-w-[280px]">{propertyAddress}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex size-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                    <div className="p-2">
                        {MOCK_INSPECTORS.map((inspector) => (
                            <button
                                key={inspector.id}
                                onClick={() => {
                                    onAssign(inspector.id);
                                    onClose();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                            >
                                <Avatar
                                    size="md"
                                    src={inspector.avatar}
                                    alt={inspector.fullName}
                                    initials={inspector.fullName.split(" ").map(n => n[0]).join("")}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900">{inspector.fullName}</p>
                                    <p className="text-xs text-gray-500">Available</p>
                                </div>
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <MapPin className="size-3.5" />
                                    <span>{inspector.distance}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <Button color="secondary" size="md" className="w-full" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Table View Components
// ============================================================================

function InspectionsTable({
    inspections,
    isAdmin,
    onAssignClick,
}: {
    inspections: Inspection[];
    isAdmin: boolean;
    onAssignClick: (inspection: Inspection) => void;
}) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Property
                        </th>
                        {isAdmin && (
                            <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                Inspector
                            </th>
                        )}
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Date & Time
                        </th>
                        <th scope="col" className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {inspections.map((inspection) => (
                        <InspectionTableRow
                            key={inspection.id}
                            inspection={inspection}
                            isAdmin={isAdmin}
                            onAssignClick={onAssignClick}
                        />
                    ))}
                </tbody>
            </table>

            {inspections.length === 0 && (
                <div className="py-12 text-center">
                    <Search className="mx-auto size-8 text-gray-300" />
                    <p className="mt-2 text-sm text-gray-500">No inspections found</p>
                </div>
            )}
        </div>
    );
}

function InspectionTableRow({
    inspection,
    isAdmin,
    onAssignClick,
}: {
    inspection: Inspection;
    isAdmin: boolean;
    onAssignClick: (inspection: Inspection) => void;
}) {
    const scheduledDate = new Date(inspection.scheduledDate);
    const isUrgent = inspection.priority === "Urgent";
    const imageUrl = inspection.property?.imageUrl || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop";

    // Determine action button label
    const getActionLabel = (): string => {
        if (isAdmin) {
            return "View";
        }
        // Inspector logic
        if (inspection.status === "Scheduled") return "Start";
        if (inspection.status === "In Progress") return "Resume";
        return "View";
    };

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            {/* Property Column with Workflow Icon */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-5">
                    {/* Workflow Icon - Monochrome */}
                    <WorkflowIcon workflow={inspection.workflow} />
                    {/* Property Info Group */}
                    <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-200">
                            <PropertyImage
                                src={imageUrl}
                                alt={inspection.property?.address || "Property"}
                                className="w-full h-full"
                            />
                        </div>
                        {/* Address + Location */}
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {inspection.property?.address || `Property ${inspection.propertyId}`}
                            </p>
                            <p className="text-sm text-gray-500">
                                {inspection.property?.city}, {inspection.property?.state}
                            </p>
                        </div>
                    </div>
                </div>
            </td>

            {/* Inspector Column - Admin only */}
            {isAdmin && (
                <td className="px-6 py-4 whitespace-nowrap">
                    {inspection.inspector ? (
                        <div className="flex items-center gap-2">
                            <Avatar
                                size="sm"
                                src={inspection.inspector.avatar}
                                alt={inspection.inspector.fullName}
                                initials={inspection.inspector.fullName.split(" ").map(n => n[0]).join("")}
                            />
                            <span className="text-sm text-gray-700">{inspection.inspector.fullName}</span>
                        </div>
                    ) : (
                        <button
                            onClick={() => onAssignClick(inspection)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                        >
                            <UserPlus className="size-3.5" />
                            Assign
                        </button>
                    )}
                </td>
            )}

            {/* Type Column - Monochrome (Gray) */}
            <td className="px-6 py-4 whitespace-nowrap">
                <GrayBadge>{inspection.type}</GrayBadge>
            </td>

            {/* Status Column - "Hot vs. Cold" with Urgent Badge */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <StatusBadge status={inspection.status} />
                    {isUrgent && <UrgentBadge />}
                </div>
            </td>

            {/* Date & Time Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(scheduledDate)}</div>
                <div className="text-xs text-gray-500">{formatTime(inspection.scheduledTime)}</div>
            </td>

            {/* Action Column - Text only, no icons */}
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <Link href={`/inspections/${inspection.id}`}>
                    <Button color="tertiary" size="sm">
                        {getActionLabel()}
                    </Button>
                </Link>
            </td>
        </tr>
    );
}

// ============================================================================
// Map View Components (Cards + Map)
// ============================================================================

/**
 * Map Card - Horizontal layout matching Table View visual fidelity
 */
function InspectionCard({ inspection, isAdmin }: { inspection: Inspection; isAdmin: boolean }) {
    const isUrgent = inspection.priority === "Urgent";
    const imageUrl = inspection.property?.imageUrl || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop";

    // Action label for card
    const getActionLabel = (): string => {
        if (isAdmin) return "View";
        if (inspection.status === "Scheduled") return "Start";
        if (inspection.status === "In Progress") return "Resume";
        return "View";
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all">
            <div className="flex items-center gap-4 p-4">
                {/* Left - Property Image */}
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-200">
                    <PropertyImage
                        src={imageUrl}
                        alt={inspection.property?.address || "Property"}
                        className="w-full h-full"
                    />
                </div>

                {/* Middle - Content */}
                <div className="flex-1 min-w-0">
                    {/* Row 1: Address */}
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {inspection.property?.address || `Property ${inspection.propertyId}`}
                    </h3>
                    {/* Row 2: Badge Container */}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <GrayBadge>{inspection.type}</GrayBadge>
                        <StatusBadge status={inspection.status} />
                        {isUrgent && <UrgentBadge />}
                    </div>
                </div>

                {/* Right - CTA Button */}
                <Link href={`/inspections/${inspection.id}`} className="shrink-0">
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors">
                        {getActionLabel()}
                    </button>
                </Link>
            </div>
        </div>
    );
}

/**
 * Map Marker - Pastel circle with icon
 */
function MapMarker({
    status,
    isUrgent,
    style,
}: {
    status: InspectionStatus;
    isUrgent?: boolean;
    style?: React.CSSProperties;
}) {
    // Pastel color mapping
    const getMarkerConfig = () => {
        if (isUrgent) {
            return {
                bg: "bg-orange-100",
                border: "border-orange-200",
                icon: Zap,
                iconColor: "text-orange-600",
                pulse: true,
            };
        }
        switch (status) {
            case "Scheduled":
                return {
                    bg: "bg-blue-100",
                    border: "border-blue-200",
                    icon: Clock,
                    iconColor: "text-blue-600",
                    pulse: false,
                };
            case "In Progress":
                return {
                    bg: "bg-indigo-100",
                    border: "border-indigo-200",
                    icon: PlayCircle,
                    iconColor: "text-indigo-600",
                    pulse: true,
                };
            case "Pending Review":
                return {
                    bg: "bg-amber-100",
                    border: "border-amber-200",
                    icon: Clock,
                    iconColor: "text-amber-600",
                    pulse: false,
                };
            case "Completed":
                return {
                    bg: "bg-gray-100",
                    border: "border-gray-300",
                    icon: CheckCircle2,
                    iconColor: "text-gray-500",
                    pulse: false,
                };
            default:
                return {
                    bg: "bg-gray-100",
                    border: "border-gray-300",
                    icon: MapPin,
                    iconColor: "text-gray-500",
                    pulse: false,
                };
        }
    };

    const config = getMarkerConfig();
    const Icon = config.icon;

    return (
        <div className="absolute group cursor-pointer" style={style}>
            <div
                className={cx(
                    "w-10 h-10 rounded-full border-2 shadow-md flex items-center justify-center transition-transform hover:scale-110",
                    config.bg,
                    config.border,
                    config.pulse && "animate-pulse"
                )}
            >
                <Icon className={cx("size-5", config.iconColor)} />
            </div>
        </div>
    );
}

/**
 * Legend Item - Pastel circle matching map markers
 */
function LegendItem({
    label,
    count,
    bgColor,
    borderColor,
    icon: Icon,
    iconColor,
}: {
    label: string;
    count?: number;
    bgColor: string;
    borderColor: string;
    icon: typeof Clock;
    iconColor: string;
}) {
    return (
        <div className="flex items-center gap-2.5">
            <div
                className={cx(
                    "w-6 h-6 rounded-full border flex items-center justify-center",
                    bgColor,
                    borderColor
                )}
            >
                <Icon className={cx("size-3", iconColor)} />
            </div>
            <span className="text-sm text-gray-700">
                {label}
                {count !== undefined && <span className="text-gray-400 ml-1">({count})</span>}
            </span>
        </div>
    );
}

function MapPanel({ inspections }: { inspections: Inspection[] }) {
    const scheduledCount = inspections.filter(i => i.status === "Scheduled").length;
    const inProgressCount = inspections.filter(i => i.status === "In Progress").length;
    const completedCount = inspections.filter(i => i.status === "Completed").length;
    const urgentCount = inspections.filter(i => i.priority === "Urgent").length;

    return (
        <div className="relative h-full bg-slate-50 overflow-hidden">
            {/* Stylized Map Background */}
            <div className="absolute inset-0">
                {/* Subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-blue-50" />
                {/* Grid lines */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(148,163,184,0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(148,163,184,0.4) 1px, transparent 1px)
                        `,
                        backgroundSize: "50px 50px",
                    }}
                />
                {/* Decorative shapes */}
                <div className="absolute top-[20%] right-[10%] w-32 h-32 rounded-full bg-blue-100/40 blur-2xl" />
                <div className="absolute bottom-[30%] left-[20%] w-40 h-40 rounded-full bg-indigo-100/30 blur-3xl" />
            </div>

            {/* Map Markers - Pastel Circles */}
            <div className="absolute inset-0">
                <MapMarker status="Scheduled" style={{ top: "20%", left: "25%" }} />
                <MapMarker status="In Progress" style={{ top: "35%", left: "55%" }} />
                <MapMarker status="Completed" style={{ top: "55%", left: "30%" }} />
                <MapMarker status="Scheduled" isUrgent style={{ top: "25%", left: "65%" }} />
                <MapMarker status="Pending Review" style={{ top: "65%", left: "60%" }} />
                <MapMarker status="In Progress" style={{ top: "45%", left: "40%" }} />
            </div>

            {/* Legend - Bottom Right */}
            <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-gray-100">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Legend</h4>
                <div className="space-y-2.5">
                    <LegendItem
                        label="Scheduled"
                        count={scheduledCount}
                        bgColor="bg-blue-100"
                        borderColor="border-blue-200"
                        icon={Clock}
                        iconColor="text-blue-600"
                    />
                    <LegendItem
                        label="In Progress"
                        count={inProgressCount}
                        bgColor="bg-indigo-100"
                        borderColor="border-indigo-200"
                        icon={PlayCircle}
                        iconColor="text-indigo-600"
                    />
                    <LegendItem
                        label="Completed"
                        count={completedCount}
                        bgColor="bg-gray-100"
                        borderColor="border-gray-300"
                        icon={CheckCircle2}
                        iconColor="text-gray-500"
                    />
                    <LegendItem
                        label="Urgent"
                        count={urgentCount}
                        bgColor="bg-orange-100"
                        borderColor="border-orange-200"
                        icon={Zap}
                        iconColor="text-orange-600"
                    />
                </div>
            </div>

            {/* Location Badge - Top Right */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md border border-gray-100">
                <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-900">Chicago, IL</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Empty State
// ============================================================================

function EmptyState({ searchQuery, workflowFilter }: { searchQuery: string; workflowFilter: WorkflowFilter }) {
    const filterLabel = workflowFilter === "origination" ? "Origination" : workflowFilter === "servicing" ? "Servicing" : "";

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="size-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No inspections found</h3>
            <p className="text-gray-500 text-center max-w-sm">
                {searchQuery
                    ? `No results for "${searchQuery}"${filterLabel ? ` in ${filterLabel}` : ""}. Try adjusting your search.`
                    : filterLabel
                        ? `No ${filterLabel} inspections match your current filters.`
                        : "No inspections match your current filters."
                }
            </p>
        </div>
    );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function InspectionsPage() {
    const { isAdmin } = useUserRole();
    const [view, setView] = useState<"list" | "map">("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [workflowFilter, setWorkflowFilter] = useState<WorkflowFilter>("all");
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);

    // Filter inspections based on search query and workflow
    const filteredInspections = INSPECTIONS.filter((inspection) => {
        // Workflow filter
        if (workflowFilter === "origination" && inspection.workflow !== "ORIGINATION_MF") {
            return false;
        }
        if (workflowFilter === "servicing" && inspection.workflow !== "SERVICING_MBA") {
            return false;
        }

        // Search filter
        if (!searchQuery.trim()) return true;

        const query = searchQuery.toLowerCase();
        const address = inspection.property?.address?.toLowerCase() || "";
        const city = inspection.property?.city?.toLowerCase() || "";
        const loanNumber = inspection.loanNumber?.toLowerCase() || "";
        const inspectorName = inspection.inspector?.fullName?.toLowerCase() || "";

        return (
            address.includes(query) ||
            city.includes(query) ||
            loanNumber.includes(query) ||
            inspectorName.includes(query)
        );
    });

    const isListView = view === "list";

    const handleAssignClick = (inspection: Inspection) => {
        setSelectedInspection(inspection);
        setAssignModalOpen(true);
    };

    const handleAssign = (inspectorId: string) => {
        console.log("Assigning inspector:", inspectorId, "to inspection:", selectedInspection?.id);
        alert(`Inspector assigned to ${selectedInspection?.property?.address || "property"}`);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            {/* ================================================================
                HEADER SECTION
            ================================================================ */}
            <div className="shrink-0 border-b border-gray-200 bg-white">
                <div className="px-6 lg:px-8 py-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                {isAdmin ? "Inspections" : "My Inspections"}
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                {isAdmin
                                    ? "Manage and track property inspections"
                                    : "Your scheduled and ongoing inspections"
                                }
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button color="secondary" size="md" iconLeading={Filter}>
                                Filter
                            </Button>
                            {isAdmin && (
                                <Button color="primary" size="md" iconLeading={Plus}>
                                    Schedule Inspection
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================
                TOOLBAR - Search, Workflow Filter & View Toggle
            ================================================================ */}
            <div className="shrink-0 border-b border-gray-200 bg-white px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder={isAdmin ? "Search by address, loan #, or inspector..." : "Search by address or loan #..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        />
                    </div>

                    {/* Workflow Filter + View Toggle */}
                    <div className="flex items-center gap-3">
                        {/* Workflow Filter */}
                        <WorkflowFilterToggle value={workflowFilter} onChange={setWorkflowFilter} />

                        {/* Divider */}
                        <div className="w-px h-8 bg-gray-200" />

                        {/* List / Map Toggle */}
                        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setView("list")}
                                className={cx(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                    view === "list"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                <ListIcon className="size-4" />
                                List
                            </button>
                            <button
                                onClick={() => setView("map")}
                                className={cx(
                                    "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all",
                                    view === "map"
                                        ? "bg-white text-gray-900 shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                )}
                            >
                                <MapIcon className="size-4" />
                                Map
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================
                CONTENT AREA
            ================================================================ */}
            <div className="flex-1 overflow-hidden bg-gray-50">
                {isListView ? (
                    <div className="h-full overflow-y-auto p-6">
                        <p className="text-sm text-gray-500 mb-4">
                            Showing {filteredInspections.length} of {INSPECTIONS.length} inspections
                            {workflowFilter !== "all" && (
                                <span className="text-gray-400">
                                    {" "}• Filtered by {workflowFilter === "origination" ? "Origination" : "Servicing"}
                                </span>
                            )}
                        </p>

                        {filteredInspections.length > 0 ? (
                            <InspectionsTable
                                inspections={filteredInspections}
                                isAdmin={isAdmin}
                                onAssignClick={handleAssignClick}
                            />
                        ) : (
                            <EmptyState searchQuery={searchQuery} workflowFilter={workflowFilter} />
                        )}
                    </div>
                ) : (
                    <div className="flex h-full">
                        <div className="w-1/2 min-w-[420px] border-r border-gray-200 overflow-y-auto">
                            <div className="p-6">
                                <p className="text-sm text-gray-500 mb-4">
                                    Showing {filteredInspections.length} of {INSPECTIONS.length} inspections
                                    {workflowFilter !== "all" && (
                                        <span className="text-gray-400">
                                            {" "}• {workflowFilter === "origination" ? "Origination" : "Servicing"}
                                        </span>
                                    )}
                                </p>

                                {filteredInspections.length > 0 ? (
                                    <div className="space-y-3">
                                        {filteredInspections.map((inspection) => (
                                            <InspectionCard key={inspection.id} inspection={inspection} isAdmin={isAdmin} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState searchQuery={searchQuery} workflowFilter={workflowFilter} />
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <MapPanel inspections={filteredInspections} />
                        </div>
                    </div>
                )}
            </div>

            {/* ================================================================
                ASSIGN INSPECTOR MODAL
            ================================================================ */}
            <AssignInspectorModal
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                onAssign={handleAssign}
                propertyAddress={selectedInspection?.property?.address || "Unknown Property"}
            />
        </div>
    );
}
