"use client";

import { useState, useMemo } from "react";
import {
    AlertCircle,
    AlertTriangle,
    ArrowRight,
    ArrowUpRight,
    Briefcase,
    Calendar,
    Car,
    CheckCircle2,
    ClipboardCheck,
    ClipboardList,
    Clock,
    Download,
    FileEdit,
    FileSignature,
    FileText,
    HardHat,
    MapPin,
    MessageSquare,
    Navigation,
    Play,
    Route,
    ThumbsUp,
    TrendingUp,
} from "lucide-react";
import Link from "next/link";
import {
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { AdminWizard } from "@/components/onboarding/admin-wizard";
import { useUserRole } from "@/contexts/user-role-context";
import { cx } from "@/utils/cx";
import { INSPECTIONS } from "@/data/mock-data";
import type { Inspection } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface StatCard {
    title: string;
    value: string;
    context: string;
    href?: string;
    onClick?: () => void;
    trend?: {
        value: string;
        isPositive: boolean;
    };
    icon: typeof ClipboardList;
    variant?: "default" | "warning";
}

interface ChartDataPoint {
    day: string;
    scheduled: number;
    completed: number;
}

interface InspectorData {
    id: string;
    name: string;
    avatar?: string;
    inspections: number;
}

interface PendingApproval {
    id: string;
    inspectionId: string;
    address: string;
    inspector: string;
    avatar?: string;
    issueCount: number;
    submittedAt: string;
}

interface ScheduleItem {
    id: string;
    time: string;
    address: string;
    city: string;
    type: string;
    status: "scheduled" | "in_progress";
}

interface DraftItem {
    id: string;
    address: string;
    progress: number;
    lastEdited: string;
}

interface FeedbackItem {
    id: string;
    manager: string;
    managerAvatar?: string;
    property: string;
    action: "approved" | "changes_requested" | "pending";
    comment?: string;
    time: string;
}

type TimeRange = "7days" | "30days";

// ============================================================================
// Date Helpers
// ============================================================================

function getToday(): Date {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
}

function getTomorrow(): Date {
    const tomorrow = getToday();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
}

function getYesterday(): Date {
    const yesterday = getToday();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
}

function isWithinNextNHours(date: Date, hours: number): boolean {
    const now = new Date();
    const futureLimit = new Date(now.getTime() + hours * 60 * 60 * 1000);
    return date >= now && date <= futureLimit;
}

function isPastDue(date: Date): boolean {
    const today = getToday();
    return date < today;
}

function isSameDay(date1: Date, date2: Date): boolean {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
}

// ============================================================================
// Mock Data - Shared
// ============================================================================

const CHART_DATA_7_DAYS: ChartDataPoint[] = [
    { day: "Mon", scheduled: 12, completed: 10 },
    { day: "Tue", scheduled: 19, completed: 17 },
    { day: "Wed", scheduled: 15, completed: 14 },
    { day: "Thu", scheduled: 22, completed: 20 },
    { day: "Fri", scheduled: 18, completed: 16 },
    { day: "Sat", scheduled: 8, completed: 8 },
    { day: "Sun", scheduled: 5, completed: 4 },
];

const CHART_DATA_30_DAYS: ChartDataPoint[] = [
    { day: "Week 1", scheduled: 45, completed: 42 },
    { day: "Week 2", scheduled: 62, completed: 58 },
    { day: "Week 3", scheduled: 58, completed: 55 },
    { day: "Week 4", scheduled: 71, completed: 67 },
];

const INSPECTION_MIX = [
    { name: "Move-In", value: 45, color: "#7F56D9" },
    { name: "Annual", value: 35, color: "#D6BBFB" },
    { name: "Move-Out", value: 20, color: "#F2F4F7" },
];

const TOP_INSPECTORS: InspectorData[] = [
    {
        id: "1",
        name: "Sarah Miller",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&face",
        inspections: 24,
    },
    {
        id: "2",
        name: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face",
        inspections: 19,
    },
    {
        id: "3",
        name: "Emily Chen",
        inspections: 16,
    },
    {
        id: "4",
        name: "David Kim",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&face",
        inspections: 14,
    },
];

// ============================================================================
// Mock Data - Admin
// ============================================================================

const ADMIN_STATS_BASE: Omit<StatCard, 'onClick'>[] = [
    {
        title: "Total Inspections",
        value: "1,284",
        context: "All time",
        href: "/inspections",
        trend: {
            value: "+12%",
            isPositive: true,
        },
        icon: ClipboardList,
    },
    {
        title: "In Progress",
        value: "8",
        context: "Active now",
        href: "/inspections?status=In+Progress",
        icon: Clock,
    },
    {
        title: "Scheduled Today",
        value: "3",
        context: "Needs attention",
        href: "/inspections?status=Scheduled",
        icon: Calendar,
    },
    {
        title: "Awaiting Approval",
        value: "5",
        context: "Awaiting approval",
        icon: AlertCircle,
        variant: "warning",
    },
];

const PENDING_APPROVALS: PendingApproval[] = [
    {
        id: "1",
        inspectionId: "123",
        address: "123 Oak Street, Austin TX",
        inspector: "John Doe",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face",
        issueCount: 3,
        submittedAt: "2h ago",
    },
    {
        id: "2",
        inspectionId: "124",
        address: "456 Maple Avenue, Houston TX",
        inspector: "Sarah Miller",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&face",
        issueCount: 1,
        submittedAt: "4h ago",
    },
    {
        id: "3",
        inspectionId: "125",
        address: "789 Pine Road, Dallas TX",
        inspector: "Mike Johnson",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face",
        issueCount: 5,
        submittedAt: "6h ago",
    },
    {
        id: "4",
        inspectionId: "126",
        address: "321 Cedar Lane, San Antonio TX",
        inspector: "Emily Chen",
        issueCount: 2,
        submittedAt: "8h ago",
    },
    {
        id: "5",
        inspectionId: "127",
        address: "654 Birch Court, Fort Worth TX",
        inspector: "David Kim",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&face",
        issueCount: 0,
        submittedAt: "1d ago",
    },
];

// ============================================================================
// Mock Data - Inspector
// ============================================================================

const INSPECTOR_STATS: StatCard[] = [
    {
        title: "Today's Schedule",
        value: "4",
        context: "Jobs",
        href: "#schedule",
        icon: Calendar,
    },
    {
        title: "In Progress",
        value: "1",
        context: "Active",
        href: "/inspections?status=In+Progress",
        icon: Clock,
    },
    {
        title: "Completed",
        value: "12",
        context: "This month",
        href: "/inspections?status=Completed",
        icon: CheckCircle2,
        trend: {
            value: "+3",
            isPositive: true,
        },
    },
];

const TODAY_SCHEDULE: ScheduleItem[] = [
    {
        id: "1",
        time: "09:00 AM",
        address: "123 Oak Street",
        city: "Austin, TX",
        type: "Move-In",
        status: "in_progress",
    },
    {
        id: "2",
        time: "11:30 AM",
        address: "456 Maple Avenue",
        city: "Austin, TX",
        type: "Annual",
        status: "scheduled",
    },
    {
        id: "3",
        time: "02:00 PM",
        address: "789 Pine Road",
        city: "Austin, TX",
        type: "Move-Out",
        status: "scheduled",
    },
    {
        id: "4",
        time: "04:30 PM",
        address: "321 Cedar Lane",
        city: "Austin, TX",
        type: "Annual",
        status: "scheduled",
    },
];

const MY_DRAFTS: DraftItem[] = [
    {
        id: "101",
        address: "555 Elm Street, Austin TX",
        progress: 75,
        lastEdited: "Yesterday",
    },
    {
        id: "102",
        address: "888 Willow Way, Austin TX",
        progress: 40,
        lastEdited: "2 days ago",
    },
];

const RECENT_FEEDBACK: FeedbackItem[] = [
    {
        id: "1",
        manager: "John Doe",
        managerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face",
        property: "789 Pine Rd",
        action: "changes_requested",
        comment: "Please add photos of the garage.",
        time: "30m ago",
    },
    {
        id: "2",
        manager: "John Doe",
        managerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face",
        property: "123 Oak St",
        action: "approved",
        comment: "Great photos!",
        time: "1h ago",
    },
    {
        id: "3",
        manager: "John Doe",
        managerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face",
        property: "456 Maple Ave",
        action: "approved",
        time: "Yesterday",
    },
];

// ============================================================================
// Mock Data - Tomorrow's Inspections (for Inspector Daily Brief)
// ============================================================================

interface TomorrowInspection {
    id: string;
    address: string;
    city: string;
    time: string;
    workflow: "ORIGINATION_MF" | "SERVICING_MBA";
    type: string;
}

const TOMORROW_INSPECTIONS: TomorrowInspection[] = [
    {
        id: "t1",
        address: "500 N Lake Shore Dr",
        city: "Chicago, IL",
        time: "08:30 AM",
        workflow: "ORIGINATION_MF",
        type: "Origination",
    },
    {
        id: "t2",
        address: "1200 S Michigan Ave",
        city: "Chicago, IL",
        time: "11:00 AM",
        workflow: "SERVICING_MBA",
        type: "Annual",
    },
    {
        id: "t3",
        address: "350 W Huron St",
        city: "Chicago, IL",
        time: "02:30 PM",
        workflow: "ORIGINATION_MF",
        type: "Origination",
    },
];

// ============================================================================
// Shared Components
// ============================================================================

const StatCardComponent = ({ stat }: { stat: StatCard }) => {
    const Icon = stat.icon;
    const isWarning = stat.variant === "warning";
    const isClickable = !!stat.onClick;

    const cardContent = (
        <>
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <div
                        className={cx(
                            "rounded-lg p-2",
                            isWarning ? "bg-amber-50" : "bg-gray-50"
                        )}
                    >
                        <Icon
                            className={cx(
                                "size-4",
                                isWarning ? "text-amber-600" : "text-gray-600"
                            )}
                        />
                    </div>
                    <span
                        className={cx(
                            "text-sm font-medium",
                            isWarning ? "text-amber-700" : "text-secondary"
                        )}
                    >
                        {stat.title}
                    </span>
                </div>
                <span
                    className={cx(
                        "rounded-full px-2 py-0.5 text-xs font-medium",
                        isWarning
                            ? "bg-amber-50 text-amber-600"
                            : "bg-gray-100 text-tertiary"
                    )}
                >
                    {stat.context}
                </span>
            </div>

            <div className="mt-3 flex items-end justify-between">
                <p
                    className={cx(
                        "text-display-sm font-semibold",
                        isWarning ? "text-amber-700" : "text-primary"
                    )}
                >
                    {stat.value}
                </p>
                {stat.trend && (
                    <div
                        className={cx(
                            "flex items-center gap-1 text-sm font-medium",
                            stat.trend.isPositive ? "text-success-600" : "text-error-600"
                        )}
                    >
                        <TrendingUp className="size-4" />
                        {stat.trend.value}
                    </div>
                )}
            </div>
        </>
    );

    // If onClick is provided, render as a button
    if (isClickable) {
        return (
            <button
                onClick={stat.onClick}
                className={cx(
                    "group block w-full rounded-xl p-5 text-left shadow-xs transition-all hover:shadow-md",
                    isWarning
                        ? "cursor-pointer border border-amber-200 bg-white ring-0 hover:border-brand-500 transition-colors"
                        : "bg-primary ring-1 ring-secondary hover:ring-brand-200"
                )}
            >
                {cardContent}
            </button>
        );
    }

    // Default: render as Link
    return (
        <Link
            href={stat.href || "#"}
            className={cx(
                "group block rounded-xl p-5 shadow-xs transition-all hover:shadow-md",
                isWarning
                    ? "border border-amber-200 bg-white ring-0 hover:border-amber-300"
                    : "bg-primary ring-1 ring-secondary hover:ring-brand-200"
            )}
        >
            {cardContent}
        </Link>
    );
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="rounded-lg bg-gray-900 px-3 py-2 shadow-lg">
                <p className="mb-1 text-xs font-medium text-gray-400">{label}</p>
                {payload.map((entry: any, index: number) => (
                    <p key={index} className="text-sm text-white">
                        <span
                            className="mr-2 inline-block size-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        {entry.name}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const InspectionChart = ({ data }: { data: ChartDataPoint[] }) => {
    return (
        <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E9EAEB" vertical={false} />
                    <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#717680", fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#717680", fontSize: 12 }}
                        dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="scheduled"
                        name="Scheduled"
                        stroke="#7F56D9"
                        strokeWidth={3}
                        dot={{ fill: "#7F56D9", strokeWidth: 0, r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                    <Line
                        type="monotone"
                        dataKey="completed"
                        name="Completed"
                        stroke="#17B26A"
                        strokeWidth={3}
                        dot={{ fill: "#17B26A", strokeWidth: 0, r: 3 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

const TimeRangeToggle = ({
    value,
    onChange,
}: {
    value: TimeRange;
    onChange: (value: TimeRange) => void;
}) => {
    return (
        <div className="flex rounded-lg bg-gray-100 p-1">
            <button
                onClick={() => onChange("7days")}
                className={cx(
                    "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                    value === "7days"
                        ? "bg-primary text-secondary shadow-xs"
                        : "text-tertiary hover:text-secondary"
                )}
            >
                7 Days
            </button>
            <button
                onClick={() => onChange("30days")}
                className={cx(
                    "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                    value === "30days"
                        ? "bg-primary text-secondary shadow-xs"
                        : "text-tertiary hover:text-secondary"
                )}
            >
                30 Days
            </button>
        </div>
    );
};

const InspectionMixChart = () => {
    return (
        <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
            <div className="border-b border-secondary px-5 py-4">
                <h3 className="text-sm font-semibold text-primary">Inspection Mix</h3>
                <p className="text-xs text-tertiary">By type this month</p>
            </div>
            <div className="p-5">
                <div className="flex items-center justify-center">
                    <div className="relative h-40 w-40">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={INSPECTION_MIX}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={45}
                                    outerRadius={65}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {INSPECTION_MIX.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-xl font-semibold text-primary">100</span>
                            <span className="text-xs text-tertiary">Total</span>
                        </div>
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    {INSPECTION_MIX.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span
                                    className="size-2.5 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm text-secondary">{item.name}</span>
                            </div>
                            <span className="text-sm font-medium text-primary">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const TopInspectorsLeaderboard = () => {
    const maxInspections = Math.max(...TOP_INSPECTORS.map((i) => i.inspections));

    return (
        <div className="h-full rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
            <div className="flex items-center justify-between border-b border-secondary px-5 py-4">
                <div>
                    <h3 className="text-sm font-semibold text-primary">Top Inspectors</h3>
                    <p className="text-xs text-tertiary">This month's leaders</p>
                </div>
                <Link
                    href="/settings?tab=team"
                    className="text-xs font-medium text-brand-600 hover:text-brand-700"
                >
                    View all
                </Link>
            </div>
            <div className="space-y-8 p-5">
                {TOP_INSPECTORS.map((inspector, index) => (
                    <div key={inspector.id} className="flex items-center gap-3">
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-tertiary">
                            {index + 1}
                        </span>
                        <Avatar
                            size="sm"
                            src={inspector.avatar}
                            alt={inspector.name}
                            initials={inspector.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                                <p className="truncate text-sm font-medium text-primary">
                                    {inspector.name}
                                </p>
                                <span className="ml-2 text-xs font-medium text-tertiary">
                                    {inspector.inspections}
                                </span>
                            </div>
                            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                                <div
                                    className="h-full rounded-full bg-brand-500"
                                    style={{
                                        width: `${(inspector.inspections / maxInspections) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// DashboardMetrics Component (Admin View)
// Accessible donut chart with sr-only data summary + Risk Monitor cards
// ============================================================================

const PIPELINE_COLORS = {
    origination: "#7F56D9", // Purple (Brand)
    servicing: "#2563EB", // Blue
};

/**
 * Pipeline Mix Donut Chart - Shows Origination vs Servicing split
 * Accessible: includes sr-only data summary for screen readers
 */
function PipelineMixChart() {
    // Calculate pipeline data from INSPECTIONS (exclude completed/cancelled)
    const pipelineData = useMemo(() => {
        const activeInspections = INSPECTIONS.filter(
            (i) => i.status !== "Completed" && i.status !== "Cancelled"
        );

        const originationCount = activeInspections.filter(
            (i) => i.workflow === "ORIGINATION_MF"
        ).length;
        const servicingCount = activeInspections.filter(
            (i) => i.workflow === "SERVICING_MBA"
        ).length;
        const total = originationCount + servicingCount;

        return {
            data: [
                { name: "Origination", value: originationCount, color: PIPELINE_COLORS.origination },
                { name: "Servicing", value: servicingCount, color: PIPELINE_COLORS.servicing },
            ],
            originationCount,
            servicingCount,
            total,
        };
    }, []);

    return (
        <div className="rounded-xl bg-white shadow-xs ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-5 py-4">
                <h3 className="text-sm font-semibold text-gray-900">Pipeline Mix</h3>
                <p className="text-xs text-gray-500">Active inspections by workflow</p>
            </div>
            <div className="p-5">
                <div className="flex items-center gap-6">
                    {/* Donut Chart */}
                    <div className="relative h-32 w-32 shrink-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pipelineData.data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={35}
                                    outerRadius={55}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pipelineData.data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-semibold text-gray-900">{pipelineData.total}</span>
                            <span className="text-[10px] text-gray-500">Active</span>
                        </div>
                    </div>

                    {/* Legend / Counts */}
                    <div className="flex-1 space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span
                                    className="size-3 rounded-full"
                                    style={{ backgroundColor: PIPELINE_COLORS.origination }}
                                    aria-hidden="true"
                                />
                                <span className="text-sm text-gray-700">Origination</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                                {pipelineData.originationCount}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span
                                    className="size-3 rounded-full"
                                    style={{ backgroundColor: PIPELINE_COLORS.servicing }}
                                    aria-hidden="true"
                                />
                                <span className="text-sm text-gray-700">Servicing</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                                {pipelineData.servicingCount}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Screen Reader Only: Data Summary */}
                <div className="sr-only" role="img" aria-label="Pipeline mix chart">
                    Chart showing {pipelineData.originationCount} Origination and{" "}
                    {pipelineData.servicingCount} Servicing inspections currently active.
                    Total of {pipelineData.total} inspections in pipeline.
                </div>
            </div>
        </div>
    );
}

/**
 * Risk Monitor - Two stat cards showing Closing Risk and SLA Breaches
 * Accessible: proper heading levels, WCAG AA compliant colors, aria-hidden icons
 */
function RiskMonitor() {
    // Calculate risk metrics from INSPECTIONS
    const riskMetrics = useMemo(() => {
        const now = new Date();

        // Closing Risk: Origination inspections due within 48 hours
        const closingRisk = INSPECTIONS.filter((i) => {
            if (i.workflow !== "ORIGINATION_MF") return false;
            if (i.status === "Completed" || i.status === "Cancelled") return false;
            return isWithinNextNHours(new Date(i.scheduledDate), 48);
        }).length;

        // SLA Breaches: Servicing inspections that are past due
        const slaBreaches = INSPECTIONS.filter((i) => {
            if (i.workflow !== "SERVICING_MBA") return false;
            if (i.status === "Completed" || i.status === "Cancelled") return false;
            return isPastDue(new Date(i.scheduledDate));
        }).length;

        return { closingRisk, slaBreaches };
    }, []);

    return (
        <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Risk Monitor</h3>
            <div className="grid gap-4 sm:grid-cols-2">
                {/* Card 1: Closing Risk */}
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-rose-100">
                            <AlertTriangle className="size-5 text-rose-700" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-rose-700">Closing Risk</p>
                            <p className="text-2xl font-semibold text-rose-800">{riskMetrics.closingRisk}</p>
                            <p className="text-xs text-rose-600">Deals at Risk</p>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-rose-600">
                        Origination inspections due within 48 hours
                    </p>
                </div>

                {/* Card 2: SLA Monitor */}
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100">
                            <Clock className="size-5 text-amber-700" aria-hidden="true" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs font-medium text-amber-700">SLA Monitor</p>
                            <p className="text-2xl font-semibold text-amber-800">{riskMetrics.slaBreaches}</p>
                            <p className="text-xs text-amber-600">SLA Breaches</p>
                        </div>
                    </div>
                    <p className="mt-3 text-xs text-amber-600">
                        Servicing inspections past scheduled date
                    </p>
                </div>
            </div>
        </div>
    );
}

/**
 * DashboardMetrics - Combined component with Pipeline Mix + Risk Monitor
 * For Admin View only
 */
function DashboardMetrics() {
    return (
        <section aria-labelledby="metrics-heading" className="mb-6">
            <h2 id="metrics-heading" className="sr-only">
                Pipeline and Risk Metrics
            </h2>
            <div className="grid gap-4 lg:grid-cols-2">
                <PipelineMixChart />
                <div className="rounded-xl bg-white p-5 shadow-xs ring-1 ring-gray-200">
                    <RiskMonitor />
                </div>
            </div>
        </section>
    );
}

// ============================================================================
// InspectorDailyBrief Component (Inspector View)
// Tomorrow's Prep card with context badge and action buttons
// ============================================================================

/**
 * InspectorDailyBrief - "Prep Card" for tomorrow's inspections
 * Shows inspection count, context badge, and relevant action buttons
 */
function InspectorDailyBrief() {
    const inspections = TOMORROW_INSPECTIONS;
    const totalCount = inspections.length;
    const originationCount = inspections.filter((i) => i.workflow === "ORIGINATION_MF").length;
    const servicingCount = inspections.filter((i) => i.workflow === "SERVICING_MBA").length;

    // Determine context badge
    const hasOriginations = originationCount > 0;
    const contextBadge = hasOriginations
        ? { label: "Client Facing (Business Attire)", icon: "👔", bgColor: "bg-purple-100", textColor: "text-purple-800", borderColor: "border-purple-200" }
        : { label: "Standard Site Walk (PPE Required)", icon: "🦺", bgColor: "bg-blue-100", textColor: "text-blue-800", borderColor: "border-blue-200" };

    if (totalCount === 0) {
        return null;
    }

    return (
        <section
            aria-labelledby="daily-brief-heading"
            className="mb-6 rounded-xl bg-gradient-to-r from-brand-50 to-purple-50 p-5 shadow-xs ring-1 ring-brand-200"
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-lg bg-brand-100">
                            <Calendar className="size-5 text-brand-700" aria-hidden="true" />
                        </div>
                        <div>
                            <h2 id="daily-brief-heading" className="text-lg font-semibold text-gray-900">
                                Tomorrow's Prep
                            </h2>
                            <p className="text-sm text-gray-600">
                                {totalCount} Inspection{totalCount !== 1 ? "s" : ""} Scheduled
                            </p>
                        </div>
                    </div>

                    {/* Context Badge */}
                    <div className="mt-4">
                        <span
                            className={cx(
                                "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium",
                                contextBadge.bgColor,
                                contextBadge.textColor,
                                contextBadge.borderColor
                            )}
                        >
                            <span aria-hidden="true">{contextBadge.icon}</span>
                            {contextBadge.label}
                        </span>
                    </div>

                    {/* Inspection Breakdown (Screen Reader) */}
                    <div className="sr-only">
                        Tomorrow's schedule includes {originationCount} origination inspection{originationCount !== 1 ? "s" : ""} and{" "}
                        {servicingCount} servicing inspection{servicingCount !== 1 ? "s" : ""}.
                        {hasOriginations
                            ? " Business attire is recommended for client-facing appointments."
                            : " Standard PPE is required for site walks."}
                    </div>
                </div>

                {/* Inspection List Preview */}
                <div className="hidden w-64 lg:block">
                    <div className="space-y-2">
                        {inspections.slice(0, 3).map((inspection) => (
                            <div
                                key={inspection.id}
                                className="flex items-center gap-2 rounded-lg bg-white/70 px-3 py-2 text-sm"
                            >
                                <span className="text-xs font-medium text-gray-500">{inspection.time}</span>
                                <span className="truncate text-gray-700">{inspection.address}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-5 flex flex-wrap items-center gap-3">
                {hasOriginations && (
                    <Button
                        color="secondary"
                        size="sm"
                        iconLeading={FileText}
                        className="bg-white hover:bg-gray-50"
                    >
                        Download Borrower Packets
                    </Button>
                )}
                {servicingCount > 0 && (
                    <Button
                        color="secondary"
                        size="sm"
                        iconLeading={FileEdit}
                        className="bg-white hover:bg-gray-50"
                    >
                        Review Prior Year Defects
                    </Button>
                )}
                <Button
                    color="primary"
                    size="sm"
                    iconLeading={Route}
                >
                    View Route on Map
                </Button>
            </div>
        </section>
    );
}

// ============================================================================
// Admin-Only Components
// ============================================================================

const PendingApprovalItem = ({ item }: { item: PendingApproval }) => {
    return (
        <div className="flex items-center gap-4 px-5 py-4">
            <Avatar
                size="sm"
                src={item.avatar}
                alt={item.inspector}
                initials={item.inspector
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
            />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-primary">{item.address}</p>
                <p className="text-xs text-tertiary">
                    {item.inspector} • Submitted {item.submittedAt}
                </p>
            </div>
            <div className="flex items-center gap-3">
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                    Pending Review
                </span>
                {item.issueCount > 0 && (
                    <span className="rounded-full bg-error-50 px-2 py-0.5 text-xs font-medium text-error-700">
                        {item.issueCount} Issue{item.issueCount > 1 ? "s" : ""}
                    </span>
                )}
                <Button
                    color="secondary"
                    size="sm"
                    href={`/inspections/${item.inspectionId}`}
                >
                    Review
                </Button>
            </div>
        </div>
    );
};

// ============================================================================
// Inspector-Only Components
// ============================================================================

const RouteMapWidget = () => {
    return (
        <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
            <div className="flex items-center justify-between border-b border-secondary px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-blue-100">
                        <Navigation className="size-4 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-primary">Today's Route</h2>
                        <p className="text-xs text-tertiary">4 stops planned</p>
                    </div>
                </div>
            </div>
            {/* Map Placeholder */}
            <div className="relative">
                <div className="aspect-[3/4] w-full bg-gradient-to-b from-blue-50 to-blue-100">
                    {/* Stylized map background */}
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 200 280">
                        {/* Roads */}
                        <path
                            d="M20 50 L180 50 M20 100 L180 100 M20 150 L180 150 M20 200 L180 200 M20 250 L180 250"
                            stroke="#CBD5E1"
                            strokeWidth="2"
                            fill="none"
                        />
                        <path
                            d="M50 20 L50 260 M100 20 L100 260 M150 20 L150 260"
                            stroke="#CBD5E1"
                            strokeWidth="2"
                            fill="none"
                        />
                        {/* Route line */}
                        <path
                            d="M50 50 L100 100 L150 100 L100 180 L50 230"
                            stroke="#7F56D9"
                            strokeWidth="3"
                            strokeDasharray="8 4"
                            fill="none"
                        />
                        {/* Stop markers */}
                        <circle cx="50" cy="50" r="8" fill="#7F56D9" />
                        <text x="50" y="54" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">1</text>
                        <circle cx="100" cy="100" r="8" fill="#7F56D9" />
                        <text x="100" y="104" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">2</text>
                        <circle cx="150" cy="100" r="8" fill="#7F56D9" />
                        <text x="150" y="104" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">3</text>
                        <circle cx="50" cy="230" r="8" fill="#7F56D9" />
                        <text x="50" y="234" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">4</text>
                    </svg>
                </div>
                {/* Drive Time Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between rounded-lg bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <Car className="size-4 text-gray-600" />
                            <span className="text-sm font-medium text-primary">Est. Drive Time</span>
                        </div>
                        <span className="text-sm font-semibold text-brand-600">2h 15m</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ScheduleCard = ({ item }: { item: ScheduleItem }) => {
    const isInProgress = item.status === "in_progress";

    return (
        <div
            className={cx(
                "rounded-xl p-4 shadow-xs ring-1 transition-all",
                isInProgress
                    ? "bg-brand-50 ring-brand-200"
                    : "bg-primary ring-secondary hover:ring-brand-200"
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                    <div className="text-center">
                        <p
                            className={cx(
                                "text-sm font-semibold",
                                isInProgress ? "text-brand-700" : "text-primary"
                            )}
                        >
                            {item.time}
                        </p>
                    </div>
                    <div>
                        <p
                            className={cx(
                                "text-sm font-medium",
                                isInProgress ? "text-brand-700" : "text-primary"
                            )}
                        >
                            {item.address}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-tertiary">
                            <MapPin className="size-3" />
                            {item.city}
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <span
                                className={cx(
                                    "rounded-full px-2 py-0.5 text-xs font-medium",
                                    isInProgress
                                        ? "bg-brand-100 text-brand-700"
                                        : "bg-gray-100 text-tertiary"
                                )}
                            >
                                {item.type}
                            </span>
                            {isInProgress && (
                                <span className="rounded-full bg-brand-600 px-2 py-0.5 text-xs font-medium text-white">
                                    In Progress
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <Button
                    color={isInProgress ? "primary" : "secondary"}
                    size="sm"
                    iconLeading={isInProgress ? Play : ArrowRight}
                    href={`/inspections/${item.id}`}
                >
                    {isInProgress ? "Resume" : "Start"}
                </Button>
            </div>
        </div>
    );
};

const DraftCard = ({ item }: { item: DraftItem }) => {
    return (
        <Link
            href={`/inspections/${item.id}`}
            className="block rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary transition-all hover:ring-brand-200"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-primary">{item.address}</p>
                    <p className="mt-1 text-xs text-tertiary">Last edited {item.lastEdited}</p>
                </div>
                <FileEdit className="size-4 shrink-0 text-tertiary" />
            </div>
            <div className="mt-3">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-tertiary">Progress</span>
                    <span className="font-medium text-secondary">{item.progress}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                    <div
                        className="h-full rounded-full bg-brand-500"
                        style={{ width: `${item.progress}%` }}
                    />
                </div>
            </div>
        </Link>
    );
};

const FeedbackCard = ({ item }: { item: FeedbackItem }) => {
    const isApproved = item.action === "approved";
    const needsChanges = item.action === "changes_requested";

    return (
        <div className={cx(
            "rounded-lg p-3",
            needsChanges ? "bg-amber-50 ring-1 ring-amber-200" : "bg-gray-50"
        )}>
            <div className="flex items-start gap-3">
                <Avatar
                    size="xs"
                    src={item.managerAvatar}
                    alt={item.manager}
                    initials={item.manager
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                />
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <p className="text-xs text-secondary">
                            <span className="font-medium">{item.manager}</span>
                            {isApproved ? " approved " : " requested changes on "}
                            <span className="font-medium">{item.property}</span>
                        </p>
                        {needsChanges && (
                            <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                                Action Required
                            </span>
                        )}
                    </div>
                    {item.comment && (
                        <p className={cx(
                            "mt-1 text-xs italic",
                            needsChanges ? "text-amber-700" : "text-tertiary"
                        )}>"{item.comment}"</p>
                    )}
                    <p className="mt-1 text-xs text-tertiary">{item.time}</p>
                </div>
                {isApproved ? (
                    <ThumbsUp className="size-3.5 shrink-0 text-success-500" />
                ) : (
                    <MessageSquare className="size-3.5 shrink-0 text-amber-500" />
                )}
            </div>
        </div>
    );
};

const ManagerFeedbackWidget = () => {
    return (
        <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
            <div className="flex items-center justify-between border-b border-secondary px-5 py-4">
                <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-success-100">
                        <ThumbsUp className="size-4 text-success-600" />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-primary">Manager Feedback</h2>
                        <p className="text-xs text-tertiary">Recent responses</p>
                    </div>
                </div>
            </div>
            <div className="space-y-2 p-4">
                {RECENT_FEEDBACK.map((item) => (
                    <FeedbackCard key={item.id} item={item} />
                ))}
            </div>
        </div>
    );
};

// ============================================================================
// Admin Dashboard View
// ============================================================================

const AdminDashboard = () => {
    const [timeRange, setTimeRange] = useState<TimeRange>("7days");

    const chartData = timeRange === "7days" ? CHART_DATA_7_DAYS : CHART_DATA_30_DAYS;
    const chartSubtitle = timeRange === "7days" ? "Last 7 days" : "Last 30 days";

    // Create admin stats with scroll handler for "Awaiting Approval"
    const scrollToApprovals = () => {
        document.getElementById("approvals-list")?.scrollIntoView({ behavior: "smooth" });
    };

    const ADMIN_STATS: StatCard[] = ADMIN_STATS_BASE.map((stat) => {
        if (stat.title === "Awaiting Approval") {
            return { ...stat, onClick: scrollToApprovals };
        }
        return stat;
    });

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6 flex items-start justify-between">
                <div>
                    <h1 className="text-display-sm font-semibold text-primary">Dashboard</h1>
                    <p className="mt-1 text-sm text-tertiary">
                        Overview of your inspection operations.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button color="secondary" size="sm" iconLeading={Calendar}>
                        Date Range
                    </Button>
                    <Button color="secondary" size="sm" iconLeading={Download}>
                        Export
                    </Button>
                </div>
            </div>

            {/* Stats Grid - 4 Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {ADMIN_STATS.map((stat) => (
                    <StatCardComponent key={stat.title} stat={stat} />
                ))}
            </div>

            {/* Pipeline Mix + Risk Monitor */}
            <DashboardMetrics />

            {/* Main Chart */}
            <div className="mb-6 rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
                <div className="flex items-center justify-between border-b border-secondary px-5 py-4">
                    <div>
                        <h2 className="text-sm font-semibold text-primary">Inspection Trends</h2>
                        <p className="text-xs text-tertiary">{chartSubtitle}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block size-2.5 rounded-full bg-brand-600" />
                                <span className="text-xs text-tertiary">Scheduled</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <span className="inline-block size-2.5 rounded-full bg-success-500" />
                                <span className="text-xs text-tertiary">Completed</span>
                            </div>
                        </div>
                        <TimeRangeToggle value={timeRange} onChange={setTimeRange} />
                    </div>
                </div>
                <div className="p-5">
                    <InspectionChart data={chartData} />
                </div>
            </div>

            {/* Density Row: Donut + Leaderboard */}
            <div className="mb-6 grid gap-4 lg:grid-cols-3">
                <InspectionMixChart />
                <div className="lg:col-span-2">
                    <TopInspectorsLeaderboard />
                </div>
            </div>

            {/* Action Required: Pending Approvals */}
            <div id="approvals-list" className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary scroll-mt-6">
                <div className="flex items-center justify-between border-b border-secondary px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-amber-50">
                            <ClipboardCheck className="size-4 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-primary">
                                Action Required: Pending Approvals
                            </h2>
                            <p className="text-xs text-tertiary">
                                {PENDING_APPROVALS.length} inspections awaiting your review
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/inspections?status=Pending+Review"
                        className="flex items-center gap-1 text-xs font-medium text-brand-600 hover:text-brand-700"
                    >
                        View all
                        <ArrowUpRight className="size-3" />
                    </Link>
                </div>
                <div className="divide-y divide-secondary">
                    {PENDING_APPROVALS.map((item) => (
                        <PendingApprovalItem key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Inspector Dashboard View
// ============================================================================

const InspectorDashboard = () => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <div className="p-6">
            {/* Personalized Header */}
            <div className="mb-6">
                <h1 className="text-display-sm font-semibold text-primary">
                    {getGreeting()}, Mike.
                </h1>
                <p className="mt-1 text-sm text-tertiary">
                    Here's your schedule for today.
                </p>
            </div>

            {/* Tomorrow's Prep - Daily Brief Card */}
            <InspectorDailyBrief />

            {/* Stats Grid - 3 Cards */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                {INSPECTOR_STATS.map((stat) => (
                    <StatCardComponent key={stat.title} stat={stat} />
                ))}
            </div>

            {/* Main Content Grid - 3 columns */}
            <div className="grid gap-6 lg:grid-cols-12">
                {/* Today's Schedule - 5 columns */}
                <div className="lg:col-span-5">
                    <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
                        <div className="flex items-center justify-between border-b border-secondary px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-brand-100">
                                    <Calendar className="size-4 text-brand-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-primary">
                                        Today's Schedule
                                    </h2>
                                    <p className="text-xs text-tertiary">
                                        {TODAY_SCHEDULE.length} inspections planned
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 p-4">
                            {TODAY_SCHEDULE.map((item) => (
                                <ScheduleCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Route Map - 3 columns */}
                <div className="lg:col-span-3">
                    <RouteMapWidget />
                </div>

                {/* Sidebar: Drafts + Feedback - 4 columns */}
                <div className="space-y-4 lg:col-span-4">
                    {/* My Drafts */}
                    <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
                        <div className="flex items-center justify-between border-b border-secondary px-5 py-4">
                            <div className="flex items-center gap-3">
                                <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100">
                                    <FileEdit className="size-4 text-gray-600" />
                                </div>
                                <div>
                                    <h2 className="text-sm font-semibold text-primary">
                                        My Drafts
                                    </h2>
                                    <p className="text-xs text-tertiary">
                                        {MY_DRAFTS.length} incomplete reports
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3 p-4">
                            {MY_DRAFTS.length > 0 ? (
                                MY_DRAFTS.map((item) => (
                                    <DraftCard key={item.id} item={item} />
                                ))
                            ) : (
                                <div className="py-8 text-center">
                                    <FileEdit className="mx-auto size-8 text-gray-300" />
                                    <p className="mt-2 text-sm text-tertiary">No drafts</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Manager Feedback */}
                    <ManagerFeedbackWidget />

                    {/* Quick Actions */}
                    <div className="rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary">
                        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-tertiary">
                            Quick Actions
                        </h3>
                        <div className="space-y-2">
                            <Button
                                color="secondary"
                                size="sm"
                                className="w-full justify-start"
                                iconLeading={ClipboardList}
                                href="/inspections"
                            >
                                View All Inspections
                            </Button>
                            <Button
                                color="secondary"
                                size="sm"
                                className="w-full justify-start"
                                iconLeading={MapPin}
                                href="/properties"
                            >
                                Browse Properties
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Page Component
// ============================================================================

export default function DashboardPage() {
    const { role } = useUserRole();

    // Mock state for new admin onboarding wizard
    // In a real app, this would come from user data (e.g., user.isNewAdmin)
    const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);

    // Toggle this to true to test the onboarding wizard
    // const [showOnboardingWizard, setShowOnboardingWizard] = useState(true);

    const handleWizardComplete = () => {
        setShowOnboardingWizard(false);
        // In a real app, you would also update the user's onboarding status
        console.log("Onboarding completed - user.isNewAdmin would be set to false");
    };

    if (role === "inspector") {
        return <InspectorDashboard />;
    }

    // Default: Admin View
    return (
        <>
            <AdminDashboard />
            <AdminWizard
                isOpen={showOnboardingWizard}
                onClose={() => setShowOnboardingWizard(false)}
                onComplete={handleWizardComplete}
            />
        </>
    );
}
