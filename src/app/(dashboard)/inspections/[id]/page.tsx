"use client";

import { useState } from "react";
import {
    AlertTriangle,
    ArrowLeft,
    Camera,
    CheckCircle2,
    ChevronDown,
    Clock,
    FileText,
    Hash,
    Key,
    List,
    MapPin,
    MessageCircle,
    Plus,
    Printer,
    RotateCcw,
    Save,
    Send,
    Upload,
    X,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { DynamicForm } from "@/components/inspections/dynamic-form";
import { QuestionnaireView } from "@/components/inspections/questionnaire-view";
import { PropertyImage } from "@/components/ui/property-image";
import { useUserRole } from "@/contexts/user-role-context";
import { cx } from "@/utils/cx";
import { getInspectionById } from "@/data/mock-data";
import { getTemplateById, SERVICING_TEMPLATE, ORIGINATION_TEMPLATE } from "@/data/templates";
import type { WorkflowType, InspectionTemplate } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface Room {
    id: string;
    name: string;
    status: "pass" | "fail" | "pending";
    issueCount: number;
    items: RoomItem[];
}

interface RoomItem {
    id: string;
    name: string;
    status: "pass" | "fail" | "pending";
    note?: string;
    photos?: string[];
}

interface TimelineEvent {
    id: string;
    message: string;
    time: string;
    type: "action" | "status" | "create";
}

type ItemStatus = "pass" | "fail" | "na" | "pending";
type Severity = "low" | "medium" | "high";

// ============================================================================
// Mock Data
// ============================================================================

const INSPECTION = {
    id: "INS-001",
    status: "In Progress" as const,
    type: "Move-In",
    date: "Oct 24",
    progress: 85,
    issuesCount: 3,
    photosCount: 12,
    workflow: "SERVICING_MBA" as WorkflowType,
    loanNumber: undefined as string | undefined,
};

const PROPERTY = {
    address: "123 Oak Street",
    cityState: "Austin, TX",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop",
    yearBuilt: 2018,
    sqft: 2400,
    bedrooms: 4,
    bathrooms: 3,
};

const INSPECTOR = {
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face",
};

const ACCESS_INFO = {
    lockboxCode: "1234",
    alarmCode: "9999",
};

const ISSUE_PHOTOS = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1585128792020-803d29415281?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=100&h=100&fit=crop",
];

const GALLERY_PHOTOS = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1585128792020-803d29415281?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560440021-33f9b867899d?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560449752-3fd4bdbe7df0?w=300&h=300&fit=crop",
];

const ROOMS: Room[] = [
    {
        id: "kitchen",
        name: "Kitchen",
        status: "fail",
        issueCount: 2,
        items: [
            { id: "k1", name: "Countertops", status: "pass" },
            { id: "k2", name: "Cabinets", status: "fail", note: "Damaged hinge on upper cabinet near stove", photos: ISSUE_PHOTOS },
            { id: "k3", name: "Appliances", status: "pass" },
            { id: "k4", name: "Sink & Faucet", status: "fail", note: "Minor leak under sink", photos: ISSUE_PHOTOS.slice(0, 2) },
            { id: "k5", name: "Flooring", status: "pass" },
        ],
    },
    {
        id: "living-room",
        name: "Living Room",
        status: "pass",
        issueCount: 0,
        items: [
            { id: "lr1", name: "Walls & Paint", status: "pass" },
            { id: "lr2", name: "Windows", status: "pass" },
            { id: "lr3", name: "Flooring", status: "pass" },
            { id: "lr4", name: "Electrical Outlets", status: "pass" },
            { id: "lr5", name: "Light Fixtures", status: "pass" },
        ],
    },
    {
        id: "master-bedroom",
        name: "Master Bedroom",
        status: "fail",
        issueCount: 1,
        items: [
            { id: "mb1", name: "Walls & Paint", status: "pass" },
            { id: "mb2", name: "Windows", status: "pass" },
            { id: "mb3", name: "Closet", status: "fail", note: "Closet door off track", photos: ISSUE_PHOTOS },
            { id: "mb4", name: "Flooring", status: "pass" },
        ],
    },
    {
        id: "master-bath",
        name: "Master Bathroom",
        status: "pending",
        issueCount: 0,
        items: [
            { id: "bath1", name: "Toilet", status: "pending" },
            { id: "bath2", name: "Shower/Tub", status: "pending" },
            { id: "bath3", name: "Vanity & Sink", status: "pending" },
            { id: "bath4", name: "Ventilation", status: "pending" },
        ],
    },
];

