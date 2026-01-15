"use client";

import { useState } from "react";
import { Building2, ChevronDown, Key, Mail, MapPin, Plus, Search } from "lucide-react";
import Link from "next/link";
import { TableBody as AriaTableBody } from "react-aria-components";
import { Badge } from "@/components/base/badges/badges";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { Table, TableCard } from "@/components/application/table/table";
import { PropertyFormModal, PropertyFormData } from "@/components/features/properties/property-form-modal";
import { PropertyImage } from "@/components/ui/property-image";
import { useUserRole } from "@/contexts/user-role-context";
import { cx } from "@/utils/cx";
import type { Property } from "@/types";
// We alias it as 'PROPERTIES' so the rest of your page code doesn't break
import { MOCK_PROPERTIES as PROPERTIES } from "@/data/mock-data";

// ============================================================================
// Types (Local extensions)
// ============================================================================

type PropertyStatus = "Occupied" | "Vacant";
type AccessType = "Lockbox" | "Keypad" | "Manager";

// Extended property type for list view display
interface PropertyListItem extends Property {
    status: PropertyStatus;
    lastInspection: string;
    accessType: AccessType;
}

// ============================================================================
// Helpers
// ============================================================================

/** Get city/state display string */
const getCityState = (property: Property): string => {
    return `${property.city}, ${property.state}`;
};

/** Get occupancy status based on tenant presence */
const getOccupancyStatus = (property: Property): PropertyStatus => {
    return property.tenantName ? "Occupied" : "Vacant";
};

/** Determine access type from property data */
const getAccessType = (property: Property): AccessType => {
    if (property.lockboxCode) return "Lockbox";
    if (property.alarmCode) return "Keypad";
    return "Manager";
};

// Compute extended properties for list display
const PROPERTIES_EXTENDED: PropertyListItem[] = PROPERTIES.map((p) => ({
    ...p,
    status: getOccupancyStatus(p),
    lastInspection: "Jan 12, 2026", // Mock - would come from inspections data
    accessType: getAccessType(p),
}));

const STATUS_OPTIONS = ["All", "Occupied", "Vacant"] as const;

// ============================================================================
// Badge Helpers
// ============================================================================

const STATUS_BADGE_COLORS: Record<PropertyStatus, "success" | "gray"> = {
    Occupied: "success",
    Vacant: "gray",
};

const ACCESS_BADGE_COLORS: Record<AccessType, "blue" | "purple" | "orange"> = {
    Lockbox: "blue",
    Keypad: "purple",
    Manager: "orange",
};

// ============================================================================
// Components
// ============================================================================

interface FilterDropdownProps {
    label: string;
    value: string;
    options: readonly string[];
    onChange: (value: string) => void;
}

