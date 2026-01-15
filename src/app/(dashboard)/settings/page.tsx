"use client";

import { useState } from "react";
import {
    Building,
    Calendar,
    CheckSquare,
    ChevronDown,
    Clock,
    CreditCard,
    Database,
    Download,
    FileText,
    Globe,
    HardDrive,
    Mail,
    MoreHorizontal,
    Plus,
    Shield,
    Trash2,
    Upload,
    User,
    UserPlus,
    Users,
    X,
} from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { TimePicker } from "@/components/ui/time-picker";
import { useUserRole } from "@/contexts/user-role-context";
import { cx } from "@/utils/cx";

// ============================================================================
// Types
// ============================================================================

type AdminTabId = "profile" | "company" | "team" | "templates" | "billing";
type InspectorTabId = "profile" | "availability" | "security";
type TabId = AdminTabId | InspectorTabId;

interface TeamMember {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: "Admin" | "Inspector" | "Viewer";
    status: "Active" | "Pending";
    lastActive?: string;
}

interface ChecklistTemplate {
    id: string;
    name: string;
    itemCount: number;
    lastModified: string;
}

interface ChecklistItem {
    id: string;
    name: string;
}

interface LibraryTemplate {
    id: string;
    name: string;
    description: string;
    itemCount: number;
}

// ============================================================================
// Mock Data
// ============================================================================

const TEAM_MEMBERS: TeamMember[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@coreverus.com",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face",
        role: "Admin",
        status: "Active",
        lastActive: "2 hours ago",
    },
    {
        id: "2",
        name: "Sarah Miller",
        email: "sarah.miller@coreverus.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&face",
        role: "Inspector",
        status: "Active",
        lastActive: "5 minutes ago",
    },
    {
        id: "3",
        name: "Mike Johnson",
        email: "mike.j@coreverus.com",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face",
        role: "Inspector",
        status: "Active",
        lastActive: "1 day ago",
    },
    {
        id: "4",
        name: "Emily Chen",
        email: "emily.chen@coreverus.com",
        role: "Inspector",
        status: "Pending",
    },
    {
        id: "5",
        name: "David Kim",
        email: "david.kim@coreverus.com",
        role: "Viewer",
        status: "Active",
        lastActive: "3 days ago",
    },
];

const CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
    { id: "1", name: "Move-In Inspection", itemCount: 45, lastModified: "Jan 10, 2026" },
    { id: "2", name: "Move-Out Inspection", itemCount: 52, lastModified: "Jan 8, 2026" },
    { id: "3", name: "Annual Inspection", itemCount: 38, lastModified: "Dec 15, 2025" },
];

const MOCK_CHECKLIST_ITEMS: ChecklistItem[] = [
    { id: "1", name: "Kitchen Sink - Check for leaks" },
    { id: "2", name: "HVAC Filter - Inspect condition" },
    { id: "3", name: "Smoke Detectors - Test functionality" },
    { id: "4", name: "Windows - Check seals and locks" },
    { id: "5", name: "Doors - Verify proper operation" },
];

const LIBRARY_TEMPLATES: LibraryTemplate[] = [
    { id: "1", name: "Standard Residential", description: "Complete home inspection checklist", itemCount: 85 },
    { id: "2", name: "Commercial Safety", description: "Business safety compliance checklist", itemCount: 62 },
    { id: "3", name: "HUD Section 8", description: "HUD-compliant housing inspection", itemCount: 94 },
];

const DAYS_OF_WEEK = [
    { id: "mon", label: "Monday", short: "Mon" },
    { id: "tue", label: "Tuesday", short: "Tue" },
    { id: "wed", label: "Wednesday", short: "Wed" },
    { id: "thu", label: "Thursday", short: "Thu" },
    { id: "fri", label: "Friday", short: "Fri" },
    { id: "sat", label: "Saturday", short: "Sat" },
    { id: "sun", label: "Sunday", short: "Sun" },
];

// ============================================================================
// Modal Components
// ============================================================================

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, description, children }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] bg-black/50" onClick={onClose} />
            <div className="fixed top-1/2 left-1/2 z-[100] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b border-secondary p-5">
                    <div>
                        <h2 className="text-lg font-semibold text-primary">{title}</h2>
                        {description && <p className="mt-1 text-sm text-tertiary">{description}</p>}
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <div className="p-5">{children}</div>
            </div>
        </>
    );
};

