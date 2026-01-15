"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
    AlertTriangle,
    ArrowLeft,
    Camera,
    CheckCircle2,
    Clock,
    ClipboardList,
    FileText,
    Hash,
    Key,
    MapPin,
    MessageCircle,
    PlayCircle,
    Printer,
    RotateCcw,
    Save,
    Send,
    Shield,
    Upload,
    X,
    XCircle,
    Zap,
} from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { InspectionChecklist } from "@/components/inspections/inspection-checklist";
import { QuestionnaireView } from "@/components/inspections/questionnaire-view";
import { PropertyImage } from "@/components/ui/property-image";
import { useUserRole } from "@/contexts/user-role-context";
import { getInspectionById } from "@/data/mock-data";
import { cx } from "@/utils/cx";
import type { Inspection, InspectionStatus } from "@/types";

// ============================================================================
// Types
// ============================================================================

interface TimelineEvent {
    id: string;
    message: string;
    time: string;
    type: "action" | "status" | "create";
}

// ============================================================================
// Mock Data for UI Demo
// ============================================================================

const MOCK_TIMELINE: TimelineEvent[] = [
    { id: "1", message: "Inspector uploaded 4 photos", time: "10 min ago", type: "action" },
    { id: "2", message: "Kitchen inspection completed", time: "25 min ago", type: "action" },
    { id: "3", message: "Living Room marked as passed", time: "1 hour ago", type: "status" },
    { id: "4", message: "Status changed to In Progress", time: "2 hours ago", type: "status" },
    { id: "5", message: "Inspector assigned", time: "1 day ago", type: "action" },
    { id: "6", message: "Inspection scheduled", time: "2 days ago", type: "status" },
    { id: "7", message: "Inspection created", time: "3 days ago", type: "create" },
];

const GALLERY_PHOTOS = [
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300&h=300&fit=crop",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=300&fit=crop",
];

// ============================================================================
// Status Configuration
// ============================================================================

