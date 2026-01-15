"use client";

import { useState } from "react";
import Link from "next/link";
import {
    CheckCircle2,
    Clock,
    ClipboardList,
    Eye,
    FileText,
    Filter,
    List as ListIcon,
    Map as MapIcon,
    MapPin,
    PlayCircle,
    Plus,
    Search,
    XCircle,
    Zap,
} from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { PropertyImage } from "@/components/ui/property-image";
import { INSPECTIONS } from "@/data/mock-data";
import { useUserRole } from "@/contexts/user-role-context";
import { cx } from "@/utils/cx";
import type { Inspection, InspectionStatus } from "@/types";

// ============================================================================
// Status Configuration
// ============================================================================

const STATUS_CONFIG: Record<
    InspectionStatus,
    {
        icon: typeof Clock;
        bgColor: string;
        textColor: string;
        borderColor: string;
    }
> = {
    Scheduled: {
        icon: Clock,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
    },
    "In Progress": {
        icon: PlayCircle,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
    },
    Completed: {
        icon: CheckCircle2,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
    },
    "Pending Review": {
        icon: Clock,
        bgColor: "bg-purple-50",
        textColor: "text-purple-700",
        borderColor: "border-purple-200",
    },
    Cancelled: {
        icon: XCircle,
        bgColor: "bg-gray-100",
        textColor: "text-gray-500",
        borderColor: "border-gray-200",
    },
};

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Status Badge - Pill-shaped badge with icon
 */
function StatusBadge({ status }: { status: InspectionStatus }) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border",
                config.bgColor,
                config.textColor,
                config.borderColor
            )}
        >
            <Icon className="size-3.5" />
            {status}
        </span>
    );
}

/**
 * Workflow Badge - Blue for Servicing, Purple for Origination
 */
function WorkflowBadge({ workflow }: { workflow: string }) {
    const isOrigination = workflow === "ORIGINATION_MF";

    return (
        <span
            className={cx(
                "inline-flex items-center gap-1 rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                isOrigination
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
            )}
        >
            {isOrigination ? (
                <>
                    <FileText className="size-2.5" />
                    Origination
                </>
            ) : (
                <>
                    <ClipboardList className="size-2.5" />
                    Servicing
                </>
            )}
        </span>
    );
}

/**
 * Type Badge - Badge for inspection type
 */
function TypeBadge({ type }: { type: string }) {
    return (
        <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700">
            {type}
        </span>
    );
}

/**
 * Urgent Indicator - Orange lightning bolt
 */