// Invite Member Modal
interface InviteMemberModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const InviteMemberModal = ({ isOpen, onClose }: InviteMemberModalProps) => {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<"Admin" | "Inspector" | "Viewer">("Inspector");
    const [isRoleOpen, setIsRoleOpen] = useState(false);

    const handleSubmit = () => {
        console.log("Invite sent:", { email, role });
        onClose();
        setEmail("");
        setRole("Inspector");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Invite Team Member" description="Send an invitation to join your team.">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Email Address</label>
                    <Input
                        placeholder="colleague@company.com"
                        icon={Mail}
                        value={email}
                        onChange={(v) => setEmail(v.toString())}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Role</label>
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsRoleOpen(!isRoleOpen)}
                            className="flex w-full items-center justify-between rounded-lg bg-white px-3 py-2.5 text-left shadow-xs ring-1 ring-gray-300 transition-all hover:ring-gray-400"
                        >
                            <span className="text-primary">{role}</span>
                            <ChevronDown className={cx("size-5 text-gray-400 transition-transform", isRoleOpen && "rotate-180")} />
                        </button>
                        {isRoleOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsRoleOpen(false)} />
                                <div className="absolute top-full left-0 z-20 mt-1 w-full rounded-lg border border-secondary bg-white py-1 shadow-lg">
                                    {(["Admin", "Inspector", "Viewer"] as const).map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => {
                                                setRole(r);
                                                setIsRoleOpen(false);
                                            }}
                                            className={cx(
                                                "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50",
                                                role === r ? "bg-gray-50 font-medium text-primary" : "text-secondary"
                                            )}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button color="tertiary" size="md" onClick={onClose}>Cancel</Button>
                    <Button color="primary" size="md" onClick={handleSubmit} isDisabled={!email}>
                        Send Invitation
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

// New Template Modal
interface NewTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const NewTemplateModal = ({ isOpen, onClose }: NewTemplateModalProps) => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [startType, setStartType] = useState<"scratch" | "import">("scratch");