const STATUS_CONFIG: Record<InspectionStatus, { icon: typeof Clock; color: string; bg: string; border: string }> = {
    Scheduled: { icon: Clock, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200" },
    "In Progress": { icon: PlayCircle, color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
    Completed: { icon: CheckCircle2, color: "text-green-700", bg: "bg-green-50", border: "border-green-200" },
    "Pending Review": { icon: Clock, color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
    Cancelled: { icon: XCircle, color: "text-gray-500", bg: "bg-gray-100", border: "border-gray-200" },
};

// ============================================================================
// Header Components
// ============================================================================

function Breadcrumbs() {
    return (
        <Link
            href="/inspections"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
            <ArrowLeft className="size-4" />
            Back to Inspections
        </Link>
    );
}

function StatusBadge({ status }: { status: InspectionStatus }) {
    const config = STATUS_CONFIG[status];
    const Icon = config.icon;
    return (
        <span className={cx("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium border", config.bg, config.color, config.border)}>
            <Icon className="size-4" />
            {status}
        </span>
    );
}

function WorkflowBadge({ workflow, loanNumber }: { workflow: string; loanNumber?: string }) {
    const isOrigination = workflow === "ORIGINATION_MF";
    return (
        <div className="flex items-center gap-2">
            <span className={cx(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                isOrigination ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
            )}>
                {isOrigination ? <FileText className="size-3" /> : <ClipboardList className="size-3" />}
                {isOrigination ? "Origination" : "Servicing"}
            </span>
            {loanNumber && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-mono">
                    <Hash className="size-3" />
                    {loanNumber}
                </span>
            )}
        </div>
    );
}

function UrgencyBadge() {
    return (
        <span className="inline-flex items-center gap-1 rounded-md bg-orange-50 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-orange-700 border border-orange-200">
            <Zap className="size-3" />
            Urgent
        </span>
    );
}

// ============================================================================
// Sidebar Components
// ============================================================================

function PropertyCard({ inspection, onOpenGallery }: { inspection: Inspection; onOpenGallery: () => void }) {
    const imageUrl = inspection.property?.imageUrl || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop";

    return (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">Property</h3>
            </div>
            <div className="relative">
                <PropertyImage
                    src={imageUrl}
                    alt={inspection.property?.address || "Property"}
                    className="h-48 w-full"
                />
                <button
                    onClick={onOpenGallery}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-gray-900/80 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-gray-900"
                >
                    <Camera className="size-3.5" />
                    View Gallery
                </button>
            </div>
        </div>
    );
}

function AccessCard({ inspection, isInspector }: { inspection: Inspection; isInspector: boolean }) {
    const lockboxCode = inspection.property?.lockboxCode || "----";
    const alarmCode = inspection.property?.alarmCode || "----";
    const accessNotes = inspection.property?.accessNotes;

    return (
        <div className={cx(
            "rounded-xl shadow-sm ring-1 overflow-hidden",
            isInspector ? "bg-amber-50 ring-amber-200" : "bg-white ring-gray-200"
        )}>
            <div className={cx(
                "border-b px-4 py-3",
                isInspector ? "border-amber-200" : "border-gray-100"
            )}>
                <h3 className={cx(
                    "text-sm font-semibold",
                    isInspector ? "text-amber-900" : "text-gray-900"
                )}>
                    Access Information
                </h3>
            </div>
            <div className="p-4 space-y-3">
                {/* Lockbox Code */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={cx(
                            "flex size-8 items-center justify-center rounded-lg",
                            isInspector ? "bg-amber-100" : "bg-gray-100"
                        )}>
                            <Key className={cx("size-4", isInspector ? "text-amber-700" : "text-gray-600")} />
                        </div>
                        <span className="text-sm text-gray-600">Lockbox Code</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-gray-900">{lockboxCode}</span>
                </div>

                {/* Alarm Code */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={cx(
                            "flex size-8 items-center justify-center rounded-lg",
                            isInspector ? "bg-amber-100" : "bg-gray-100"
                        )}>
                            <Shield className={cx("size-4", isInspector ? "text-amber-700" : "text-gray-600")} />
                        </div>
                        <span className="text-sm text-gray-600">Alarm Code</span>
                    </div>
                    <span className="font-mono text-sm font-bold text-gray-900">{alarmCode}</span>
                </div>

                {/* Access Notes */}
                {accessNotes && (
                    <div className={cx(
                        "mt-3 rounded-lg p-3 text-sm",
                        isInspector ? "bg-amber-100/50 text-amber-900" : "bg-gray-50 text-gray-600"
                    )}>
                        <p className="font-medium mb-1">Access Notes:</p>
                        <p>{accessNotes}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function LocationCard({ inspection }: { inspection: Inspection }) {
    return (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">Location</h3>
            </div>
            {/* Map Placeholder */}
            <div className="aspect-[4/3] w-full bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                {/* Stylized Map Grid */}
                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(100,116,139,0.4) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(100,116,139,0.4) 1px, transparent 1px)
                        `,
                        backgroundSize: "40px 40px",
                    }}
                />
                {/* Center Pin */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-10 h-10 bg-brand-600 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
                        <MapPin className="size-5 text-white" />
                    </div>
                    <div className="mt-3 px-3 py-1.5 bg-white rounded-lg shadow-md">
                        <span className="text-xs font-medium text-gray-900">
                            {inspection.property?.city}, {inspection.property?.state}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function InspectorCard({ inspection }: { inspection: Inspection }) {
    if (!inspection.inspector) {
        return (
            <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
                <div className="border-b border-gray-100 px-4 py-3">
                    <h3 className="text-sm font-semibold text-gray-900">Assigned Inspector</h3>
                </div>
                <div className="p-4 text-center">
                    <p className="text-sm text-amber-600 font-medium">Unassigned</p>
                    <button className="mt-2 text-sm text-brand-600 hover:underline">
                        Assign Inspector
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">Assigned Inspector</h3>
            </div>
            <div className="flex items-center gap-3 p-4">
                <Avatar
                    size="lg"
                    src={inspection.inspector.avatar}
                    alt={inspection.inspector.fullName}
                    initials={inspection.inspector.fullName.split(" ").map(n => n[0]).join("")}
                />
                <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900">{inspection.inspector.fullName}</p>
                    <p className="text-sm text-gray-500">{inspection.inspector.email}</p>
                </div>
                <button className="flex size-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                    <MessageCircle className="size-5" />
                </button>
            </div>
        </div>
    );
}

function TimelineCard() {
    return (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
            <div className="border-b border-gray-100 px-4 py-3">
                <h3 className="text-sm font-semibold text-gray-900">Activity Timeline</h3>
            </div>
            <div className="p-4">
                <div className="relative">
                    <div className="absolute bottom-0 left-[5px] top-0 w-0.5 bg-gray-200" />
                    <div className="space-y-5">
                        {MOCK_TIMELINE.slice(0, 5).map((event, index) => (
                            <div key={event.id} className="relative flex gap-3">
                                <div className={cx(
                                    "relative z-10 mt-1 size-3 shrink-0 rounded-full ring-4 ring-white",
                                    index === 0 ? "bg-brand-600" : "bg-gray-300"
                                )} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm text-gray-700">{event.message}</p>
                                    <p className="mt-0.5 text-xs text-gray-400">{event.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Modals
// ============================================================================

function GalleryModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 mx-4 max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Media Gallery</h2>
                        <p className="text-sm text-gray-500">{GALLERY_PHOTOS.length} photos</p>
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
                            <div key={index} className="aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200 transition-all hover:ring-2 hover:ring-brand-500">
                                <img src={photo} alt={`Photo ${index + 1}`} className="size-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SubmitModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex size-12 items-center justify-center rounded-full bg-brand-100">
                    <Send className="size-6 text-brand-600" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">Submit Inspection Report?</h2>
                <p className="mt-2 text-sm text-gray-500">
                    Your inspection report will be submitted for review.
                </p>
                <div className="mt-4 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm text-gray-600">
                        This report will be sent to your manager for final approval.
                    </p>
                </div>
                <div className="mt-6 flex gap-3">
                    <Button color="secondary" size="md" className="flex-1" onClick={onClose}>Go Back</Button>
                    <Button color="primary" size="md" className="flex-1" onClick={onSubmit}>Submit for Approval</Button>
                </div>
            </div>
        </div>
    );
}

function ApproveModal({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: () => void; onConfirm: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="size-6 text-green-600" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">Approve Inspection</h2>
                <p className="mt-2 text-sm text-gray-500">
                    Are you sure you want to approve this inspection? This will finalize the report.
                </p>
                <div className="mt-6 flex gap-3">
                    <Button color="secondary" size="md" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button color="primary" size="md" className="flex-1" onClick={onConfirm}>Approve</Button>
                </div>
            </div>
        </div>
    );
}

function RequestChangesModal({ isOpen, onClose, onSubmit }: { isOpen: boolean; onClose: () => void; onSubmit: (msg: string) => void }) {
    const [message, setMessage] = useState("");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex size-12 items-center justify-center rounded-full bg-amber-100">
                    <RotateCcw className="size-6 text-amber-600" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-900">Request Changes</h2>
                <p className="mt-2 text-sm text-gray-500">What needs to be fixed before approval?</p>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g., Missing photo of bathroom..."
                    className="mt-4 h-32 w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
                <div className="mt-6 flex gap-3">
                    <Button color="secondary" size="md" className="flex-1" onClick={onClose}>Cancel</Button>
                    <Button color="primary" size="md" className="flex-1" onClick={() => { onSubmit(message); setMessage(""); }}>Send Request</Button>
                </div>
            </div>
        </div>
    );
}

// ============================================================================
// Main Page Component
// ============================================================================

export default function InspectionDetailPage({ params }: { params: Promise<{ id: string }> }) {
    // =========================================================================
    // 1. ASYNC PARAMS (Next.js 15)
    // =========================================================================
    const { id } = use(params);

    // =========================================================================
    // 2. HOOKS & STATE
    // =========================================================================
    const { isAdmin, isInspector } = useUserRole();
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
    const [isRequestChangesModalOpen, setIsRequestChangesModalOpen] = useState(false);
    const [formData, setFormData] = useState<Record<string, string>>({});

    // =========================================================================
    // 3. DATA FETCHING
    // =========================================================================
    const inspection = getInspectionById(id);

    // =========================================================================
    // 4. 404 HANDLING
    // =========================================================================
    if (!inspection) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center p-8">
                    <div className="text-6xl font-bold text-gray-200 mb-4">404</div>
                    <h1 className="text-xl font-semibold text-gray-900 mb-2">Inspection Not Found</h1>
                    <p className="text-gray-500 mb-6">
                        Could not find inspection with ID: <code className="bg-gray-100 px-2 py-1 rounded text-sm">{id}</code>
                    </p>
                    <Link href="/inspections" className="text-brand-600 hover:underline">
                        ← Back to Inspections
                    </Link>
                </div>
            </div>
        );
    }

    // =========================================================================
    // 5. DERIVED VALUES - THE WORKFLOW SWITCH
    // =========================================================================
    const isOrigination = inspection.workflow === "ORIGINATION_MF";
    const isServicing = inspection.workflow === "SERVICING_MBA";
    const isUrgent = inspection.priority === "Urgent";
    // Allow editing when status is "In Progress" (for both roles during development)
    const canEdit = inspection.status === "In Progress";
    const canReview = inspection.status === "Pending Review" && isAdmin;

    // =========================================================================
    // 6. EVENT HANDLERS
    // =========================================================================
    const handleSubmit = () => {
        console.log("Submitting inspection...", { id, formData });
        setIsSubmitModalOpen(false);
    };

    const handleApprove = () => {
        console.log("Approving inspection...", { id });
        setIsApproveModalOpen(false);
    };

    const handleRequestChanges = (message: string) => {
        console.log("Requesting changes:", { id, message });
        setIsRequestChangesModalOpen(false);
    };

    // =========================================================================
    // 7. RENDER
    // =========================================================================
    return (
        <div className="min-h-screen bg-gray-50">
            {/* ================================================================
                SHARED HEADER - Same for both workflows
            ================================================================ */}
            <div className="border-b border-gray-200 bg-white">
                <div className="px-6 lg:px-8 py-6">
                    {/* Breadcrumb */}
                    <Breadcrumbs />

                    {/* Title Row */}
                    <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            {/* Workflow Badge - Prominent for Origination */}
                            {isOrigination && (
                                <div className="mb-2 flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-purple-100 px-2.5 py-1 text-sm font-semibold text-purple-700">
                                        <FileText className="size-4" />
                                        Origination Inspection
                                    </span>
                                    {inspection.loanNumber && (
                                        <span className="inline-flex items-center gap-1.5 rounded-md bg-gray-100 px-2.5 py-1 text-sm font-medium text-gray-700">
                                            <Hash className="size-3.5" />
                                            {inspection.loanNumber}
                                        </span>
                                    )}
                                </div>
                            )}

                            {/* Address + Status */}
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {inspection.property?.address || `Inspection ${id}`}
                                </h1>
                                <StatusBadge status={inspection.status} />
                                {isUrgent && <UrgencyBadge />}
                            </div>

                            {/* Location */}
                            <p className="mt-1 text-gray-500">
                                {inspection.property?.city}, {inspection.property?.state} {inspection.property?.zip}
                            </p>

                            {/* Workflow Badge - Subtle for Servicing */}
                            {isServicing && (
                                <div className="mt-2">
                                    <WorkflowBadge workflow={inspection.workflow} loanNumber={inspection.loanNumber} />
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                            {isInspector && inspection.status === "In Progress" && (
                                <>
                                    <Button color="secondary" size="md" iconLeading={Save}>Save Draft</Button>
                                    <Button color="primary" size="md" iconLeading={Send} onClick={() => setIsSubmitModalOpen(true)}>
                                        Submit Report
                                    </Button>
                                </>
                            )}
                            {isAdmin && inspection.status === "Pending Review" && (
                                <>
                                    <Button color="secondary" size="md" iconLeading={Printer}>Print Report</Button>
                                    <Button color="secondary" size="md" iconLeading={RotateCcw} onClick={() => setIsRequestChangesModalOpen(true)}>
                                        Request Changes
                                    </Button>
                                    <Button color="primary" size="md" iconLeading={CheckCircle2} onClick={() => setIsApproveModalOpen(true)}>
                                        Approve
                                    </Button>
                                </>
                            )}
                            {isAdmin && inspection.status !== "Pending Review" && (
                                <Button color="secondary" size="md" iconLeading={Printer}>Print Report</Button>
                            )}
                        </div>
                    </div>

                    {/* Meta Row */}
                    <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
                        <Badge color="brand" size="sm">{inspection.type}</Badge>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">
                            {new Date(inspection.scheduledDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric"
                            })}
                        </span>
                        <span className="text-gray-300">•</span>
                        <span className="text-gray-500">{inspection.scheduledTime}</span>
                    </div>
                </div>
            </div>

            {/* ================================================================
                MAIN CONTENT - 2-Column Layout
            ================================================================ */}
            <div className="px-6 lg:px-8 py-8">
                <div className="mx-auto max-w-7xl">
                    {/* Pending Review Banner (Admin only) */}
                    {isAdmin && inspection.status === "Pending Review" && (
                        <div className="mb-8 rounded-lg border border-amber-200 bg-amber-50 p-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-600" />
                                <div>
                                    <p className="text-sm font-medium text-amber-800">Approval Requested</p>
                                    <p className="mt-1 text-sm text-amber-700">
                                        {inspection.inspector?.fullName || "Inspector"} submitted this inspection for review.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-8 lg:grid-cols-3">
                        {/* ============================================
                            LEFT COLUMN - Main Content (2/3 width)
                            THE DUAL WORKFLOW SWITCH
                        ============================================ */}
                        <div className="lg:col-span-2">
                            {isOrigination ? (
                                // =============================================
                                // PATH A: ORIGINATION_MF → Questionnaire Form
                                // =============================================
                                <QuestionnaireView
                                    inspectionId={id}
                                    initialData={formData}
                                    onDataChange={setFormData}
                                />
                            ) : (
                                // =============================================
                                // PATH B: SERVICING_MBA → Pass/Fail Checklist
                                // =============================================
                                <InspectionChecklist
                                    inspection={inspection}
                                    isEditable={canEdit}
                                />
                            )}
                        </div>

                        {/* ============================================
                            RIGHT COLUMN - Shared Sidebar (1/3 width)
                        ============================================ */}
                        <div className="space-y-6">
                            {/* Property Hero Image */}
                            <PropertyCard inspection={inspection} onOpenGallery={() => setIsGalleryOpen(true)} />

                            {/* Access Info (Highlighted in Yellow/Amber for Inspector) */}
                            <AccessCard inspection={inspection} isInspector={isInspector} />

                            {/* Map Placeholder */}
                            <LocationCard inspection={inspection} />

                            {/* Inspector Card (Admin view only) */}
                            {isAdmin && <InspectorCard inspection={inspection} />}

                            {/* Activity Timeline */}
                            <TimelineCard />
                        </div>
                    </div>
                </div>
            </div>

            {/* ================================================================
                MODALS
            ================================================================ */}
            <GalleryModal isOpen={isGalleryOpen} onClose={() => setIsGalleryOpen(false)} />
            <SubmitModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} onSubmit={handleSubmit} />
            <ApproveModal isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)} onConfirm={handleApprove} />
            <RequestChangesModal isOpen={isRequestChangesModalOpen} onClose={() => setIsRequestChangesModalOpen(false)} onSubmit={handleRequestChanges} />
        </div>
    );
}
