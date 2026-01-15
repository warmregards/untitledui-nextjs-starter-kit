"use client";

import { useState, type ReactNode } from "react";
import {
    Building,
    ChevronDown,
    CloudCheck,
    FileText,
    Home,
    Menu,
    Settings,
    Shield,
    Sun,
    User,
    X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Button as AriaButton,
    Dialog as AriaDialog,
    DialogTrigger as AriaDialogTrigger,
    Modal as AriaModal,
    ModalOverlay as AriaModalOverlay,
} from "react-aria-components";
import { Avatar } from "@/components/base/avatar/avatar";
import { useUserRole, type UserRole } from "@/contexts/user-role-context";
import { cx } from "@/utils/cx";

// ============================================================================
// Configuration
// ============================================================================

const NAV_ITEMS = [
    { label: "Dashboard", href: "/dashboard", icon: Home },
    { label: "Inspections", href: "/inspections", icon: FileText },
    { label: "Properties", href: "/properties", icon: Building },
    { label: "Settings", href: "/settings", icon: Settings },
] as const;

const ROLE_CONFIG: Record<UserRole, { label: string; description: string }> = {
    admin: { label: "Admin", description: "Full access" },
    inspector: { label: "Inspector", description: "Field view only" },
};

// ============================================================================
// Components
// ============================================================================

interface NavItemProps {
    label: string;
    href: string;
    icon: typeof Home;
    isActive: boolean;
}

const NavItem = ({ label, href, icon: Icon, isActive }: NavItemProps) => (
    <Link
        href={href}
        className={cx(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            isActive
                ? "bg-gray-50 text-brand-600"
                : "text-tertiary hover:bg-gray-50 hover:text-secondary"
        )}
    >
        <Icon className="size-5" />
        {label}
    </Link>
);

interface RoleSwitcherProps {
    role: UserRole;
    onRoleChange: (role: UserRole) => void;
}

