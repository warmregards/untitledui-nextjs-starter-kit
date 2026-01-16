"use client";

import { useState } from "react";
import {
    Check,
    DownloadCloud,
    MapPin,
    Navigation,
    Shirt,
} from "lucide-react";
import Link from "next/link";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

interface RouteStop {
    id: string;
    time: string;
    address: string;
    city: string;
    workflow: "ORIGINATION_MF" | "SERVICING_MBA";
    type: string;
    driveTime: string;
    status: "completed" | "current" | "upcoming";
}

// ============================================================================
// Mock Data - Tomorrow's Route
// ============================================================================

const DAILY_ROUTE: RouteStop[] = [
    {
        id: "stop-1",
        time: "9:00 AM",
        address: "500 N Lake Shore Dr",
        city: "Chicago, IL",
        workflow: "ORIGINATION_MF",
        type: "Origination",
        driveTime: "Start",
        status: "upcoming",
    },
    {
        id: "stop-2",
        time: "11:30 AM",
        address: "1200 S Michigan Ave",
        city: "Chicago, IL",
        workflow: "SERVICING_MBA",
        type: "Annual",
        driveTime: "25 min drive",
        status: "upcoming",
    },
    {
        id: "stop-3",
        time: "2:00 PM",
        address: "350 W Huron St",
        city: "Chicago, IL",
        workflow: "SERVICING_MBA",
        type: "Move-Out",
        driveTime: "18 min drive",
        status: "upcoming",
    },
    {
        id: "stop-4",
        time: "4:30 PM",
        address: "888 N Wabash Ave",
        city: "Chicago, IL",
        workflow: "SERVICING_MBA",
        type: "Annual",
        driveTime: "12 min drive",
        status: "upcoming",
    },
];

// ============================================================================
// Helper Functions
// ============================================================================

function getTomorrowDate(): string {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString("en-US", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });
}

// ============================================================================
// Sub-Components
// ============================================================================

/**
 * Attire Alert Banner - Subtle left border style
 */
function AttireAlertBanner({ stopNumber }: { stopNumber: number }) {
    return (
        <div
            className="flex items-center gap-2 border-l-4 border-purple-600 bg-white px-4 py-2.5"
            role="alert"
        >
            <Shirt className="size-4 text-purple-600" aria-hidden="true" />
            <span className="text-sm text-purple-700">
                <span className="font-medium">Business Attire</span> for Stop #{stopNumber}
            </span>
        </div>
    );
}

/**
 * Timeline Stepper - Untitled UI Style
 */
function TimelineStepper({ status }: { status: RouteStop["status"] }) {
    if (status === "completed") {
        // Gray circle with check icon
        return (
            <div className="relative z-10 flex size-5 items-center justify-center rounded-full bg-gray-200 shrink-0">
                <Check className="size-3 text-gray-600" />
            </div>
        );
    }

    if (status === "current") {
        // White circle with colored ring
        return (
            <div className="relative z-10 flex size-5 items-center justify-center rounded-full bg-white ring-2 ring-brand-600 shrink-0">
                <div className="size-2 rounded-full bg-brand-600" />
            </div>
        );
    }

    // Future: Empty gray ring
    return (
        <div className="relative z-10 size-5 rounded-full border-2 border-gray-300 bg-white shrink-0" />
    );
}

/**
 * Timeline Stop - Individual stop in the route timeline
 */
