"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

// ============================================================================
// Constants
// ============================================================================

const STORAGE_KEY = "inspectra-view-preference";

// ============================================================================
// Types
// ============================================================================

export type UserRole = "admin" | "inspector";

interface UserRoleContextValue {
    role: UserRole;
    setRole: (role: UserRole) => void;
    isAdmin: boolean;
    isInspector: boolean;
    isHydrated: boolean; // Indicates if localStorage has been read
}

// ============================================================================
// Helpers
// ============================================================================

function isValidRole(value: unknown): value is UserRole {
    return value === "admin" || value === "inspector";
}

function getStoredRole(): UserRole | null {
    if (typeof window === "undefined") return null;

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && isValidRole(stored)) {
            return stored;
        }
    } catch {
        // localStorage might be unavailable (private browsing, etc.)
        console.warn("Failed to read from localStorage");
    }
    return null;
}

function setStoredRole(role: UserRole): void {
    if (typeof window === "undefined") return;

    try {
        localStorage.setItem(STORAGE_KEY, role);
    } catch {
        console.warn("Failed to write to localStorage");
    }
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
    // Initialize with default to avoid hydration mismatch
    const [role, setRoleState] = useState<UserRole>(defaultRole);
    const [isHydrated, setIsHydrated] = useState(false);

    // Read from localStorage after mount (hydration-safe)
    useEffect(() => {
        const storedRole = getStoredRole();
        if (storedRole) {
            setRoleState(storedRole);
        }
        setIsHydrated(true);
    }, []);

    // Custom setRole that also persists to localStorage
    const setRole = (newRole: UserRole) => {
        setRoleState(newRole);
        setStoredRole(newRole);
    };

    const value: UserRoleContextValue = {
        role,
        setRole,
        isAdmin: role === "admin",
        isInspector: role === "inspector",
        isHydrated,
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
