"use client";

import { use, useState } from "react";
import {
    AlertTriangle,
    ArrowLeft,
    Calendar,
    CheckCircle,
    ChevronRight,
    Clock,
    Copy,
    Download,
    ExternalLink,
    FileText,
    Home,
    Key,
    Lock,
    Mail,
    MapPin,
    Navigation,
    Pencil,
    Phone,
    Plus,
    Shield,
    User,
} from "lucide-react";
import Link from "next/link";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { PropertyFormModal, type PropertyFormData } from "@/components/features/properties/property-form-modal";
import { CreateInspectionSheet } from "@/components/features/inspections/create-inspection-sheet";
import { PropertyImage } from "@/components/ui/property-image";
import { useUserRole } from "@/contexts/user-role-context";
import { cx } from "@/utils/cx";
import type { Property } from "@/types";
import { getPropertyById, INSPECTIONS, formatDate } from "@/data/mock-data";

// ============================================================================
// Types (Extended for Detail View)
// ============================================================================

type PropertyStatus = "Occupied" | "Vacant";

// Additional detail-page-specific data not in base Property type
interface PropertyDetailExtras {
    ownerPhone: string;
    ownerAvatar?: string;
    tenantAvatar?: string;
    defectHistory: {
        id: string;
        date: string;
        description: string;
        severity: "Low" | "Medium" | "High";
        resolved: boolean;
    }[];
    documents: {
        id: string;
        name: string;
        type: string;
        uploadDate: string;
    }[];
}

// Combined type for the detail view
interface PropertyDetails extends Property {
    status: PropertyStatus;
    ownerPhone: string;
    ownerAvatar?: string;
    tenantAvatar?: string;
    inspectionHistory: {
        id: string;
        date: string;
        type: string;
        status: "Completed" | "In Progress";
        inspector: string;
    }[];
    defectHistory: PropertyDetailExtras["defectHistory"];
    documents: PropertyDetailExtras["documents"];
}

// ============================================================================
// Mock Data Extensions (Detail-Page-Specific Data)
// ============================================================================

// Extended data not present in the central Property type
const PROPERTY_EXTRAS: Record<string, PropertyDetailExtras> = {
    "1": {
        ownerPhone: "(312) 555-0123",
        ownerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face",
        tenantAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&face",
        defectHistory: [
            { id: "d1", date: "Jan 12, 2026", description: "Minor crack in bathroom tile", severity: "Low", resolved: false },
            { id: "d2", date: "Jan 10, 2025", description: "HVAC filter needs replacement", severity: "Medium", resolved: true },
            { id: "d3", date: "Aug 15, 2024", description: "Garage door sensor misaligned", severity: "Low", resolved: true },
        ],
        documents: [
            { id: "doc1", name: "Lease_Agreement_2026.pdf", type: "pdf", uploadDate: "Jan 5, 2026" },
            { id: "doc2", name: "Insurance_Policy.pdf", type: "pdf", uploadDate: "Dec 15, 2025" },
            { id: "doc3", name: "Property_Disclosure.pdf", type: "pdf", uploadDate: "Aug 10, 2024" },
        ],
    },
    "2": {
        ownerPhone: "(312) 555-0456",
        ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&face",
        tenantAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&face",
        defectHistory: [
            { id: "d1", date: "Dec 28, 2025", description: "Window seal deteriorating in master bedroom", severity: "Medium", resolved: false },
        ],
        documents: [
            { id: "doc1", name: "Lease_Agreement_2025.pdf", type: "pdf", uploadDate: "Jun 1, 2025" },
            { id: "doc2", name: "HOA_Rules.pdf", type: "pdf", uploadDate: "May 20, 2025" },
        ],
    },
    "3": {
        ownerPhone: "(312) 555-0789",
        ownerAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face",
        defectHistory: [
            { id: "d1", date: "Nov 15, 2025", description: "Carpet stains in living room", severity: "Medium", resolved: false },
            { id: "d2", date: "Nov 15, 2025", description: "Broken blinds in bedroom 2", severity: "Low", resolved: false },
        ],
        documents: [
            { id: "doc1", name: "Move_Out_Report.pdf", type: "pdf", uploadDate: "Nov 15, 2025" },
        ],
    },
};

// Default extras for unknown properties
const DEFAULT_EXTRAS: PropertyDetailExtras = {
    ownerPhone: "(312) 555-0000",
    defectHistory: [],
    documents: [],
};