    const handleCreate = () => {
        console.log("Template created:", { name, description, startType });
        onClose();
        setName("");
        setDescription("");
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Create New Template" description="Start a new inspection checklist.">
            <div className="space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Template Name</label>
                    <Input
                        placeholder="e.g., Pre-Lease Inspection"
                        value={name}
                        onChange={(v) => setName(v.toString())}
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Description</label>
                    <textarea
                        placeholder="Brief description of this template..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={2}
                        className="w-full rounded-lg bg-white px-3 py-2.5 text-md text-primary shadow-xs ring-1 ring-gray-300 transition-all placeholder:text-gray-400 hover:ring-gray-400 focus:ring-2 focus:ring-brand focus:outline-none"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-secondary">Start From</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setStartType("scratch")}
                            className={cx(
                                "rounded-lg border-2 p-4 text-left transition-all",
                                startType === "scratch"
                                    ? "border-brand-500 bg-brand-50"
                                    : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <Plus className={cx("size-5", startType === "scratch" ? "text-brand-600" : "text-gray-400")} />
                            <p className={cx("mt-2 text-sm font-medium", startType === "scratch" ? "text-brand-700" : "text-primary")}>
                                Start from Scratch
                            </p>
                            <p className="text-xs text-tertiary">Create a blank template</p>
                        </button>
                        <button
                            onClick={() => setStartType("import")}
                            className={cx(
                                "rounded-lg border-2 p-4 text-left transition-all",
                                startType === "import"
                                    ? "border-brand-500 bg-brand-50"
                                    : "border-gray-200 hover:border-gray-300"
                            )}
                        >
                            <Download className={cx("size-5", startType === "import" ? "text-brand-600" : "text-gray-400")} />
                            <p className={cx("mt-2 text-sm font-medium", startType === "import" ? "text-brand-700" : "text-primary")}>
                                Import from Library
                            </p>
                            <p className="text-xs text-tertiary">Use an existing template</p>
                        </button>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button color="tertiary" size="md" onClick={onClose}>Cancel</Button>
                    <Button color="primary" size="md" onClick={handleCreate} isDisabled={!name}>
                        Create Template
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

// Edit Checklist Modal
interface EditChecklistModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateName: string;
}

const EditChecklistModal = ({ isOpen, onClose, templateName }: EditChecklistModalProps) => {
    const [items, setItems] = useState<ChecklistItem[]>(MOCK_CHECKLIST_ITEMS);
    const [newItem, setNewItem] = useState("");

    const handleAddItem = () => {
        if (newItem.trim()) {
            setItems([...items, { id: String(Date.now()), name: newItem }]);
            setNewItem("");
        }
    };

    const handleRemoveItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Edit: ${templateName}`} description="Manage checklist items.">
            <div className="space-y-4">
                {/* Add New Item */}
                <div className="flex gap-2">
                    <Input
                        placeholder="Add new item..."
                        value={newItem}
                        onChange={(v) => setNewItem(v.toString())}
                        className="flex-1"
                    />
                    <Button color="secondary" size="md" onClick={handleAddItem}>
                        Add
                    </Button>
                </div>

                {/* Items List */}
                <div className="max-h-64 space-y-2 overflow-y-auto">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                        >
                            <div className="flex items-center gap-3">
                                <CheckSquare className="size-4 text-gray-400" />
                                <span className="text-sm text-primary">{item.name}</span>
                            </div>
                            <button
                                onClick={() => handleRemoveItem(item.id)}
                                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-red-500"
                            >
                                <Trash2 className="size-4" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button color="tertiary" size="md" onClick={onClose}>Cancel</Button>
                    <Button color="primary" size="md" onClick={onClose}>
                        Save Changes
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

// Template Library Modal
interface TemplateLibraryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const TemplateLibraryModal = ({ isOpen, onClose }: TemplateLibraryModalProps) => {
    const handleImport = (templateId: string) => {
        console.log("Importing template:", templateId);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Template Library" description="Browse industry-standard inspection templates.">
            <div className="space-y-3">
                {LIBRARY_TEMPLATES.map((template) => (
                    <div
                        key={template.id}
                        className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50"
                    >
                        <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50">
                                <FileText className="size-5 text-brand-600" />
                            </div>
                            <div>
                                <p className="font-medium text-primary">{template.name}</p>
                                <p className="text-sm text-tertiary">
                                    {template.description} • {template.itemCount} items
                                </p>
                            </div>
                        </div>
                        <Button color="secondary" size="sm" onClick={() => handleImport(template.id)}>
                            Import
                        </Button>
                    </div>
                ))}
            </div>
        </Modal>
    );
};

// ============================================================================
// Tab Components - Shared
// ============================================================================

const ProfileTab = () => (
    <div className="space-y-6">
        <div>
            <h2 className="text-lg font-semibold text-primary">Profile Settings</h2>
            <p className="text-sm text-tertiary">Manage your personal information and preferences.</p>
        </div>

        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <div className="flex items-start gap-6">
                <Avatar
                    size="xl"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&face"
                    alt="Profile"
                />
                <div className="flex-1 space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-secondary">First Name</label>
                            <Input placeholder="John" value="John" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium text-secondary">Last Name</label>
                            <Input placeholder="Doe" value="Doe" />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-secondary">Email Address</label>
                        <Input placeholder="email@example.com" value="john.doe@coreverus.com" icon={Mail} />
                    </div>
                </div>
            </div>
        </div>

        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h3 className="text-md font-semibold text-primary">Notifications</h3>
            <p className="mt-1 text-sm text-tertiary">Configure how you receive notifications.</p>

            <div className="mt-4 space-y-3">
                {[
                    { label: "Email notifications", desc: "Receive updates via email" },
                    { label: "Push notifications", desc: "Browser push notifications" },
                    { label: "Inspection reminders", desc: "Reminder before scheduled inspections" },
                ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2">
                        <div>
                            <p className="text-sm font-medium text-secondary">{item.label}</p>
                            <p className="text-sm text-tertiary">{item.desc}</p>
                        </div>
                        <button className="relative h-6 w-11 rounded-full bg-brand-600 transition-colors">
                            <span className="absolute top-1 right-1 size-4 rounded-full bg-white shadow-sm transition-transform" />
                        </button>
                    </div>
                ))}
            </div>
        </div>

        <div className="flex justify-end gap-3">
            <Button color="secondary" size="md">Cancel</Button>
            <Button color="primary" size="md">Save Changes</Button>
        </div>
    </div>
);

// ============================================================================
// Tab Components - Admin Only
// ============================================================================

const CompanyTab = () => (
    <div className="space-y-6">
        <div>
            <h2 className="text-lg font-semibold text-primary">Company Settings</h2>
            <p className="text-sm text-tertiary">Manage your organization details and branding.</p>
        </div>

        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h3 className="text-md font-semibold text-primary">Organization Details</h3>
            <p className="mt-1 text-sm text-tertiary">This information appears on reports and invoices.</p>

            <div className="mt-4 space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Company Name</label>
                    <Input placeholder="Company name" value="Coreverus Property Management" icon={Building} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-secondary">Support Email</label>
                        <Input placeholder="support@company.com" value="support@coreverus.com" icon={Mail} />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-secondary">Website</label>
                        <Input placeholder="https://company.com" value="https://coreverus.com" icon={Globe} />
                    </div>
                </div>
            </div>
        </div>

        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h3 className="text-md font-semibold text-primary">Report Logo</h3>
            <p className="mt-1 text-sm text-tertiary">This logo will appear on all generated inspection reports.</p>

            <div className="mt-4">
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-10 transition-colors hover:border-brand-400 hover:bg-brand-50/50">
                    <div className="text-center">
                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-gray-100">
                            <Upload className="size-6 text-gray-400" />
                        </div>
                        <div className="mt-4">
                            <button className="font-medium text-brand-600 hover:text-brand-700">
                                Click to upload
                            </button>
                            <span className="text-tertiary"> or drag and drop</span>
                        </div>
                        <p className="mt-2 text-sm text-tertiary">PNG, JPG up to 2MB (Recommended: 400x100px)</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="flex justify-end gap-3">
            <Button color="secondary" size="md">Cancel</Button>
            <Button color="primary" size="md">Save Changes</Button>
        </div>
    </div>
);

const TemplatesTab = () => {
    const [isNewTemplateOpen, setIsNewTemplateOpen] = useState(false);
    const [isEditChecklistOpen, setIsEditChecklistOpen] = useState(false);
    const [isLibraryOpen, setIsLibraryOpen] = useState(false);
    const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);

    const handleEditClick = (template: ChecklistTemplate) => {
        setSelectedTemplate(template);
        setIsEditChecklistOpen(true);
    };

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-primary">Inspection Templates</h2>
                        <p className="text-sm text-tertiary">Manage your inspection checklists and templates.</p>
                    </div>
                    <Button color="primary" size="md" iconLeading={FileText} onClick={() => setIsNewTemplateOpen(true)}>
                        New Template
                    </Button>
                </div>

                <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
                    <div className="divide-y divide-secondary">
                        {CHECKLIST_TEMPLATES.map((template) => (
                            <div key={template.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <div className="flex size-10 items-center justify-center rounded-lg bg-brand-50">
                                        <CheckSquare className="size-5 text-brand-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-primary">{template.name}</p>
                                        <p className="text-sm text-tertiary">
                                            {template.itemCount} items • Last modified {template.lastModified}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button color="tertiary" size="sm" onClick={() => handleEditClick(template)}>
                                        Edit Checklist
                                    </Button>
                                    <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
                                        <MoreHorizontal className="size-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-secondary">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-brand-100 p-2">
                            <FileText className="size-5 text-brand-600" />
                        </div>
                        <div>
                            <p className="font-medium text-secondary">Template Library</p>
                            <p className="text-sm text-tertiary">
                                Need more templates? Browse our library of industry-standard inspection checklists.
                            </p>
                            <button
                                onClick={() => setIsLibraryOpen(true)}
                                className="mt-2 text-sm font-medium text-brand-600 hover:text-brand-700"
                            >
                                Browse Library →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modals */}
            <NewTemplateModal isOpen={isNewTemplateOpen} onClose={() => setIsNewTemplateOpen(false)} />
            <EditChecklistModal
                isOpen={isEditChecklistOpen}
                onClose={() => setIsEditChecklistOpen(false)}
                templateName={selectedTemplate?.name || ""}
            />
            <TemplateLibraryModal isOpen={isLibraryOpen} onClose={() => setIsLibraryOpen(false)} />
        </>
    );
};

const TeamTab = () => {
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-primary">Team Members</h2>
                        <p className="text-sm text-tertiary">Manage your team and their permissions.</p>
                    </div>
                    <Button color="primary" size="md" iconLeading={UserPlus} onClick={() => setIsInviteOpen(true)}>
                        Invite Member
                    </Button>
                </div>

                <div className="rounded-xl bg-primary shadow-xs ring-1 ring-secondary">
                    <div className="divide-y divide-secondary">
                        {TEAM_MEMBERS.map((member) => (
                            <div key={member.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        size="md"
                                        src={member.avatar}
                                        alt={member.name}
                                        initials={member.name.split(" ").map((n) => n[0]).join("")}
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-primary">{member.name}</p>
                                            {member.status === "Pending" && (
                                                <Badge color="orange" size="sm">Pending</Badge>
                                            )}
                                        </div>
                                        <p className="text-sm text-tertiary">{member.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="hidden text-right sm:block">
                                        {member.status === "Active" && member.lastActive ? (
                                            <p className="text-sm text-tertiary">
                                                <Clock className="mr-1 inline size-3" />
                                                {member.lastActive}
                                            </p>
                                        ) : member.status === "Pending" ? (
                                            <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
                                                Resend Invite
                                            </button>
                                        ) : null}
                                    </div>

                                    <Badge
                                        color={member.role === "Admin" ? "brand" : member.role === "Inspector" ? "blue" : "gray"}
                                        size="sm"
                                    >
                                        {member.role === "Admin" && <Shield className="mr-1 size-3" />}
                                        {member.role}
                                    </Badge>
                                    <button className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-50 hover:text-gray-600">
                                        <MoreHorizontal className="size-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl bg-gray-50 p-4 ring-1 ring-secondary">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-brand-100 p-2">
                            <Users className="size-5 text-brand-600" />
                        </div>
                        <div>
                            <p className="font-medium text-secondary">Team Plan</p>
                            <p className="text-sm text-tertiary">
                                You have {TEAM_MEMBERS.length} of 10 team members. Upgrade for unlimited members.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <InviteMemberModal isOpen={isInviteOpen} onClose={() => setIsInviteOpen(false)} />
        </>
    );
};

const BillingTab = () => (
    <div className="space-y-6">
        <div>
            <h2 className="text-lg font-semibold text-primary">Billing & Plans</h2>
            <p className="text-sm text-tertiary">Manage your subscription and payment methods.</p>
        </div>

        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-md font-semibold text-primary">Professional Plan</h3>
                        <Badge color="brand" size="sm">Current</Badge>
                    </div>
                    <p className="mt-1 text-sm text-tertiary">$49/month • Renews Feb 14, 2026</p>
                </div>
                <Button color="secondary" size="sm">Change Plan</Button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                    { label: "Inspections", value: "Unlimited" },
                    { label: "Team Members", value: "10" },
                    { label: "Storage", value: "50 GB" },
                ].map((item) => (
                    <div key={item.label} className="rounded-lg bg-gray-50 p-3">
                        <p className="text-sm text-tertiary">{item.label}</p>
                        <p className="text-lg font-semibold text-primary">{item.value}</p>
                    </div>
                ))}
            </div>
        </div>

        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h3 className="text-md font-semibold text-primary">Payment Method</h3>
            <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-4 ring-1 ring-secondary">
                <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-gray-900">
                        <CreditCard className="size-5 text-white" />
                    </div>
                    <div>
                        <p className="font-medium text-primary">•••• •••• •••• 4242</p>
                        <p className="text-sm text-tertiary">Expires 12/2027</p>
                    </div>
                </div>
                <Button color="tertiary" size="sm">Update</Button>
            </div>
        </div>

        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h3 className="text-md font-semibold text-primary">Billing History</h3>
            <div className="mt-4 space-y-2">
                {[
                    { date: "Jan 14, 2026", amount: "$49.00", status: "Paid" },
                    { date: "Dec 14, 2025", amount: "$49.00", status: "Paid" },
                    { date: "Nov 14, 2025", amount: "$49.00", status: "Paid" },
                ].map((invoice, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-tertiary">{invoice.date}</span>
                            <span className="font-medium text-primary">{invoice.amount}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge color="success" size="sm">{invoice.status}</Badge>
                            <button className="text-sm font-medium text-brand-600 hover:text-brand-700">
                                Download
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ============================================================================
// Tab Components - Inspector Only
// ============================================================================

const AvailabilityTab = () => {
    const [selectedDays, setSelectedDays] = useState<string[]>(["mon", "tue", "wed", "thu", "fri"]);
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("17:00");

    const toggleDay = (dayId: string) => {
        setSelectedDays((prev) =>
            prev.includes(dayId) ? prev.filter((d) => d !== dayId) : [...prev, dayId]
        );
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-lg font-semibold text-primary">Availability</h2>
                <p className="text-sm text-tertiary">Set your working days and hours for scheduling.</p>
            </div>

            <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
                <h3 className="text-md font-semibold text-primary">Working Days</h3>
                <p className="mt-1 text-sm text-tertiary">Select the days you're available for inspections.</p>

                <div className="mt-4 flex flex-wrap gap-2">
                    {DAYS_OF_WEEK.map((day) => {
                        const isSelected = selectedDays.includes(day.id);
                        return (
                            <button
                                key={day.id}
                                onClick={() => toggleDay(day.id)}
                                className={cx(
                                    "flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ring-1",
                                    isSelected
                                        ? "bg-brand-50 text-brand-700 ring-brand-200"
                                        : "bg-white text-tertiary ring-gray-200 hover:bg-gray-50"
                                )}
                            >
                                <div
                                    className={cx(
                                        "flex size-5 items-center justify-center rounded border-2 transition-colors",
                                        isSelected
                                            ? "border-brand-600 bg-brand-600"
                                            : "border-gray-300 bg-white"
                                    )}
                                >
                                    {isSelected && (
                                        <svg className="size-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                {day.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
                <h3 className="text-md font-semibold text-primary">Working Hours</h3>
                <p className="mt-1 text-sm text-tertiary">Set your typical work hours.</p>

                <div className="mt-4 flex items-center gap-4">
                    <div className="w-40 space-y-1.5">
                        <label className="text-sm font-medium text-secondary">Start Time</label>
                        <TimePicker
                            value={startTime}
                            onChange={(time) => setStartTime(time)}
                            placeholder="Start time"
                        />
                    </div>
                    <span className="mt-6 text-tertiary">to</span>
                    <div className="w-40 space-y-1.5">
                        <label className="text-sm font-medium text-secondary">End Time</label>
                        <TimePicker
                            value={endTime}
                            onChange={(time) => setEndTime(time)}
                            placeholder="End time"
                        />
                    </div>
                </div>
            </div>

            {/* Offline Data Section for Inspector */}
            <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                        <div className="rounded-lg bg-gray-100 p-2">
                            <HardDrive className="size-5 text-gray-600" />
                        </div>
                        <div>
                            <h3 className="text-md font-semibold text-primary">Offline Data</h3>
                            <p className="mt-1 text-sm text-tertiary">
                                Cached inspection data for offline access.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-50 p-4 ring-1 ring-secondary">
                    <div className="flex items-center gap-3">
                        <Database className="size-5 text-gray-500" />
                        <div>
                            <p className="font-medium text-primary">Local Storage Used</p>
                            <p className="text-sm text-tertiary">145 MB of cached data</p>
                        </div>
                    </div>
                    <Button color="tertiary" size="sm" iconLeading={Trash2}>
                        Clear Cache
                    </Button>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <Button color="secondary" size="md">Cancel</Button>
                <Button color="primary" size="md">Save Changes</Button>
            </div>
        </div>
    );
};

const SecurityTab = () => (
    <div className="space-y-6">
        <div>
            <h2 className="text-lg font-semibold text-primary">Security</h2>
            <p className="text-sm text-tertiary">Manage your account security and authentication.</p>
        </div>

        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h3 className="text-md font-semibold text-primary">Password</h3>
            <p className="mt-1 text-sm text-tertiary">Change your password to keep your account secure.</p>

            <div className="mt-4 space-y-4">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-secondary">Current Password</label>
                    <Input type="password" placeholder="Enter current password" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-secondary">New Password</label>
                        <Input type="password" placeholder="Enter new password" />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium text-secondary">Confirm Password</label>
                        <Input type="password" placeholder="Confirm new password" />
                    </div>
                </div>
            </div>

            <div className="mt-4">
                <Button color="secondary" size="sm">Update Password</Button>
            </div>
        </div>

        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-md font-semibold text-primary">Two-Factor Authentication</h3>
                    <p className="mt-1 text-sm text-tertiary">Add an extra layer of security to your account.</p>
                </div>
                <Badge color="gray" size="sm">Not Enabled</Badge>
            </div>

            <div className="mt-4">
                <Button color="primary" size="sm" iconLeading={Shield}>
                    Enable 2FA
                </Button>
            </div>
        </div>

        <div className="rounded-xl bg-primary p-6 shadow-xs ring-1 ring-secondary">
            <h3 className="text-md font-semibold text-primary">Active Sessions</h3>
            <p className="mt-1 text-sm text-tertiary">Manage devices where you're currently logged in.</p>

            <div className="mt-4 space-y-3">
                {[
                    { device: "MacBook Pro - Chrome", location: "Chicago, IL", current: true },
                    { device: "iPhone 15 Pro - Safari", location: "Chicago, IL", current: false },
                ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 p-3 ring-1 ring-secondary">
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-medium text-primary">{session.device}</p>
                                {session.current && <Badge color="success" size="sm">Current</Badge>}
                            </div>
                            <p className="text-sm text-tertiary">{session.location}</p>
                        </div>
                        {!session.current && (
                            <button className="text-sm font-medium text-red-600 hover:text-red-700">
                                Revoke
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// ============================================================================
// Tab Configuration
// ============================================================================

const ADMIN_TABS = [
    { id: "profile" as TabId, label: "Profile", icon: User },
    { id: "company" as TabId, label: "Company", icon: Building },
    { id: "team" as TabId, label: "Team", icon: Users },
    { id: "templates" as TabId, label: "Templates", icon: FileText },
    { id: "billing" as TabId, label: "Billing", icon: CreditCard },
];

const INSPECTOR_TABS = [
    { id: "profile" as TabId, label: "Profile", icon: User },
    { id: "availability" as TabId, label: "Availability", icon: Calendar },
    { id: "security" as TabId, label: "Security", icon: Shield },
];

// ============================================================================
// Page Component
// ============================================================================

export default function SettingsPage() {
    const { isAdmin } = useUserRole();
    const [activeTab, setActiveTab] = useState<TabId>("profile");

    const tabs = isAdmin ? ADMIN_TABS : INSPECTOR_TABS;

    // Reset to profile if current tab isn't available for role
    const availableTabIds = tabs.map((t) => t.id);
    const currentTab = availableTabIds.includes(activeTab) ? activeTab : "profile";

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6">
                <h1 className="text-display-sm font-semibold text-primary">Settings</h1>
                <p className="mt-1 text-sm text-tertiary">
                    {isAdmin ? "Manage your account and organization settings." : "Manage your account settings."}
                </p>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Sidebar Tabs */}
                <div className="w-full shrink-0 lg:w-56">
                    <nav className="space-y-1">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = currentTab === tab.id;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cx(
                                        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-gray-50 text-brand-600"
                                            : "text-tertiary hover:bg-gray-50 hover:text-secondary"
                                    )}
                                >
                                    <Icon className={cx("size-5", isActive ? "text-brand-600" : "text-gray-400")} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {currentTab === "profile" && <ProfileTab />}
                    {currentTab === "company" && isAdmin && <CompanyTab />}
                    {currentTab === "team" && isAdmin && <TeamTab />}
                    {currentTab === "templates" && isAdmin && <TemplatesTab />}
                    {currentTab === "billing" && isAdmin && <BillingTab />}
                    {currentTab === "availability" && !isAdmin && <AvailabilityTab />}
                    {currentTab === "security" && !isAdmin && <SecurityTab />}
                </div>
            </div>
        </div>
    );
}