const TIMELINE: TimelineEvent[] = [
    { id: "1", message: "John Doe uploaded 4 photos", time: "10 min ago", type: "action" },
    { id: "2", message: "Kitchen inspection completed", time: "25 min ago", type: "action" },
    { id: "3", message: "Living Room marked as passed", time: "1 hour ago", type: "status" },
    { id: "4", message: "Status changed to In Progress", time: "2 hours ago", type: "status" },
    { id: "5", message: "Inspector assigned: John Doe", time: "1 day ago", type: "action" },
    { id: "6", message: "Inspection scheduled", time: "2 days ago", type: "status" },
    { id: "7", message: "Inspection created", time: "3 days ago", type: "create" },
];

// ============================================================================
// Shared Components
// ============================================================================

const Breadcrumbs = () => (
    <Link
        href="/inspections"
        className="inline-flex items-center gap-2 text-sm text-tertiary hover:text-secondary transition-colors"
    >
        <ArrowLeft className="size-4" />
        Back to Inspections
    </Link>
);

const StatusBadge = ({ status }: { status: string }) => {
    const config: Record<string, { color: "brand" | "success" | "orange" | "gray" | "warning"; label: string }> = {
        "In Progress": { color: "orange", label: "In Progress" },
        Completed: { color: "success", label: "Completed" },
        Scheduled: { color: "brand", label: "Scheduled" },
        "Pending Review": { color: "warning", label: "Pending Review" },
    };
    const { color, label } = config[status] || { color: "gray", label: status };
    return <Badge color={color} size="md">{label}</Badge>;
};

const WorkflowBadge = ({ workflow, loanNumber }: { workflow: WorkflowType; loanNumber?: string }) => (
    <div className="flex items-center gap-2">
        <span
            className={cx(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                workflow === "ORIGINATION_MF"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-blue-100 text-blue-700"
            )}
        >
            {workflow === "ORIGINATION_MF" ? (
                <>
                    <FileText className="size-3" />
                    Origination
                </>
            ) : (
                <>
                    <List className="size-3" />
                    Servicing
                </>
            )}
        </span>
        {loanNumber && (
            <span className="text-xs text-tertiary">Loan #{loanNumber}</span>
        )}
    </div>
);

const PropertyHeroCard = ({ onOpenGallery }: { onOpenGallery: () => void }) => (
    <div className="overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
        <div className="border-b border-secondary px-5 py-4">
            <h3 className="text-sm font-semibold text-primary">Property</h3>
        </div>
        <div className="relative">
            <PropertyImage
                src={PROPERTY.image}
                alt={PROPERTY.address}
                className="h-56 w-full"
            />
            <button
                onClick={onOpenGallery}
                className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-gray-900/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-gray-900"
            >
                <Camera className="size-3.5" />
                View Gallery ({INSPECTION.photosCount})
            </button>
        </div>
    </div>
);

const MapCard = () => (
    <div className="overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
        <div className="border-b border-secondary px-5 py-4">
            <h3 className="text-sm font-semibold text-primary">Location</h3>
        </div>
        <div className="aspect-[4/3] w-full bg-gray-100 flex flex-col items-center justify-center">
            <MapPin className="size-8 text-gray-300" />
            <span className="mt-2 text-sm text-tertiary">Map View</span>
            <span className="mt-1 text-xs text-quaternary">{PROPERTY.cityState}</span>
        </div>
    </div>
);

