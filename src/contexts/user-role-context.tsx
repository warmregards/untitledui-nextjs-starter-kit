"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// ============================================================================
// Types
// ============================================================================

export type UserRole = "admin" | "inspector";

interface UserRoleContextValue {
    role: UserRole;
    setRole: (role: UserRole) => void;
    isAdmin: boolean;
    isInspector: boolean;
}

// ============================================================================
// Context
// ============================================================================

const UserRoleContext = createContext<UserRoleContextValue | undefined>(undefined);

// ============================================================================
// Provider
// ============================================================================

interface UserRoleProviderProps {
    children: ReactNode;
    defaultRole?: UserRole;
}

export function UserRoleProvider({ children, defaultRole = "admin" }: UserRoleProviderProps) {
    const [role, setRole] = useState<UserRole>(defaultRole);

    const value: UserRoleContextValue = {
        role,
        setRole,
        isAdmin: role === "admin",
        isInspector: role === "inspector",
    };

    return (
        <UserRoleContext.Provider value={value}>
            {children}
        </UserRoleContext.Provider>
    );
}

// ============================================================================
// Hook
// ============================================================================

export function useUserRole() {
    const context = useContext(UserRoleContext);
    if (context === undefined) {
        throw new Error("useUserRole must be used within a UserRoleProvider");
    }
    return context;
}