/** Build a PropertyDetails object from central Property + extras */
const buildPropertyDetails = (id: string): PropertyDetails | null => {
    const baseProperty = getPropertyById(id);
    if (!baseProperty) return null;

    const extras = PROPERTY_EXTRAS[id] || DEFAULT_EXTRAS;

    // Get inspection history from central INSPECTIONS data
    const propertyInspections = INSPECTIONS
        .filter((i) => i.propertyId === id)
        .map((i) => ({
            id: i.id,
            date: formatDate(i.scheduledDate),
            type: i.type,
            status: i.status as "Completed" | "In Progress",
            inspector: i.inspector?.fullName || "Unassigned",
        }));

    return {
        ...baseProperty,
        status: baseProperty.tenantName ? "Occupied" : "Vacant",
        ownerPhone: extras.ownerPhone,
        ownerAvatar: extras.ownerAvatar,
        tenantAvatar: extras.tenantAvatar,
        inspectionHistory: propertyInspections,
        defectHistory: extras.defectHistory,
        documents: extras.documents,
    };
};

// Default property for unknown IDs
const DEFAULT_PROPERTY: PropertyDetails = {
    id: "0",
    organizationId: "",
    address: "Unknown Property",
    city: "Chicago",
    state: "IL",
    zip: "60601",
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop",
    status: "Vacant",
    ownerName: "Unknown Owner",
    ownerEmail: "unknown@example.com",
    ownerPhone: "(312) 555-0000",
    inspectionHistory: [],
    defectHistory: [],
    documents: [],
};

// ============================================================================
// Helpers
// ============================================================================

const SEVERITY_COLORS: Record<string, string> = {
    Low: "bg-blue-50 text-blue-700 border-blue-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    High: "bg-red-50 text-red-700 border-red-200",
};

// ============================================================================
// Admin View Components
// ============================================================================

interface OwnerCardProps {
    ownerName: string;
    ownerEmail?: string;
    ownerPhone: string;
    ownerAvatar?: string;
}

const OwnerCard = ({ ownerName, ownerEmail, ownerPhone, ownerAvatar }: OwnerCardProps) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-5 py-3">
            <User className="size-4 text-brand-600" />
            <h3 className="text-sm font-semibold text-secondary">Owner Details</h3>
        </div>
        {/* Card Body */}
        <div className="p-5">
            <div className="flex items-center gap-4">
                <Avatar
                    size="lg"
                    src={ownerAvatar}
                    alt={ownerName}
                    initials={ownerName.split(" ").map((n) => n[0]).join("")}
                />
                <div className="min-w-0 flex-1">
                    <p className="text-lg font-semibold text-primary">{ownerName}</p>
                    <div className="mt-3 space-y-2">
                        {ownerEmail && (
                            <div className="flex items-center gap-3">
                                <span className="w-16 text-xs font-medium uppercase tracking-wider text-tertiary">Email</span>
                                <a href={`mailto:${ownerEmail}`} className="text-sm text-brand-600 hover:underline">
                                    {ownerEmail}
                                </a>
                            </div>
                        )}
                        <div className="flex items-center gap-3">
                            <span className="w-16 text-xs font-medium uppercase tracking-wider text-tertiary">Phone</span>
                            <a href={`tel:${ownerPhone}`} className="text-sm text-primary hover:underline">
                                {ownerPhone}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

interface TenantCardProps {
    tenantName?: string;
    leaseEndDate?: Date;
    tenantAvatar?: string;
}

