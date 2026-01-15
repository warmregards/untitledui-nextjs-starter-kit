"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Calendar,
    CheckCircle2,
    Clock,
    ClipboardList,
    FileText,
    Filter,
    List as ListIcon,
    Map as MapIcon,
    MapPin,
    Maximize2,
    Minimize2,
    PlayCircle,
    Plus,
    Search,
    XCircle,
    Zap,
} from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
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
        badgeColor: "brand" | "orange" | "success" | "gray" | "warning";
    }
> = {
    Scheduled: {
        icon: Clock,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
        borderColor: "border-blue-200",
        badgeColor: "brand",
    },
    "In Progress": {
        icon: PlayCircle,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
        badgeColor: "orange",
    },
    Completed: {
        icon: CheckCircle2,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
        borderColor: "border-green-200",
        badgeColor: "success",
    },
    "Pending Review": {
        icon: Clock,
        bgColor: "bg-amber-50",
        textColor: "text-amber-700",
        borderColor: "border-amber-200",
        badgeColor: "warning",
    },
    Cancelled: {
        icon: XCircle,
        bgColor: "bg-gray-100",
        textColor: "text-gray-500",
        borderColor: "border-gray-200",
        badgeColor: "gray",
    },
};

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Status Badge - Consistent pill-style badge for inspection status
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
 * Urgency Indicator - Orange chip for urgent priority items
 */