const FilterDropdown = ({ label, value, options, onChange }: FilterDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cx(
                    "flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-medium shadow-xs transition-colors hover:bg-gray-50",
                    isOpen && "ring-2 ring-brand-500",
                    value !== "All" && "ring-2 ring-brand-200 bg-brand-50"
                )}
            >
                <span className="text-tertiary">{label}:</span>
                <span className={cx("text-secondary", value !== "All" && "text-brand-700")}>{value}</span>
                <ChevronDown className={cx("size-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute top-full left-0 z-20 mt-1 w-36 rounded-lg border border-secondary bg-primary py-1 shadow-lg">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => {
                                    onChange(option);
                                    setIsOpen(false);
                                }}
                                className={cx(
                                    "w-full px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50",
                                    value === option ? "bg-gray-50 font-medium text-primary" : "text-secondary"
                                )}
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

// ============================================================================
// Page Component
// ============================================================================

export default function PropertiesPage() {
    const { isAdmin, isInspector } = useUserRole();
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("All");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const filteredProperties = PROPERTIES_EXTENDED.filter((property) => {
        const matchesSearch =
            searchQuery === "" ||
            property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
            property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (isAdmin && property.ownerName.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesStatus = statusFilter === "All" || property.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-display-sm font-semibold text-primary">Properties</h1>
                    <p className="mt-1 text-sm text-tertiary">
                        {isAdmin ? "Manage your property portfolio." : "View assigned properties."}
                    </p>
                </div>
                {isAdmin && (
                    <Button color="primary" size="md" iconLeading={Plus} onClick={() => setIsAddModalOpen(true)}>
                        Add Property
                    </Button>
                )}
            </div>

            {/* Stats Row */}
            <div className="mb-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-brand-50 p-2">
                            <Building2 className="size-5 text-brand-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-primary">{PROPERTIES_EXTENDED.length}</p>
                            <p className="text-sm text-tertiary">Total Properties</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-success-50 p-2">
                            <Building2 className="size-5 text-success-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-primary">
                                {PROPERTIES_EXTENDED.filter((p) => p.status === "Occupied").length}
                            </p>
                            <p className="text-sm text-tertiary">Occupied</p>
                        </div>
                    </div>
                </div>
                <div className="rounded-xl bg-primary p-4 shadow-xs ring-1 ring-secondary">
                    <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-gray-100 p-2">
                            <Building2 className="size-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-2xl font-semibold text-primary">
                                {PROPERTIES_EXTENDED.filter((p) => p.status === "Vacant").length}
                            </p>
                            <p className="text-sm text-tertiary">Vacant</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="w-full sm:w-80">
                    <Input
                        placeholder={isAdmin ? "Search properties or owners..." : "Search properties..."}
                        icon={Search}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.toString())}
                    />
                </div>
                <div className="flex items-center gap-3">
                    <FilterDropdown
                        label="Status"
                        value={statusFilter}
                        options={STATUS_OPTIONS}
                        onChange={setStatusFilter}
                    />
                    {statusFilter !== "All" && (
                        <button
                            onClick={() => setStatusFilter("All")}
                            className="text-sm font-medium text-brand-600 hover:text-brand-700"
                        >
                            Clear
                        </button>
                    )}
                </div>
            </div>

            {/* Results */}
            <div className="mb-4">
                <p className="text-sm text-tertiary">
                    Showing <span className="font-medium text-secondary">{filteredProperties.length}</span> of{" "}
                    <span className="font-medium text-secondary">{PROPERTIES_EXTENDED.length}</span> properties
                </p>
            </div>

            {/* Table */}
            <TableCard.Root>
                <Table aria-label="Properties table">
                    <Table.Header>
                        <Table.Head isRowHeader>Property</Table.Head>
                        {isAdmin ? (
                            <Table.Head>Owner</Table.Head>
                        ) : (
                            <Table.Head>Access</Table.Head>
                        )}
                        <Table.Head>Status</Table.Head>
                        <Table.Head>Last Inspection</Table.Head>
                        <Table.Head>Action</Table.Head>
                    </Table.Header>

                    <AriaTableBody items={filteredProperties}>
                        {(property) => (
                            <Table.Row key={property.id} id={property.id}>
                                <Table.Cell>
                                    <div className="flex items-center gap-3">
                                        <PropertyImage
                                            src={property.imageUrl}
                                            alt={property.address}
                                            className="size-10 shrink-0 rounded-lg"
                                        />
                                        <div>
                                            <Link
                                                href={`/properties/${property.id}`}
                                                className="font-medium text-primary hover:underline"
                                            >
                                                {property.address}
                                            </Link>
                                            <p className="flex items-center gap-1 text-sm text-tertiary">
                                                <MapPin className="size-3" />
                                                {getCityState(property)}
                                            </p>
                                        </div>
                                    </div>
                                </Table.Cell>

                                {isAdmin ? (
                                    <Table.Cell>
                                        <div>
                                            <p className="font-medium text-primary">{property.ownerName}</p>
                                            {property.ownerEmail && (
                                                <p className="flex items-center gap-1 text-sm text-tertiary">
                                                    <Mail className="size-3" />
                                                    {property.ownerEmail}
                                                </p>
                                            )}
                                        </div>
                                    </Table.Cell>
                                ) : (
                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            <Key className="size-4 text-gray-400" />
                                            <Badge color={ACCESS_BADGE_COLORS[property.accessType]} size="sm">
                                                {property.accessType}
                                            </Badge>
                                        </div>
                                    </Table.Cell>
                                )}

                                <Table.Cell>
                                    <Badge color={STATUS_BADGE_COLORS[property.status]} size="sm">
                                        {property.status}
                                    </Badge>
                                </Table.Cell>

                                <Table.Cell>
                                    <span className="text-sm text-tertiary">{property.lastInspection}</span>
                                </Table.Cell>

                                <Table.Cell>
                                    <Button color="secondary" size="sm" href={`/properties/${property.id}`}>
                                        View
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        )}
                    </AriaTableBody>
                </Table>
            </TableCard.Root>

            {/* Add Property Modal */}
            <PropertyFormModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                mode="add"
                onSubmit={(data) => {
                    console.log("New property:", data);
                    // In a real app, this would call an API to create the property
                }}
            />
        </div>
    );
}