const TenantCard = ({ tenantName, leaseEndDate, tenantAvatar }: TenantCardProps) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-5 py-3">
            <User className="size-4 text-success-600" />
            <h3 className="text-sm font-semibold text-secondary">Tenant Details</h3>
        </div>
        {/* Card Body */}
        <div className="p-5">
            {tenantName ? (
                <div className="flex items-center gap-4">
                    <Avatar
                        size="lg"
                        src={tenantAvatar}
                        alt={tenantName}
                        initials={tenantName.split(" ").map((n) => n[0]).join("")}
                    />
                    <div className="min-w-0 flex-1">
                        <p className="text-lg font-semibold text-primary">{tenantName}</p>
                        {leaseEndDate && (
                            <div className="mt-3">
                                <div className="flex items-center gap-3">
                                    <span className="w-20 text-xs font-medium uppercase tracking-wider text-tertiary">Lease Ends</span>
                                    <span className="text-sm font-medium text-primary">{formatDate(leaseEndDate)}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="flex items-center gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50/50 p-4">
                    <div className="rounded-full bg-gray-200 p-3">
                        <User className="size-5 text-gray-400" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-secondary">No Current Tenant</p>
                        <p className="text-xs text-tertiary">Property is currently vacant</p>
                    </div>
                </div>
            )}
        </div>
    </div>
);

interface DocumentsCardProps {
    documents: PropertyDetails["documents"];
}

const DocumentsCard = ({ documents }: DocumentsCardProps) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3">
            <div className="flex items-center gap-2">
                <FileText className="size-4 text-purple-600" />
                <h3 className="text-sm font-semibold text-secondary">Documents</h3>
            </div>
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-secondary">
                {documents.length}
            </span>
        </div>
        {/* Card Body */}
        <div className="p-5">
            {documents.length === 0 ? (
                <p className="py-4 text-center text-sm text-tertiary">No documents uploaded</p>
            ) : (
                <div className="space-y-2">
                    {documents.map((doc) => (
                        <div
                            key={doc.id}
                            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3 transition-colors hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-3">
                                <div className="rounded-lg bg-red-100 p-2">
                                    <FileText className="size-4 text-red-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-primary">{doc.name}</p>
                                    <p className="text-xs text-tertiary">{doc.uploadDate}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-gray-600"
                                    title="View"
                                >
                                    <ExternalLink className="size-4" />
                                </button>
                                <button
                                    className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-white hover:text-gray-600"
                                    title="Download"
                                >
                                    <Download className="size-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

interface InspectionHistoryProps {
    history: PropertyDetails["inspectionHistory"];
}

const InspectionHistoryTimeline = ({ history }: InspectionHistoryProps) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3">
            <div className="flex items-center gap-2">
                <Clock className="size-4 text-brand-600" />
                <h3 className="text-sm font-semibold text-secondary">Inspection Timeline</h3>
            </div>
            <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-secondary">
                {history.length}
            </span>
        </div>
        {/* Card Body */}
        <div className="p-5">
            {history.length === 0 ? (
                <p className="py-4 text-center text-sm text-tertiary">No inspection history</p>
            ) : (
                <div className="relative">
                    {/* Vertical Timeline Line */}
                    <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-200" />

                    {/* Timeline Items */}
                    <div className="space-y-6">
                        {history.map((inspection, index) => (
                            <Link
                                key={inspection.id}
                                href={`/inspections/${inspection.id}`}
                                className="group relative flex items-start gap-4 pl-10"
                            >
                                {/* Timeline Node */}
                                <div
                                    className={cx(
                                        "absolute left-0 flex size-8 items-center justify-center rounded-full ring-4 ring-white",
                                        inspection.status === "Completed"
                                            ? "bg-emerald-100"
                                            : "bg-amber-100"
                                    )}
                                >
                                    {inspection.status === "Completed" ? (
                                        <CheckCircle className="size-4 text-emerald-600" />
                                    ) : (
                                        <Clock className="size-4 text-amber-600" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="min-w-0 flex-1 rounded-lg border border-transparent p-3 transition-colors group-hover:border-gray-200 group-hover:bg-gray-50">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-primary group-hover:text-brand-600">
                                                {inspection.type} Inspection
                                            </p>
                                            <p className="mt-0.5 text-xs text-tertiary">
                                                {inspection.date} &bull; {inspection.inspector}
                                            </p>
                                        </div>
                                        <Badge
                                            color={inspection.status === "Completed" ? "success" : "orange"}
                                            size="sm"
                                        >
                                            {inspection.status}
                                        </Badge>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    </div>
);

// ============================================================================
// Inspector View Components
// ============================================================================

interface AccessCardProps {
    lockboxCode?: string;
    alarmCode?: string;
}

const AccessCard = ({ lockboxCode, alarmCode }: AccessCardProps) => {
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const handleCopy = (value: string, field: string) => {
        navigator.clipboard.writeText(value);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    return (
        <div className="overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
            {/* Card Header */}
            <div className="flex items-center gap-2 border-b border-slate-700 px-6 py-4">
                <Key className="size-5 text-slate-400" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
                    Property Access
                </h3>
            </div>

            {/* Codes Section */}
            <div className="p-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    {/* Entry Code (Lockbox) */}
                    <div className="rounded-xl bg-slate-800/50 p-5">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-lg bg-blue-500/20 p-2">
                                <Key className="size-4 text-blue-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-400">Entry Code</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-3xl font-bold tracking-widest text-white">
                                {lockboxCode || "N/A"}
                            </span>
                            {lockboxCode && (
                                <button
                                    onClick={() => handleCopy(lockboxCode, "entry")}
                                    className="rounded-lg bg-slate-700 p-2.5 text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
                                    title="Copy code"
                                >
                                    {copiedField === "entry" ? (
                                        <CheckCircle className="size-5 text-emerald-400" />
                                    ) : (
                                        <Copy className="size-5" />
                                    )}
                                </button>
                            )}
                        </div>
                        {copiedField === "entry" && (
                            <p className="mt-2 text-xs font-medium text-emerald-400">Copied!</p>
                        )}
                    </div>

                    {/* Alarm Code */}
                    <div className="rounded-xl bg-slate-800/50 p-5">
                        <div className="mb-3 flex items-center gap-2">
                            <div className="rounded-lg bg-red-500/20 p-2">
                                <Lock className="size-4 text-red-400" />
                            </div>
                            <span className="text-sm font-medium text-slate-400">Alarm Code</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="font-mono text-3xl font-bold tracking-widest text-white">
                                {alarmCode || "N/A"}
                            </span>
                            {alarmCode && (
                                <button
                                    onClick={() => handleCopy(alarmCode, "alarm")}
                                    className="rounded-lg bg-slate-700 p-2.5 text-slate-300 transition-colors hover:bg-slate-600 hover:text-white"
                                    title="Copy code"
                                >
                                    {copiedField === "alarm" ? (
                                        <CheckCircle className="size-5 text-emerald-400" />
                                    ) : (
                                        <Copy className="size-5" />
                                    )}
                                </button>
                            )}
                        </div>
                        {copiedField === "alarm" && (
                            <p className="mt-2 text-xs font-medium text-emerald-400">Copied!</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface SafetyAlertProps {
    notes: string;
}

const SafetyAlert = ({ notes }: SafetyAlertProps) => (
    <div className="mt-6 rounded-r-xl border-l-4 border-red-500 bg-red-50 p-5">
        <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-100 p-2">
                <AlertTriangle className="size-5 text-red-600" />
            </div>
            <div>
                <h4 className="text-sm font-semibold text-red-800">Safety Warning</h4>
                <p className="mt-1 text-sm text-red-700">{notes}</p>
            </div>
        </div>
    </div>
);

interface DefectHistoryProps {
    history: PropertyDetails["defectHistory"];
}

const DefectHistoryList = ({ history }: DefectHistoryProps) => (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-5 py-3">
            <div className="flex items-center gap-2">
                <AlertTriangle className="size-4 text-amber-600" />
                <h3 className="text-sm font-semibold text-secondary">Property Defects</h3>
            </div>
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                {history.filter((d) => !d.resolved).length} open
            </span>
        </div>
        {/* Card Body */}
        <div className="p-5">
            {history.length === 0 ? (
                <p className="py-4 text-center text-sm text-tertiary">No defect history</p>
            ) : (
                <div className="space-y-3">
                    {history.map((defect) => (
                        <div
                            key={defect.id}
                            className={cx(
                                "rounded-lg border p-4",
                                defect.resolved ? "border-gray-200 bg-gray-50" : "border-gray-200 bg-white"
                            )}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <p className={cx(
                                        "text-sm font-medium",
                                        defect.resolved ? "text-tertiary line-through" : "text-primary"
                                    )}>
                                        {defect.description}
                                    </p>
                                    <p className="mt-1 text-xs text-tertiary">{defect.date}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={cx(
                                        "rounded-full border px-2 py-0.5 text-xs font-medium",
                                        SEVERITY_COLORS[defect.severity]
                                    )}>
                                        {defect.severity}
                                    </span>
                                    {defect.resolved && (
                                        <CheckCircle className="size-4 text-success-500" />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

// ============================================================================
// Page Component
// ============================================================================

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function PropertyDetailPage({ params }: PageProps) {
    const { id } = use(params);
    const { isAdmin, isInspector } = useUserRole();

    const property = buildPropertyDetails(id) || DEFAULT_PROPERTY;

    // Modal states
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isScheduleSheetOpen, setIsScheduleSheetOpen] = useState(false);

    // Convert property to form data for editing
    const propertyFormData: Partial<PropertyFormData> = {
        address: property.address,
        city: property.city,
        state: property.state,
        zip: property.zip,
        imageUrl: property.imageUrl,
        ownerName: property.ownerName,
        ownerEmail: property.ownerEmail,
        tenantName: property.tenantName || "",
        leaseEndDate: property.leaseEndDate ? formatDate(property.leaseEndDate) : "",
        lockboxCode: property.lockboxCode,
        alarmCode: property.alarmCode,
        accessNotes: property.accessNotes,
    };

    const handleGetDirections = () => {
        const address = encodeURIComponent(`${property.address}, ${property.city}, ${property.state} ${property.zip}`);
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Breadcrumb Bar */}
            <div className="border-b border-gray-200 bg-white px-6 py-3">
                <nav className="flex items-center gap-2 text-sm">
                    <Link href="/properties" className="flex items-center gap-1 text-tertiary hover:text-primary">
                        <Home className="size-4" />
                        Properties
                    </Link>
                    <ChevronRight className="size-4 text-gray-300" />
                    <span className="font-medium text-primary">{property.address}</span>
                </nav>
            </div>

            {/* Hero Image Banner */}
            <div className="relative h-64 w-full overflow-hidden">
                <PropertyImage
                    src={property.imageUrl}
                    alt={property.address}
                    className="h-full w-full"
                />
            </div>

            {/* Info Bar */}
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    {/* Left: Address Info */}
                    <div>
                        <h1 className="text-2xl font-bold text-primary">{property.address}</h1>
                        <p className="mt-1 flex items-center gap-1.5 text-gray-500">
                            <MapPin className="size-4" />
                            {property.city}, {property.state} {property.zip}
                        </p>
                    </div>

                    {/* Right: Status + Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Status Pill */}
                        <span
                            className={cx(
                                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
                                property.status === "Occupied"
                                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                                    : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                            )}
                        >
                            <span
                                className={cx(
                                    "size-2 rounded-full",
                                    property.status === "Occupied" ? "bg-emerald-500" : "bg-gray-400"
                                )}
                            />
                            {property.status}
                        </span>

                        {/* Admin Actions */}
                        {isAdmin && (
                            <>
                                <Button
                                    color="primary"
                                    size="md"
                                    iconLeading={Plus}
                                    onClick={() => setIsScheduleSheetOpen(true)}
                                >
                                    Schedule Inspection
                                </Button>
                                <Button
                                    color="secondary"
                                    size="md"
                                    iconLeading={Pencil}
                                    onClick={() => setIsEditModalOpen(true)}
                                >
                                    Edit
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto max-w-7xl p-6">
                {isAdmin ? (
                    // =========================================================
                    // ADMIN VIEW: CRM-Style Grid Layout
                    // =========================================================
                    <div className="grid grid-cols-12 gap-6">
                        {/* Left Column: Info Cards (8 cols) */}
                        <div className="col-span-12 space-y-6 lg:col-span-8">
                            {/* Owner & Tenant Side-by-Side */}
                            <div className="grid gap-6 md:grid-cols-2">
                                <OwnerCard
                                    ownerName={property.ownerName}
                                    ownerEmail={property.ownerEmail}
                                    ownerPhone={property.ownerPhone}
                                    ownerAvatar={property.ownerAvatar}
                                />
                                <TenantCard
                                    tenantName={property.tenantName}
                                    leaseEndDate={property.leaseEndDate}
                                    tenantAvatar={property.tenantAvatar}
                                />
                            </div>

                            {/* Documents */}
                            <DocumentsCard documents={property.documents} />
                        </div>

                        {/* Right Column: Timeline (4 cols) */}
                        <div className="col-span-12 lg:col-span-4">
                            <InspectionHistoryTimeline history={property.inspectionHistory} />
                        </div>
                    </div>
                ) : (
                    // =========================================================
                    // INSPECTOR VIEW: High-Contrast Field Tool
                    // =========================================================
                    <div className="grid gap-6 lg:grid-cols-2">
                        {/* Left Column: Access & Navigation */}
                        <div>
                            {/* High-Contrast Access Card */}
                            <AccessCard
                                lockboxCode={property.lockboxCode}
                                alarmCode={property.alarmCode}
                            />

                            {/* Safety Alert (Separate Section) */}
                            {property.accessNotes && (
                                <SafetyAlert notes={property.accessNotes} />
                            )}

                            {/* Full-Width Navigation Button */}
                            <Button
                                color="secondary"
                                size="xl"
                                iconLeading={Navigation}
                                className="mt-6 w-full justify-center"
                                onClick={handleGetDirections}
                            >
                                Get Directions
                            </Button>

                            {/* Start Inspection Button */}
                            <Button
                                color="primary"
                                size="xl"
                                className="mt-3 w-full justify-center"
                            >
                                Start Inspection
                            </Button>
                        </div>

                        {/* Right Column: Property History */}
                        <div>
                            <DefectHistoryList history={property.defectHistory} />
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Property Modal */}
            <PropertyFormModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                mode="edit"
                initialData={propertyFormData}
                onSubmit={(data) => {
                    console.log("Property updated:", data);
                    setIsEditModalOpen(false);
                }}
            />

            {/* Schedule Inspection Sheet */}
            <CreateInspectionSheet
                isOpen={isScheduleSheetOpen}
                onClose={() => setIsScheduleSheetOpen(false)}
            />
        </div>
    );
}