const RoleSwitcher = ({ role, onRoleChange }: RoleSwitcherProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const currentRole = ROLE_CONFIG[role];

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-secondary bg-gray-50 px-3 py-2 text-left transition-colors hover:bg-gray-100"
            >
                <div className="flex items-center gap-2">
                    <div className="flex size-6 items-center justify-center rounded bg-brand-100">
                        {role === "admin" ? (
                            <Shield className="size-3.5 text-brand-600" />
                        ) : (
                            <User className="size-3.5 text-brand-600" />
                        )}
                    </div>
                    <div>
                        <p className="text-xs font-medium text-secondary">Viewing as</p>
                        <p className="text-sm font-semibold text-primary">{currentRole.label}</p>
                    </div>
                </div>
                <ChevronDown
                    className={cx(
                        "size-4 text-gray-400 transition-transform",
                        isOpen && "rotate-180"
                    )}
                />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full left-0 z-20 mb-1 w-full rounded-lg border border-secondary bg-primary p-1 shadow-lg">
                        {(Object.keys(ROLE_CONFIG) as UserRole[]).map((roleKey) => {
                            const config = ROLE_CONFIG[roleKey];
                            const isSelected = role === roleKey;

                            return (
                                <button
                                    key={roleKey}
                                    onClick={() => {
                                        onRoleChange(roleKey);
                                        setIsOpen(false);
                                    }}
                                    className={cx(
                                        "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left transition-colors",
                                        isSelected
                                            ? "bg-brand-50 text-brand-700"
                                            : "hover:bg-gray-50"
                                    )}
                                >
                                    <div
                                        className={cx(
                                            "flex size-6 items-center justify-center rounded",
                                            isSelected ? "bg-brand-100" : "bg-gray-100"
                                        )}
                                    >
                                        {roleKey === "admin" ? (
                                            <Shield
                                                className={cx(
                                                    "size-3.5",
                                                    isSelected ? "text-brand-600" : "text-gray-500"
                                                )}
                                            />
                                        ) : (
                                            <User
                                                className={cx(
                                                    "size-3.5",
                                                    isSelected ? "text-brand-600" : "text-gray-500"
                                                )}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <p
                                            className={cx(
                                                "text-sm font-medium",
                                                isSelected ? "text-brand-700" : "text-primary"
                                            )}
                                        >
                                            {config.label}
                                        </p>
                                        <p className="text-xs text-tertiary">{config.description}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

const UserProfile = ({ role }: { role: UserRole }) => {
    const isInspector = role === "inspector";

    return (
        <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-gray-50">
            <Avatar
                size="sm"
                src={isInspector
                    ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face"
                    : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face"
                }
                alt={isInspector ? "Mike Johnson" : "John Doe"}
                initials={isInspector ? "MJ" : "JD"}
            />
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-primary">
                    {isInspector ? "Mike Johnson" : "John Doe"}
                </p>
                <p className="truncate text-xs text-tertiary">
                    {isInspector ? "mike@coreverus.com" : "john@coreverus.com"}
                </p>
            </div>
        </div>
    );
};

interface SidebarProps {
    pathname: string;
    role: UserRole;
    onRoleChange: (role: UserRole) => void;
}

const Sidebar = ({ pathname, role, onRoleChange }: SidebarProps) => (
    <aside className="flex h-full w-64 flex-col border-r border-secondary bg-white">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-secondary px-6">
            <span className="text-xl font-semibold text-primary">Coreverus</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
            {NAV_ITEMS.map((item) => (
                <NavItem
                    key={item.href}
                    {...item}
                    isActive={pathname.startsWith(item.href)}
                />
            ))}
        </nav>

        {/* Footer: Role Switcher + User */}
        <div className="space-y-3 border-t border-secondary p-4">
            <RoleSwitcher role={role} onRoleChange={onRoleChange} />
            <UserProfile role={role} />
        </div>
    </aside>
);

const SyncStatusWidget = () => (
    <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium transition-colors hover:bg-gray-50">
        <CloudCheck className="size-4 text-success-500" />
        <span className="text-success-600">Online • Synced</span>
    </button>
);

const WeatherWidget = () => (
    <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
        <Sun className="size-4 text-amber-500" />
        <span className="text-xs font-medium text-secondary">
            Chicago, IL • 32°F • Clear
        </span>
    </div>
);

const Header = ({ role }: { role: UserRole }) => {
    const isInspector = role === "inspector";

    return (
        <header className="flex h-16 items-center justify-between border-b border-secondary bg-white px-6">
            <div />
            <div className="flex items-center gap-3">
                {/* Status Widgets */}
                <SyncStatusWidget />
                <WeatherWidget />
                {/* Avatar */}
                <Avatar
                    size="sm"
                    src={isInspector
                        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face"
                        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face"
                    }
                    alt={isInspector ? "Mike Johnson" : "John Doe"}
                    initials={isInspector ? "MJ" : "JD"}
                />
            </div>
        </header>
    );
};

interface MobileSidebarProps {
    pathname: string;
    role: UserRole;
    onRoleChange: (role: UserRole) => void;
}

const MobileSidebar = ({ pathname, role, onRoleChange }: MobileSidebarProps) => (
    <AriaDialogTrigger>
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-secondary bg-white px-4 lg:hidden">
            <span className="text-xl font-semibold text-primary">Coreverus</span>
            <AriaButton className="rounded-md p-2 hover:bg-gray-50">
                <Menu className="size-6 text-secondary" />
            </AriaButton>
        </header>

        {/* Mobile Overlay */}
        <AriaModalOverlay
            isDismissable
            className="fixed inset-0 z-50 bg-black/50 lg:hidden"
        >
            {({ state }) => (
                <AriaModal className="fixed inset-y-0 left-0 w-64">
                    <AriaDialog className="h-full outline-none">
                        <div className="relative h-full">
                            <AriaButton
                                onPress={() => state.close()}
                                className="absolute top-4 right-4 rounded-md p-1 hover:bg-gray-50"
                            >
                                <X className="size-5 text-secondary" />
                            </AriaButton>
                            <Sidebar
                                pathname={pathname}
                                role={role}
                                onRoleChange={onRoleChange}
                            />
                        </div>
                    </AriaDialog>
                </AriaModal>
            )}
        </AriaModalOverlay>
    </AriaDialogTrigger>
);

// ============================================================================
// Main Layout
// ============================================================================

interface DashboardLayoutProps {
    children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    const pathname = usePathname();
    const { role, setRole } = useUserRole();

    return (
        <div className="flex min-h-screen bg-white">
            {/* Mobile Navigation */}
            <MobileSidebar pathname={pathname} role={role} onRoleChange={setRole} />

            {/* Desktop Sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64">
                <Sidebar pathname={pathname} role={role} onRoleChange={setRole} />
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col lg:pl-64">
                {/* Desktop Header */}
                <div className="hidden lg:block">
                    <Header role={role} />
                </div>

                {/* Page Content */}
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
};

export default DashboardLayout;