const TimelineCard = () => (
    <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
        <div className="border-b border-secondary px-5 py-4">
            <h3 className="text-sm font-semibold text-primary">Activity Timeline</h3>
        </div>
        <div className="p-5">
            <div className="relative">
                <div className="absolute bottom-0 left-[5px] top-0 w-0.5 bg-gray-200" />
                <div className="space-y-6">
                    {TIMELINE.map((event, index) => (
                        <div key={event.id} className="relative flex gap-4">
                            <div
                                className={cx(
                                    "relative z-10 mt-1 size-3 shrink-0 rounded-full ring-4 ring-white",
                                    index === 0 ? "bg-brand-600" : "bg-gray-300"
                                )}
                            />
                            <div className="min-w-0 flex-1">
                                <p className="text-sm text-secondary">{event.message}</p>
                                <p className="mt-0.5 text-xs text-tertiary">{event.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const GalleryModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-primary shadow-2xl">
                <div className="flex items-center justify-between border-b border-secondary px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-primary">Media Gallery</h2>
                        <p className="text-sm text-tertiary">{GALLERY_PHOTOS.length} photos</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button color="secondary" size="sm" iconLeading={Upload}>Upload Photos</Button>
                        <button onClick={onClose} className="flex size-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                            <X className="size-5" />
                        </button>
                    </div>
                </div>
                <div className="max-h-[70vh] overflow-y-auto p-6">
                    <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
                        {GALLERY_PHOTOS.map((photo, index) => (
                            <div key={index} className="aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 ring-1 ring-secondary transition-all hover:ring-2 hover:ring-brand-500">
                                <img src={photo} alt={`Photo ${index + 1}`} className="size-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Admin-Specific Components
// ============================================================================

const AdminHeader = ({ workflow, loanNumber, onApprove, onRequestChanges }: { workflow: WorkflowType; loanNumber?: string; onApprove: () => void; onRequestChanges: () => void }) => {
    const isOrigination = workflow === "ORIGINATION_MF";

    return (
        <div className="border-b border-secondary bg-primary">
            <div className="p-6">
                <Breadcrumbs />
                <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        {/* Origination: Show inspection type prominently */}
                        {isOrigination && (
                            <div className="mb-2 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-100 px-2.5 py-1 text-sm font-semibold text-purple-700">
                                    <FileText className="size-4" />
                                    Origination Inspection
                                </span>
                                {loanNumber && (
                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
                                        <Hash className="size-3.5" />
                                        {loanNumber}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <h1 className="text-display-xs font-semibold text-primary">{PROPERTY.address}</h1>
                            <StatusBadge status={INSPECTION.status} />
                        </div>
                        <p className="mt-1 text-sm text-tertiary">{PROPERTY.cityState}</p>
                        {!isOrigination && (
                            <div className="mt-2">
                                <WorkflowBadge workflow={workflow} loanNumber={loanNumber} />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button color="secondary" size="md" iconLeading={Printer}>Print Report</Button>
                        <Button color="secondary" size="md" iconLeading={RotateCcw} onClick={onRequestChanges}>Request Changes</Button>
                        <Button color="primary" size="md" iconLeading={CheckCircle2} onClick={onApprove}>Approve Inspection</Button>
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                    <Badge color="brand" size="sm">{INSPECTION.type}</Badge>
                    <span className="text-tertiary">•</span>
                    <span className="text-tertiary">{PROPERTY.sqft.toLocaleString()} sqft</span>
                    <span className="text-tertiary">•</span>
                    <span className="text-tertiary">Built {PROPERTY.yearBuilt}</span>
                    <span className="text-tertiary">•</span>
                    <span className="text-tertiary">{INSPECTION.date}, 2023</span>
                </div>
            </div>
        </div>
    );
};

const ReviewRequestBanner = () => (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
            <div>
                <p className="text-sm font-medium text-amber-800">Approval Requested</p>
                <p className="mt-1 text-sm text-amber-700">
                    {INSPECTOR.name} submitted this inspection 2 hours ago. There are {INSPECTION.issuesCount} flagged issues requiring your decision.
                </p>
            </div>
        </div>
    </div>
);

const SummaryCard = ({ title, value, icon: Icon, variant = "default", onClick }: {
    title: string;
    value: string;
    icon: typeof Camera;
    variant?: "default" | "warning" | "progress";
    onClick?: () => void;
}) => {
    const bgClass = variant === "warning" ? "bg-error-50" : "bg-primary";
    const valueClass = variant === "warning" ? "text-error-600" : "text-primary";
    const iconBgClass = variant === "warning" ? "bg-error-100" : "bg-gray-100";
    const iconClass = variant === "warning" ? "text-error-600" : "text-gray-600";

    return (
        <button onClick={onClick} className={cx("flex flex-col rounded-xl p-5 shadow-xs ring-1 ring-secondary text-left transition-all hover:shadow-md", bgClass, onClick && "cursor-pointer hover:ring-brand-200")}>
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-tertiary">{title}</span>
                <div className={cx("flex size-8 items-center justify-center rounded-lg", iconBgClass)}>
                    <Icon className={cx("size-4", iconClass)} />
                </div>
            </div>
            <p className={cx("mt-2 text-display-xs font-semibold", valueClass)}>{value}</p>
            {variant === "progress" && (
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${INSPECTION.progress}%` }} />
                </div>
            )}
        </button>
    );
};

const AdminSummaryGrid = () => (
    <div className="grid gap-4 sm:grid-cols-3">
        <SummaryCard title="Progress" value={`${INSPECTION.progress}%`} icon={CheckCircle2} variant="progress" />
        <SummaryCard title="Issues Found" value={`${INSPECTION.issuesCount} Found`} icon={AlertTriangle} variant="warning" onClick={() => console.log("Navigate to issues")} />
        <SummaryCard title="Photos" value={`${INSPECTION.photosCount} Uploaded`} icon={Camera} />
    </div>
);

const AdminRoomAccordion = ({ room }: { room: Room }) => {
    const [isOpen, setIsOpen] = useState(room.status === "fail");
    const statusConfig = {
        pass: { icon: CheckCircle2, color: "text-success-600", bg: "bg-success-50", label: "Passed" },
        fail: { icon: XCircle, color: "text-error-600", bg: "bg-error-50", label: "Failed" },
        pending: { icon: Clock, color: "text-gray-400", bg: "bg-gray-50", label: "Pending" },
    };
    const config = statusConfig[room.status];
    const StatusIcon = config.icon;
    const itemPaddingLeft = "pl-[76px]";

    return (
        <div className="overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
            <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50">
                <div className={cx("flex size-10 shrink-0 items-center justify-center rounded-lg", config.bg)}>
                    <StatusIcon className={cx("size-5", config.color)} />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-primary">{room.name}</h3>
                        {room.issueCount > 0 && <Badge color="error" size="sm">{room.issueCount} Issue{room.issueCount !== 1 ? "s" : ""}</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-tertiary">{room.items.length} items • {config.label}</p>
                </div>
                <ChevronDown className={cx("size-5 shrink-0 text-gray-400 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
                <div className="border-t border-secondary">
                    {room.items.map((item) => {
                        const itemConfig = statusConfig[item.status];
                        const ItemIcon = itemConfig.icon;
                        const isFailed = item.status === "fail";
                        return (
                            <div key={item.id} className={cx("border-b border-secondary pr-5 py-3 last:border-b-0", itemPaddingLeft, isFailed && "border-l-4 border-l-error-500 bg-white")}>
                                <div className="flex items-start gap-3">
                                    <ItemIcon className={cx("mt-0.5 size-4 shrink-0", itemConfig.color)} />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium text-secondary">{item.name}</p>
                                            {isFailed && <Badge color="error" size="sm">Issue</Badge>}
                                        </div>
                                        {item.note && <p className="mt-1 text-sm text-tertiary">{item.note}</p>}
                                        {isFailed && item.photos && item.photos.length > 0 && (
                                            <div className="mt-3 flex gap-2">
                                                {item.photos.map((photo, index) => (
                                                    <div key={index} className="size-14 overflow-hidden rounded-lg bg-gray-100 ring-1 ring-secondary cursor-pointer hover:ring-2 hover:ring-brand-500 transition-all">
                                                        <img src={photo} alt={`Evidence ${index + 1}`} className="size-full object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const InspectorCard = () => (
    <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
        <div className="border-b border-secondary px-5 py-4">
            <h3 className="text-sm font-semibold text-primary">Assigned Inspector</h3>
        </div>
        <div className="flex items-center gap-3 p-5">
            <Avatar size="lg" src={INSPECTOR.avatar} alt={INSPECTOR.name} initials="JD" />
            <div className="min-w-0 flex-1">
                <p className="font-medium text-primary">{INSPECTOR.name}</p>
                <p className="text-sm text-tertiary">Assigned Oct 22</p>
            </div>
            <button className="flex size-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                <MessageCircle className="size-5" />
            </button>
        </div>
    </div>
);

const ApproveModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-primary p-6 shadow-2xl">
                <div className="flex size-12 items-center justify-center rounded-full bg-success-100">
                    <CheckCircle2 className="size-6 text-success-600" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-primary">Approve Inspection</h2>
                <p className="mt-2 text-sm text-tertiary">Are you sure you want to approve this inspection? This will finalize the report and notify all stakeholders.</p>
                <div className="mt-6 flex gap-3">
                    <Button color="secondary" size="md" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button color="primary" size="md" className="flex-1" onClick={onConfirm}>Approve</Button>
                </div>
            </div>
        </div>
    );
};

const RequestChangesModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (message: string) => void }) => {
    const [message, setMessage] = useState("");
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-primary p-6 shadow-2xl">
                <div className="flex size-12 items-center justify-center rounded-full bg-amber-100">
                    <RotateCcw className="size-6 text-amber-600" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-primary">Request Changes</h2>
                <p className="mt-2 text-sm text-tertiary">What needs to be fixed before this inspection can be approved?</p>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g., Missing photo of bathroom, need clearer image of kitchen damage..."
                    className="mt-4 h-32 w-full rounded-lg border border-secondary bg-primary px-4 py-3 text-sm text-primary placeholder:text-tertiary focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <div className="mt-6 flex gap-3">
                    <Button color="secondary" size="md" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button color="primary" size="md" className="flex-1" onClick={() => { onSubmit(message); setMessage(""); }}>Send Request</Button>
                </div>
            </div>
        </div>
    );
};

const SubmitReportModal = ({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-primary p-6 shadow-2xl">
                <div className="flex size-12 items-center justify-center rounded-full bg-brand-100">
                    <Send className="size-6 text-brand-600" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-primary">Submit Inspection Report?</h2>
                <p className="mt-2 text-sm text-tertiary">
                    Summary: {INSPECTION.issuesCount} High Severity Issues found.
                </p>
                <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm text-secondary">
                        This report will be sent to <span className="font-medium">Sarah Miller</span> for final approval.
                    </p>
                </div>
                <div className="mt-6 flex gap-3">
                    <Button color="secondary" size="md" className="flex-1" onClick={onClose}>Go Back</Button>
                    <Button color="primary" size="md" className="flex-1" onClick={onSubmit}>Submit for Approval</Button>
                </div>
            </div>
        </div>
    );
};

// ============================================================================
// Inspector-Specific Components
// ============================================================================

const InspectorHeader = ({ workflow, loanNumber, onSubmitReport }: { workflow: WorkflowType; loanNumber?: string; onSubmitReport: () => void }) => {
    const isOrigination = workflow === "ORIGINATION_MF";

    return (
        <div className="border-b border-secondary bg-primary">
            <div className="p-6">
                <Breadcrumbs />
                <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        {/* Origination: Show inspection type prominently */}
                        {isOrigination && (
                            <div className="mb-2 flex items-center gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-100 px-2.5 py-1 text-sm font-semibold text-purple-700">
                                    <FileText className="size-4" />
                                    Origination Inspection
                                </span>
                                {loanNumber && (
                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
                                        <Hash className="size-3.5" />
                                        {loanNumber}
                                    </span>
                                )}
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <h1 className="text-display-xs font-semibold text-primary">{PROPERTY.address}</h1>
                            <StatusBadge status={INSPECTION.status} />
                        </div>
                        <p className="mt-1 text-sm text-tertiary">{PROPERTY.cityState}</p>
                        {!isOrigination && (
                            <div className="mt-2">
                                <WorkflowBadge workflow={workflow} loanNumber={loanNumber} />
                            </div>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <Button color="secondary" size="md" iconLeading={Save}>Save Draft</Button>
                        <Button color="primary" size="md" iconLeading={Send} onClick={onSubmitReport}>Submit Report</Button>
                    </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                    <Badge color="brand" size="sm">{INSPECTION.type}</Badge>
                    <span className="text-tertiary">•</span>
                    <span className="text-tertiary">{PROPERTY.sqft.toLocaleString()} sqft</span>
                    <span className="text-tertiary">•</span>
                    <span className="text-tertiary">Built {PROPERTY.yearBuilt}</span>
                    <span className="text-tertiary">•</span>
                    <span className="text-tertiary">{INSPECTION.date}, 2023</span>
                </div>
            </div>
        </div>
    );
};

const AccessInfoCard = () => (
    <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
        <div className="border-b border-secondary px-5 py-4">
            <h3 className="text-sm font-semibold text-primary">Access Information</h3>
        </div>
        <div className="space-y-4 p-5">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100">
                        <Key className="size-4 text-gray-600" />
                    </div>
                    <span className="text-sm text-secondary">Lockbox Code</span>
                </div>
                <span className="font-mono text-sm font-semibold text-primary">{ACCESS_INFO.lockboxCode}</span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-gray-100">
                        <AlertTriangle className="size-4 text-gray-600" />
                    </div>
                    <span className="text-sm text-secondary">Alarm Code</span>
                </div>
                <span className="font-mono text-sm font-semibold text-primary">{ACCESS_INFO.alarmCode}</span>
            </div>
        </div>
    </div>
);

const SegmentedControl = ({ value, onChange }: { value: ItemStatus; onChange: (value: ItemStatus) => void }) => {
    const options: { value: ItemStatus; label: string }[] = [
        { value: "pass", label: "Pass" },
        { value: "fail", label: "Fail" },
        { value: "na", label: "N/A" },
    ];
    return (
        <div className="flex rounded-lg bg-gray-100 p-0.5">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={cx(
                        "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                        value === option.value
                            ? option.value === "pass"
                                ? "bg-success-500 text-white"
                                : option.value === "fail"
                                    ? "bg-error-500 text-white"
                                    : "bg-gray-500 text-white"
                            : "text-tertiary hover:text-secondary"
                    )}
                >
                    {option.label}
                </button>
            ))}
        </div>
    );
};

const DefectForm = () => {
    const [severity, setSeverity] = useState<Severity>("medium");
    return (
        <div className="mt-3 space-y-3 rounded-lg border border-error-200 bg-error-50 p-4">
            <div>
                <label className="text-xs font-medium text-error-700">Severity</label>
                <div className="mt-1.5 flex gap-2">
                    {(["low", "medium", "high"] as Severity[]).map((s) => (
                        <button
                            key={s}
                            onClick={() => setSeverity(s)}
                            className={cx(
                                "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                                severity === s
                                    ? s === "high"
                                        ? "bg-error-600 text-white"
                                        : s === "medium"
                                            ? "bg-amber-500 text-white"
                                            : "bg-gray-500 text-white"
                                    : "bg-white text-tertiary ring-1 ring-secondary hover:bg-gray-50"
                            )}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="text-xs font-medium text-error-700">Description</label>
                <textarea
                    placeholder="Describe the issue..."
                    className="mt-1.5 h-20 w-full rounded-lg border border-error-200 bg-white px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:border-error-500 focus:outline-none focus:ring-1 focus:ring-error-500"
                />
            </div>
            <div>
                <label className="text-xs font-medium text-error-700">Evidence Photos</label>
                <button className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-error-200 bg-white py-4 text-sm text-error-600 transition-colors hover:border-error-400 hover:bg-error-50">
                    <Plus className="size-4" />
                    Tap to add evidence
                </button>
            </div>
        </div>
    );
};

const InspectorRoomAccordion = ({ room }: { room: Room }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [itemStatuses, setItemStatuses] = useState<Record<string, ItemStatus>>(
        room.items.reduce((acc, item) => ({ ...acc, [item.id]: item.status === "pending" ? "pending" : item.status }), {})
    );

    const statusConfig = {
        pass: { icon: CheckCircle2, color: "text-success-600", bg: "bg-success-50", label: "Passed" },
        fail: { icon: XCircle, color: "text-error-600", bg: "bg-error-50", label: "Failed" },
        pending: { icon: Clock, color: "text-gray-400", bg: "bg-gray-50", label: "Pending" },
        na: { icon: Clock, color: "text-gray-400", bg: "bg-gray-50", label: "N/A" },
    };

    const completedCount = Object.values(itemStatuses).filter((s) => s !== "pending").length;
    const failedCount = Object.values(itemStatuses).filter((s) => s === "fail").length;

    return (
        <div className="overflow-hidden rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
            <button onClick={() => setIsOpen(!isOpen)} className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50">
                <div className={cx("flex size-10 shrink-0 items-center justify-center rounded-lg", failedCount > 0 ? "bg-error-50" : completedCount === room.items.length ? "bg-success-50" : "bg-gray-50")}>
                    {failedCount > 0 ? (
                        <XCircle className="size-5 text-error-600" />
                    ) : completedCount === room.items.length ? (
                        <CheckCircle2 className="size-5 text-success-600" />
                    ) : (
                        <Clock className="size-5 text-gray-400" />
                    )}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-primary">{room.name}</h3>
                        {failedCount > 0 && <Badge color="error" size="sm">{failedCount} Issue{failedCount !== 1 ? "s" : ""}</Badge>}
                    </div>
                    <p className="mt-0.5 text-xs text-tertiary">{completedCount} of {room.items.length} completed</p>
                </div>
                <ChevronDown className={cx("size-5 shrink-0 text-gray-400 transition-transform", isOpen && "rotate-180")} />
            </button>
            {isOpen && (
                <div className="border-t border-secondary">
                    {room.items.map((item) => {
                        const status = itemStatuses[item.id];
                        const isFailed = status === "fail";
                        return (
                            <div key={item.id} className={cx("border-b border-secondary px-5 py-4 last:border-b-0", isFailed && "border-l-4 border-l-error-500")}>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-sm font-medium text-secondary">{item.name}</span>
                                    <SegmentedControl
                                        value={status}
                                        onChange={(newStatus) => setItemStatuses((prev) => ({ ...prev, [item.id]: newStatus }))}
                                    />
                                </div>
                                {isFailed && <DefectForm />}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// ============================================================================
// Page Component
// ============================================================================

export default function InspectionDetailPage({ params }: { params: { id: string } }) {
    const { isAdmin, isInspector } = useUserRole();
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRequestChangesModalOpen, setIsRequestChangesModalOpen] = useState(false);
    const [isSubmitReportModalOpen, setIsSubmitReportModalOpen] = useState(false);
    const [formData, setFormData] = useState<Record<string, unknown>>({});
    const [showValidation, setShowValidation] = useState(false);

    // Get inspection data from mock data based on ID
    const inspection = getInspectionById(params.id);

    // 404 handling - no fallback, show error if not found
    if (!inspection) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="p-10 text-center">
                    <div className="text-6xl mb-4">404</div>
                    <h1 className="text-2xl font-bold text-red-600">Inspection Not Found</h1>
                    <p className="mt-2 text-gray-600">Could not find inspection with ID: <code className="bg-gray-100 px-2 py-1 rounded">{params.id}</code></p>
                    <p className="text-sm text-gray-500 mt-4">Check your terminal console for available IDs.</p>
                    <a href="/inspections" className="mt-6 inline-block text-brand-600 hover:underline">
                        ← Back to Inspections
                    </a>
                </div>
            </div>
        );
    }

    // Extract values from found inspection
    const workflow = inspection.workflow;
    const loanNumber = inspection.loanNumber;
    const isOrigination = workflow === "ORIGINATION_MF";

    // Load template based on inspection templateId
    const template = getTemplateById(inspection.templateId)
        || (isOrigination ? ORIGINATION_TEMPLATE : SERVICING_TEMPLATE);

    // Handle form field changes
    const handleFieldChange = (fieldId: string, value: unknown) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }));
    };

    const handleApprove = () => {
        console.log("Inspection approved");
        setIsApproveModalOpen(false);
    };

    const handleRequestChanges = (message: string) => {
        console.log("Changes requested:", message);
        setIsRequestChangesModalOpen(false);
    };

    const handleSubmitReport = () => {
        // Show validation errors before submitting
        setShowValidation(true);
        console.log("Report submitted for approval", formData);
        setIsSubmitReportModalOpen(false);
    };

    // Inspector View
    if (isInspector) {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* DEBUG BANNER - REMOVE BEFORE PRODUCTION */}
                <div className="bg-red-500 text-white p-4 font-mono text-sm">
                    DEBUG INFO:
                    <br />ID: {params.id}
                    <br />Workflow: {workflow} (Type: {typeof workflow})
                    <br />Template: {inspection.templateId}
                    <br />isOrigination: {String(isOrigination)}
                    <br />Loan #: {loanNumber || "N/A"}
                </div>
                <InspectorHeader
                    workflow={workflow}
                    loanNumber={loanNumber}
                    onSubmitReport={() => setIsSubmitReportModalOpen(true)}
                />
                <div className="p-6 lg:p-8">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-8 lg:grid-cols-3">
                            {/* Main Column */}
                            <div className="space-y-6 lg:col-span-2">
                                {/* Workflow Switch: Origination vs Servicing */}
                                {isOrigination ? (
                                    // Path A: Origination - Questionnaire Form
                                    <QuestionnaireView
                                        inspectionId={params.id}
                                        initialData={formData as Record<string, string>}
                                        onDataChange={(data) => setFormData(data)}
                                    />
                                ) : (
                                    // Path B: Servicing - Original Checklist with Pass/Fail
                                    <div>
                                        <div className="mb-4 flex items-center justify-between">
                                            <h2 className="text-sm font-semibold text-primary">Inspection Checklist</h2>
                                        </div>
                                        <div className="space-y-4">
                                            {ROOMS.map((room) => (
                                                <InspectorRoomAccordion key={room.id} room={room} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Sidebar */}
                            <div className="sticky top-6 h-fit space-y-6">
                                <PropertyHeroCard onOpenGallery={() => setIsGalleryOpen(true)} />
                                <AccessInfoCard />
                                <MapCard />
                                <TimelineCard />
                            </div>
                        </div>
                    </div>
                </div>
                <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
                <SubmitReportModal isOpen={isSubmitReportModalOpen} onClose={() => setIsSubmitReportModalOpen(false)} onSubmit={handleSubmitReport} />
            </div>
        );
    }

    // Admin View (Default)
    return (
        <div className="min-h-screen bg-gray-50">
            {/* DEBUG BANNER - REMOVE BEFORE PRODUCTION */}
            <div className="bg-red-500 text-white p-4 font-mono text-sm">
                DEBUG INFO:
                <br />ID: {params.id}
                <br />Workflow: {workflow} (Type: {typeof workflow})
                <br />Template: {inspection.templateId}
                <br />isOrigination: {String(isOrigination)}
                <br />Loan #: {loanNumber || "N/A"}
            </div>
            <AdminHeader
                workflow={workflow}
                loanNumber={loanNumber}
                onApprove={() => setIsApproveModalOpen(true)}
                onRequestChanges={() => setIsRequestChangesModalOpen(true)}
            />
            <div className="p-6 lg:p-8">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8">
                        <ReviewRequestBanner />
                    </div>
                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* Main Column */}
                        <div className="space-y-8 lg:col-span-2">
                            <AdminSummaryGrid />
                            {/* Workflow Switch: Origination vs Servicing */}
                            {isOrigination ? (
                                // Path A: Origination - Questionnaire Form (read-only for admin)
                                <QuestionnaireView
                                    inspectionId={params.id}
                                    initialData={formData as Record<string, string>}
                                    onDataChange={(data) => setFormData(data)}
                                />
                            ) : (
                                // Path B: Servicing - Original Checklist with Pass/Fail results
                                <div>
                                    <div className="mb-4 flex items-center justify-between">
                                        <h2 className="text-sm font-semibold text-primary">Inspection Checklist</h2>
                                        <span className="text-xs text-tertiary">
                                            {ROOMS.filter((r) => r.status !== "pending").length} of {ROOMS.length} complete
                                        </span>
                                    </div>
                                    <div className="space-y-4">
                                        {ROOMS.map((room) => (
                                            <AdminRoomAccordion key={room.id} room={room} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        {/* Sidebar */}
                        <div className="sticky top-6 h-fit space-y-6">
                            <PropertyHeroCard onOpenGallery={() => setIsGalleryOpen(true)} />
                            <MapCard />
                            <InspectorCard />
                            <TimelineCard />
                        </div>
                    </div>
                </div>
            </div>
            <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
            <ApproveModal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} onConfirm={handleApprove} />
            <RequestChangesModal isOpen={isRequestChangesModalOpen} onClose={() => setIsRequestChangesModalOpen(false)} onSubmit={handleRequestChanges} />
        </div>
    );
}