function TimelineStop({
    stop,
    index,
    isLast,
    isDownloaded,
    onDownload,
}: {
    stop: RouteStop;
    index: number;
    isLast: boolean;
    isDownloaded: boolean;
    onDownload: () => void;
}) {
    const isOrigination = stop.workflow === "ORIGINATION_MF";
    const stopNumber = index + 1;

    return (
        <div className="relative flex gap-4">
            {/* Timeline Line & Stepper */}
            <div className="flex flex-col items-center">
                <TimelineStepper status={stop.status} />

                {/* Connecting Line */}
                {!isLast && (
                    <div
                        className="w-px flex-1 bg-gray-200 mt-1"
                        aria-hidden="true"
                    />
                )}
            </div>

            {/* Content */}
            <div className={cx("flex-1 pb-6", isLast && "pb-0")}>
                <div className="flex items-start justify-between gap-4">
                    {/* Left: Time & Address */}
                    <div className="min-w-0 flex-1">
                        {/* Time */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-gray-900">
                                {stop.time}
                            </span>
                            <span
                                className={cx(
                                    "rounded-full px-2 py-0.5 text-[10px] font-medium",
                                    isOrigination
                                        ? "bg-purple-100 text-purple-700"
                                        : "bg-gray-100 text-gray-600"
                                )}
                            >
                                {stop.type}
                            </span>
                        </div>

                        {/* Address */}
                        <p className="mt-1 text-sm text-gray-700 truncate">
                            {stop.address}
                        </p>

                        {/* Drive Time Tag */}
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                            {index === 0 ? (
                                <>
                                    <MapPin className="size-3" aria-hidden="true" />
                                    <span>{stop.city}</span>
                                </>
                            ) : (
                                <>
                                    <Navigation className="size-3" aria-hidden="true" />
                                    <span>{stop.driveTime}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Right: Download Button */}
                    <button
                        onClick={onDownload}
                        aria-label={
                            isDownloaded
                                ? `Stop ${stopNumber} downloaded for offline use`
                                : `Download stop ${stopNumber} for offline use`
                        }
                        className={cx(
                            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                            isDownloaded
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                        )}
                    >
                        {isDownloaded ? (
                            <>
                                <Check className="size-3.5" aria-hidden="true" />
                                <span>Downloaded</span>
                            </>
                        ) : (
                            <>
                                <DownloadCloud className="size-3.5" aria-hidden="true" />
                                <span>Download</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Main Component
// ============================================================================

/**
 * InspectorDailyBrief - "The Route Timeline"
 * Tactical view of tomorrow's inspection schedule
 */
export function InspectorDailyBrief() {
    const [downloadedStops, setDownloadedStops] = useState<Set<string>>(new Set());

    const stops = DAILY_ROUTE;
    const totalStops = stops.length;
    const totalMiles = 28; // Mock value

    // Find first origination stop for attire alert
    const firstOriginationIndex = stops.findIndex(
        (s) => s.workflow === "ORIGINATION_MF"
    );
    const hasOrigination = firstOriginationIndex !== -1;

    // Handle download toggle
    const handleDownload = (stopId: string) => {
        setDownloadedStops((prev) => {
            const next = new Set(prev);
            if (next.has(stopId)) {
                next.delete(stopId);
            } else {
                next.add(stopId);
            }
            return next;
        });
    };

    // Calculate download progress
    const downloadedCount = downloadedStops.size;
    const allDownloaded = downloadedCount === totalStops;

    if (totalStops === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby="daily-brief-heading"
            className="rounded-xl bg-white shadow-xs ring-1 ring-gray-200 overflow-hidden"
        >
            {/* ================================================================
                Header Section - Standardized Style
            ================================================================ */}
            <div className="border-b border-gray-200 px-5 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 id="daily-brief-heading" className="text-lg font-semibold text-gray-900">
                            Tomorrow's Route
                        </h2>
                        <p className="text-sm text-gray-500">{getTomorrowDate()}</p>
                    </div>

                    {/* Stats - Top Right */}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{totalStops} Stops</span>
                        <span className="text-gray-300">•</span>
                        <span>{totalMiles} Miles</span>
                        <span className="text-gray-300">•</span>
                        <span>{downloadedCount}/{totalStops} Downloaded</span>
                    </div>
                </div>
            </div>

            {/* ================================================================
                Attire Alert (Conditional) - Subtle Style
            ================================================================ */}
            {hasOrigination && (
                <div className="border-b border-gray-100">
                    <AttireAlertBanner stopNumber={firstOriginationIndex + 1} />
                </div>
            )}

            {/* ================================================================
                Route Timeline
            ================================================================ */}
            <div className="px-5 py-5">
                <div className="space-y-0">
                    {stops.map((stop, index) => (
                        <TimelineStop
                            key={stop.id}
                            stop={stop}
                            index={index}
                            isLast={index === stops.length - 1}
                            isDownloaded={downloadedStops.has(stop.id)}
                            onDownload={() => handleDownload(stop.id)}
                        />
                    ))}
                </div>
            </div>

            {/* ================================================================
                Footer Actions - Download All Only
            ================================================================ */}
            <div className="border-t border-gray-200 px-5 py-3 bg-gray-50">
                <button
                    onClick={() => {
                        const allIds = stops.map((s) => s.id);
                        setDownloadedStops(new Set(allIds));
                    }}
                    disabled={allDownloaded}
                    className={cx(
                        "flex items-center gap-2 text-sm font-medium transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                        allDownloaded
                            ? "text-green-600"
                            : "text-brand-600 hover:text-brand-700"
                    )}
                >
                    {allDownloaded ? (
                        <>
                            <Check className="size-4" aria-hidden="true" />
                            All Downloaded for Offline
                        </>
                    ) : (
                        <>
                            <DownloadCloud className="size-4" aria-hidden="true" />
                            Download All for Offline
                        </>
                    )}
                </button>
            </div>

            {/* Screen Reader Summary */}
            <div className="sr-only">
                Tomorrow's route includes {totalStops} stops covering {totalMiles} miles.
                {hasOrigination && ` Business attire is required for stop ${firstOriginationIndex + 1}.`}
                {downloadedCount > 0 && ` ${downloadedCount} of ${totalStops} stops downloaded for offline use.`}
            </div>
        </section>
    );
}