function UrgentIndicator() {
    return (
        <span className="inline-flex items-center gap-0.5 text-orange-500" title="Urgent">
            <Zap className="size-4 fill-orange-500" />
        </span>
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

// ============================================================================
// Table View Components
// ============================================================================

function InspectionsTable({ inspections }: { inspections: Inspection[] }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Property
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Inspector
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Type
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Action
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {inspections.map((inspection) => (
                        <InspectionTableRow key={inspection.id} inspection={inspection} />
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

function InspectionTableRow({ inspection }: { inspection: Inspection }) {
    const scheduledDate = new Date(inspection.scheduledDate);
    const isUrgent = inspection.priority === "Urgent";
    const imageUrl = inspection.property?.imageUrl || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100&h=100&fit=crop";

    return (
        <tr className="hover:bg-gray-50 transition-colors">
            {/* Property Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                        <PropertyImage
                            src={imageUrl}
                            alt={inspection.property?.address || "Property"}
                            className="w-full h-full"
                        />
                    </div>
                    {/* Address + Location + Workflow */}
                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-gray-900 truncate">
                                {inspection.property?.address || `Property ${inspection.propertyId}`}
                            </p>
                            <WorkflowBadge workflow={inspection.workflow} />
                        </div>
                        <p className="text-sm text-gray-500">
                            {inspection.property?.city}, {inspection.property?.state}
                        </p>
                    </div>
                </div>
            </td>

            {/* Inspector Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                {inspection.inspector ? (
                    <div className="flex items-center gap-2">
                        <Avatar
                            size="sm"
                            src={inspection.inspector.avatar}
                            alt={inspection.inspector.fullName}
                            initials={inspection.inspector.fullName.split(" ").map(n => n[0]).join("")}
                        />
                        <span className="text-sm text-gray-900">{inspection.inspector.fullName}</span>
                    </div>
                ) : (
                    <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 border border-amber-200">
                        Unassigned
                    </span>
                )}
            </td>

            {/* Type Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <TypeBadge type={inspection.type} />
            </td>

            {/* Status Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-2">
                    <StatusBadge status={inspection.status} />
                    {isUrgent && <UrgentIndicator />}
                </div>
            </td>

            {/* Date Column */}
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{formatDate(scheduledDate)}</div>
                <div className="text-xs text-gray-500">{inspection.scheduledTime}</div>
            </td>

            {/* Action Column */}
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <Link href={`/inspections/${inspection.id}`}>
                    <Button color="tertiary" size="sm" iconLeading={Eye}>
                        View
                    </Button>
                </Link>
            </td>
        </tr>
    );
}

// ============================================================================
// Map View Components (Cards + Map)
// ============================================================================

function InspectionCard({ inspection }: { inspection: Inspection }) {
    const scheduledDate = new Date(inspection.scheduledDate);
    const isUrgent = inspection.priority === "Urgent";

    return (
        <Link href={`/inspections/${inspection.id}`} className="block group">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all">
                <div className="flex items-start gap-4">
                    {/* Date Box */}
                    <DateBox date={scheduledDate} />

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Address + Workflow */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-gray-900 text-base">
                                {inspection.property?.address || `Property ${inspection.propertyId}`}
                            </h3>
                            <WorkflowBadge workflow={inspection.workflow} />
                        </div>

                        {/* Meta */}
                        <div className="flex items-center gap-3 mt-2 text-sm text-gray-500 flex-wrap">
                            <div className="flex items-center gap-1">
                                <Clock className="size-3.5 text-gray-400" />
                                <span>{inspection.scheduledTime}</span>
                            </div>
                            <span className="text-gray-300">|</span>
                            <div className="flex items-center gap-1">
                                <MapPin className="size-3.5 text-gray-400" />
                                <span>{inspection.property?.city}, {inspection.property?.state}</span>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                        <StatusBadge status={inspection.status} />
                        {isUrgent && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-600 border border-orange-200">
                                <Zap className="size-3 fill-orange-500" />
                                Urgent
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}

function MapPanel({ inspections }: { inspections: Inspection[] }) {
    const scheduledCount = inspections.filter(i => i.status === "Scheduled").length;
    const inProgressCount = inspections.filter(i => i.status === "In Progress").length;
    const completedCount = inspections.filter(i => i.status === "Completed").length;

    return (
        <div className="relative h-full bg-slate-100 overflow-hidden">
            {/* Stylized Map Background */}
            <div className="absolute inset-0">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-200/50 to-transparent" />
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(100,116,139,0.3) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(100,116,139,0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: "60px 60px",
                    }}
                />
            </div>

            {/* Map Pins */}
            <div className="absolute inset-0">
                <div className="absolute top-[25%] left-[30%] group cursor-pointer">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
                        <Clock className="size-4" />
                    </div>
                </div>
                <div className="absolute top-[40%] left-[50%] group cursor-pointer">
                    <div className="w-8 h-8 bg-amber-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white animate-pulse">
                        <PlayCircle className="size-4" />
                    </div>
                </div>
                <div className="absolute top-[60%] left-[35%] group cursor-pointer">
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
                        <CheckCircle2 className="size-4" />
                    </div>
                </div>
                <div className="absolute top-[30%] left-[60%] group cursor-pointer">
                    <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
                        <FileText className="size-4" />
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Legend</h4>
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500" />
                        <span className="text-sm text-gray-700">Scheduled ({scheduledCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500" />
                        <span className="text-sm text-gray-700">In Progress ({inProgressCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm text-gray-700">Completed ({completedCount})</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-500" />
                        <span className="text-sm text-gray-700">Origination</span>
                    </div>
                </div>
            </div>

            {/* Location Badge */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                <div className="flex items-center gap-2">
                    <MapPin className="size-4 text-brand-600" />
                    <span className="text-sm font-medium text-gray-900">Chicago, IL</span>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Empty State
// ============================================================================

function EmptyState({ searchQuery }: { searchQuery: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="size-7 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No inspections found</h3>
            <p className="text-gray-500 text-center max-w-sm">
                {searchQuery
                    ? `No results for "${searchQuery}". Try adjusting your search.`
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

    // Filter inspections based on search query
    const filteredInspections = INSPECTIONS.filter((inspection) => {
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
    const isMapView = view === "map";

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            {/* ================================================================
                HEADER SECTION
            ================================================================ */}
            <div className="shrink-0 border-b border-gray-200 bg-white">
                <div className="px-6 lg:px-8 py-5">
                    {/* Title Row with Actions */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                {isAdmin ? "Inspections" : "My Inspections"}
                            </h1>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Manage and track property inspections
                            </p>
                        </div>

                        {/* Header Action Buttons */}
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
                TOOLBAR - Search & View Toggle
            ================================================================ */}
            <div className="shrink-0 border-b border-gray-200 bg-white px-6 lg:px-8 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Search Input */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by address, loan #, or inspector..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                        />
                    </div>

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

            {/* ================================================================
                CONTENT AREA
            ================================================================ */}
            <div className="flex-1 overflow-hidden bg-gray-50">
                {isListView ? (
                    /* ============================================
                        LIST VIEW - Data Table
                    ============================================ */
                    <div className="h-full overflow-y-auto p-6">
                        {/* Results Count */}
                        <p className="text-sm text-gray-500 mb-4">
                            Showing {filteredInspections.length} of {INSPECTIONS.length} inspections
                        </p>

                        {filteredInspections.length > 0 ? (
                            <InspectionsTable inspections={filteredInspections} />
                        ) : (
                            <EmptyState searchQuery={searchQuery} />
                        )}
                    </div>
                ) : (
                    /* ============================================
                        MAP VIEW - Split View (Cards + Map)
                    ============================================ */
                    <div className="flex h-full">
                        {/* Left Panel: Card List */}
                        <div className="w-1/2 min-w-[420px] border-r border-gray-200 overflow-y-auto">
                            <div className="p-6">
                                <p className="text-sm text-gray-500 mb-4">
                                    Showing {filteredInspections.length} of {INSPECTIONS.length} inspections
                                </p>

                                {filteredInspections.length > 0 ? (
                                    <div className="space-y-3">
                                        {filteredInspections.map((inspection) => (
                                            <InspectionCard key={inspection.id} inspection={inspection} />
                                        ))}
                                    </div>
                                ) : (
                                    <EmptyState searchQuery={searchQuery} />
                                )}
                            </div>
                        </div>

                        {/* Right Panel: Map */}
                        <div className="flex-1">
                            <MapPanel inspections={filteredInspections} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