function UrgencyBadge() {
    return (
        <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-orange-700 border border-orange-200">
            <Zap className="size-3" />
            Urgent
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
                "inline-flex items-center gap-1 rounded text-[10px] font-bold uppercase tracking-wide px-2 py-0.5",
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
 * Date Box - Square box showing month and day stacked
 */
function DateBox({ date }: { date: Date }) {
    const month = date.toLocaleDateString("en-US", { month: "short" }).toUpperCase();
    const day = date.getDate();

    return (
        <div className="flex flex-col items-center justify-center w-14 h-14 bg-gray-100 rounded-lg text-gray-600 shrink-0 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
            <span className="text-[10px] font-bold tracking-wider">{month}</span>
            <span className="text-xl font-bold leading-none">{day}</span>
        </div>
    );
}

/**
 * Inspection Card - The main card component for each inspection
 */
function InspectionCard({ inspection }: { inspection: Inspection }) {
    const scheduledDate = new Date(inspection.scheduledDate);
    const isUrgent = inspection.priority === "Urgent";

    return (
        <Link href={`/inspections/${inspection.id}`} className="block group">
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-xs hover:shadow-md hover:border-brand-300 transition-all">
                <div className="flex items-start gap-4">
                    {/* Date Box */}
                    <DateBox date={scheduledDate} />

                    {/* Main Content */}
                    <div className="flex-1 min-w-0">
                        {/* Top Row: Address + Badges */}
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                {/* Address */}
                                <h3 className="font-semibold text-gray-900 text-base truncate">
                                    {inspection.property?.address || `Property ${inspection.propertyId}`}
                                </h3>

                                {/* City, State + Workflow Badge */}
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-sm text-gray-500">
                                        {inspection.property?.city}, {inspection.property?.state}
                                    </span>
                                    <WorkflowBadge workflow={inspection.workflow} />
                                </div>
                            </div>

                            {/* Status + Urgent */}
                            <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <StatusBadge status={inspection.status} />
                                {isUrgent && <UrgencyBadge />}
                            </div>
                        </div>

                        {/* Bottom Row: Meta Info */}
                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            {/* Time */}
                            <div className="flex items-center gap-1.5">
                                <Clock className="size-3.5" />
                                <span>{inspection.scheduledTime}</span>
                            </div>

                            {/* Type */}
                            <span className="bg-gray-100 px-2 py-0.5 rounded text-xs font-medium text-gray-600">
                                {inspection.type}
                            </span>

                            {/* Inspector */}
                            {inspection.inspector ? (
                                <div className="flex items-center gap-1.5">
                                    <Avatar
                                        size="xs"
                                        src={inspection.inspector.avatar}
                                        alt={inspection.inspector.fullName}
                                        initials={inspection.inspector.fullName.split(" ").map(n => n[0]).join("")}
                                    />
                                    <span className="text-gray-600">{inspection.inspector.fullName}</span>
                                </div>
                            ) : (
                                <span className="text-amber-600 font-medium">Unassigned</span>
                            )}

                            {/* Loan Number (if origination) */}
                            {inspection.loanNumber && (
                                <span className="text-gray-400 font-mono text-xs">
                                    Loan #{inspection.loanNumber}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

/**
 * Map Placeholder - Stylized Chicago map with pins
 */
function MapPanel({ inspections, isExpanded }: { inspections: Inspection[]; isExpanded: boolean }) {
    const scheduledCount = inspections.filter(i => i.status === "Scheduled").length;
    const inProgressCount = inspections.filter(i => i.status === "In Progress").length;
    const completedCount = inspections.filter(i => i.status === "Completed").length;

    return (
        <div className="relative h-full bg-slate-100 overflow-hidden">
            {/* Stylized Map Background */}
            <div className="absolute inset-0">
                {/* Lake Michigan */}
                <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-200/50 to-transparent" />

                {/* Grid Pattern (Streets) */}
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

                {/* Chicago River */}
                <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 400 400" preserveAspectRatio="xMidYMid slice">
                    <path
                        d="M0,200 Q100,180 150,200 T250,180 T350,200 L350,210 Q250,190 150,210 T0,210 Z"
                        fill="rgba(59, 130, 246, 0.3)"
                    />
                </svg>
            </div>

            {/* Map Pins */}
            <div className="absolute inset-0">
                {/* Pin 1 - Scheduled */}
                <div className="absolute top-[25%] left-[30%] group cursor-pointer">
                    <div className="w-8 h-8 bg-blue-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
                        <Clock className="size-4" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        123 N Michigan Ave
                    </div>
                </div>

                {/* Pin 2 - In Progress */}
                <div className="absolute top-[40%] left-[50%] group cursor-pointer">
                    <div className="w-8 h-8 bg-amber-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white animate-pulse">
                        <PlayCircle className="size-4" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        789 S State St
                    </div>
                </div>

                {/* Pin 3 - Completed */}
                <div className="absolute top-[60%] left-[35%] group cursor-pointer">
                    <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
                        <CheckCircle2 className="size-4" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        987 W Madison St
                    </div>
                </div>

                {/* Pin 4 - Origination */}
                <div className="absolute top-[30%] left-[60%] group cursor-pointer">
                    <div className="w-8 h-8 bg-purple-500 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white">
                        <FileText className="size-4" />
                    </div>
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white rounded shadow-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        990 Lake Shore Dr
                    </div>
                </div>
            </div>

            {/* Location Badge (Compact Mode) */}
            {!isExpanded && (
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md">
                    <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-brand-600" />
                        <span className="text-sm font-medium text-gray-900">Chicago Loop</span>
                        <span className="text-xs text-gray-500">{inspections.length} locations</span>
                    </div>
                </div>
            )}

            {/* Legend (Expanded Mode) */}
            {isExpanded && (
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
            )}
        </div>
    );
}

/**
 * Empty State - When no inspections match filters
 */
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

    const isMapView = view === "map";

    return (
        <div className="flex flex-col h-[calc(100vh-64px)]">
            {/* ================================================================
                HEADER SECTION
            ================================================================ */}
            <div className="shrink-0 border-b border-gray-200 bg-white">
                <div className="px-6 lg:px-8 py-6">
                    {/* Title Row */}
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                {isAdmin ? "Inspections" : "My Inspections"}
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Manage your schedule and field reports
                            </p>
                        </div>

                        {/* Action Buttons */}
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

                    {/* Toolbar Row */}
                    <div className="flex items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search address or loan #..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                            />
                        </div>

                        {/* View Toggle */}
                        <div className="flex items-center bg-gray-100 p-1 rounded-lg">
                            <button
                                onClick={() => setView("list")}
                                className={cx(
                                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
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
                                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all",
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
                CONTENT AREA - Elastic Split View
            ================================================================ */}
            <div className="flex-1 flex overflow-hidden bg-gray-50">
                {/* Left Panel: Inspection List */}
                <div
                    className={cx(
                        "overflow-y-auto transition-all duration-300 ease-in-out",
                        isMapView
                            ? "w-[45%] min-w-[400px] border-r border-gray-200"
                            : "w-full"
                    )}
                >
                    <div className="p-6 lg:p-8">
                        {/* Results Count */}
                        <div className="text-sm text-gray-500 mb-4">
                            Showing {filteredInspections.length} of {INSPECTIONS.length} inspections
                        </div>

                        {/* Inspection Cards */}
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

                {/* Right Panel: Map (Only visible in Map View) */}
                {isMapView && (
                    <div className="flex-1 relative">
                        <MapPanel inspections={filteredInspections} isExpanded={isMapView} />

                        {/* Expand/Collapse Toggle */}
                        <button
                            onClick={() => setView(view === "map" ? "list" : "map")}
                            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 bg-white rounded-lg shadow-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                            {isMapView ? (
                                <>
                                    <Minimize2 className="size-4" />
                                    Collapse
                                </>
                            ) : (
                                <>
                                    <Maximize2 className="size-4" />
                                    Expand Map
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
