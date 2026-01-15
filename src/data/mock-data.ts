import type {
    User,
    Property,
    Inspection,
    InspectionType,
    InspectionStatus,
    PriorityLevel,
} from "@/types";

// ============================================================================
// Organization
// ============================================================================

export const ORGANIZATION_ID = "org-1";

// ============================================================================
// Users
// ============================================================================

export interface InspectorWithMeta extends User {
    distance?: string;
    jobsToday?: number;
    availability: "available" | "busy";
}

export const USERS: Record<string, User> = {
    admin1: {
        id: "admin1",
        organizationId: ORGANIZATION_ID,
        email: "john@coreverus.com",
        fullName: "John Doe",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&face",
    },
    mike: {
        id: "mike",
        organizationId: ORGANIZATION_ID,
        email: "mike@coreverus.com",
        fullName: "Mike Johnson",
        role: "inspector",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&face",
    },
    sarah: {
        id: "sarah",
        organizationId: ORGANIZATION_ID,
        email: "sarah@coreverus.com",
        fullName: "Sarah Miller",
        role: "inspector",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&face",
    },
    emily: {
        id: "emily",
        organizationId: ORGANIZATION_ID,
        email: "emily@coreverus.com",
        fullName: "Emily Chen",
        role: "inspector",
    },
    david: {
        id: "david",
        organizationId: ORGANIZATION_ID,
        email: "david@coreverus.com",
        fullName: "David Kim",
        role: "inspector",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&face",
    },
};

export const INSPECTORS: Record<string, InspectorWithMeta> = {
    mike: {
        ...USERS.mike,
        distance: "2.1 mi",
        jobsToday: 4,
        availability: "busy",
    },
    sarah: {
        ...USERS.sarah,
        distance: "1.2 mi",
        jobsToday: 2,
        availability: "available",
    },
    emily: {
        ...USERS.emily,
        distance: "3.8 mi",
        jobsToday: 1,
        availability: "available",
    },
    david: {
        ...USERS.david,
        distance: "5.4 mi",
        jobsToday: 3,
        availability: "busy",
    },
};

// ============================================================================
// Properties
// ============================================================================

export const PROPERTIES: Property[] = [
    {
        id: "1",
        organizationId: ORGANIZATION_ID,
        address: "123 N Michigan Ave",
        city: "Chicago",
        state: "IL",
        zip: "60601",
        imageUrl: undefined,
        ownerName: "Robert Chen",
        ownerEmail: "robert@example.com",
        tenantName: "Jessica Martinez",
        leaseEndDate: new Date("2026-08-31"),
        lockboxCode: "4589",
        alarmCode: "9911",
        accessNotes: "Dog in yard. Ring doorbell first.",
    },
    {
        id: "2",
        organizationId: ORGANIZATION_ID,
        address: "456 W Wacker Dr",
        city: "Chicago",
        state: "IL",
        zip: "60606",
        imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=400&fit=crop",
        ownerName: "Sarah Johnson",
        ownerEmail: "sarah.j@example.com",
        tenantName: "Michael Brown",
        leaseEndDate: new Date("2026-12-15"),
        lockboxCode: "7823",
        alarmCode: "1234",
        accessNotes: "Use side entrance. Main door sticks.",
    },
    {
        id: "3",
        organizationId: ORGANIZATION_ID,
        address: "789 S State St",
        city: "Chicago",
        state: "IL",
        zip: "60605",
        imageUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=400&fit=crop",
        ownerName: "Michael Torres",
        ownerEmail: "m.torres@example.com",
        lockboxCode: "0000",
        alarmCode: "5555",
        accessNotes: "Lockbox on front door. Property is empty.",
    },
    {
        id: "4",
        organizationId: ORGANIZATION_ID,
        address: "321 E Oak St",
        city: "Chicago",
        state: "IL",
        zip: "60611",
        imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=400&fit=crop",
        ownerName: "Emily Davis",
        ownerEmail: "emily.d@example.com",
        tenantName: "James Wilson",
        leaseEndDate: new Date("2026-06-30"),
        lockboxCode: "2468",
        alarmCode: "1357",
        accessNotes: "Enter through garage. Code is same as lockbox.",
    },
    {
        id: "5",
        organizationId: ORGANIZATION_ID,
        address: "654 N Clark St",
        city: "Chicago",
        state: "IL",
        zip: "60654",
        imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=400&fit=crop",
        ownerName: "David Kim",
        ownerEmail: "d.kim@example.com",
        lockboxCode: "9999",
        alarmCode: "4321",
        accessNotes: "Building has doorman. Call ahead.",
    },
    {
        id: "6",
        organizationId: ORGANIZATION_ID,
        address: "987 W Madison St",
        city: "Chicago",
        state: "IL",
        zip: "60607",
        imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=400&fit=crop",
        ownerName: "Lisa Wang",
        ownerEmail: "lisa.w@example.com",
        tenantName: "Amanda Peters",
        leaseEndDate: new Date("2026-09-15"),
        lockboxCode: "1122",
        alarmCode: "3344",
    },
    {
        id: "7",
        organizationId: ORGANIZATION_ID,
        address: "990 Lake Shore Dr",
        city: "Chicago",
        state: "IL",
        zip: "60611",
        imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=400&fit=crop",
        ownerName: "Marcus Thompson",
        ownerEmail: "marcus.t@example.com",
        lockboxCode: "5678",
        alarmCode: "8765",
        accessNotes: "High-rise building. Check in with concierge.",
    },
    {
        id: "8",
        organizationId: ORGANIZATION_ID,
        address: "1200 S Prairie Ave",
        city: "Chicago",
        state: "IL",
        zip: "60605",
        imageUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&h=400&fit=crop",
        ownerName: "Jennifer Walsh",
        ownerEmail: "j.walsh@example.com",
        tenantName: "Kevin Nguyen",
        leaseEndDate: new Date("2026-11-30"),
        lockboxCode: "3456",
        alarmCode: "6543",
        accessNotes: "Tenant works from home. Schedule appointments in advance.",
    },
];

// Helper to get property by ID
export const getPropertyById = (id: string): Property | undefined => {
    return PROPERTIES.find((p) => p.id === id);
};

// Helper to get properties as a record for legacy code
export const PROPERTIES_BY_ID: Record<string, Property> = PROPERTIES.reduce(
    (acc, property) => {
        acc[property.id] = property;
        return acc;
    },
    {} as Record<string, Property>
);

// ============================================================================
// Inspections
// ============================================================================

export const INSPECTIONS: Inspection[] = [
    {
        id: "1",
        organizationId: ORGANIZATION_ID,
        propertyId: "1",
        inspectorId: "mike",
        type: "Move-In" as InspectionType,
        status: "Completed" as InspectionStatus,
        priority: "Standard" as PriorityLevel,
        scheduledDate: new Date("2026-01-12"),
        scheduledTime: "09:00",
        submittedAt: new Date("2026-01-12T11:30:00"),
        workflow: "SERVICING_MBA",
        templateId: "servicing-mba-v1",
        data: {},
        property: PROPERTIES[0],
        inspector: USERS.mike,
    },
    {
        id: "2",
        organizationId: ORGANIZATION_ID,
        propertyId: "2",
        inspectorId: "sarah",
        type: "Annual" as InspectionType,
        status: "Scheduled" as InspectionStatus,
        priority: "Urgent" as PriorityLevel,
        scheduledDate: new Date("2026-01-18"),
        scheduledTime: "10:30",
        workflow: "SERVICING_MBA",
        templateId: "servicing-mba-v1",
        data: {},
        property: PROPERTIES[1],
        inspector: USERS.sarah,
    },
    {
        id: "3",
        organizationId: ORGANIZATION_ID,
        propertyId: "3",
        inspectorId: "mike",
        type: "Move-Out" as InspectionType,
        status: "In Progress" as InspectionStatus,
        priority: "Urgent" as PriorityLevel,
        scheduledDate: new Date("2026-01-14"),
        scheduledTime: "14:00",
        workflow: "SERVICING_MBA",
        templateId: "servicing-mba-v1",
        data: {},
        property: PROPERTIES[2],
        inspector: USERS.mike,
    },
    {
        id: "4",
        organizationId: ORGANIZATION_ID,
        propertyId: "4",
        inspectorId: "emily",
        type: "Move-In" as InspectionType,
        status: "Cancelled" as InspectionStatus,
        priority: "Standard" as PriorityLevel,
        scheduledDate: new Date("2026-01-08"),
        scheduledTime: "11:00",
        workflow: "ORIGINATION_MF",
        templateId: "origination-mf-v1",
        loanNumber: "LN-2026-00412",
        data: {},
        property: PROPERTIES[3],
        inspector: USERS.emily,
    },
    {
        id: "5",
        organizationId: ORGANIZATION_ID,
        propertyId: "5",
        type: "Annual" as InspectionType,
        status: "Scheduled" as InspectionStatus,
        priority: "Standard" as PriorityLevel,
        scheduledDate: new Date("2026-01-22"),
        scheduledTime: "09:30",
        workflow: "SERVICING_MBA",
        templateId: "servicing-mba-v1",
        data: {},
        property: PROPERTIES[4],
        // No inspector assigned
    },
    {
        id: "6",
        organizationId: ORGANIZATION_ID,
        propertyId: "6",
        inspectorId: "david",
        type: "Move-Out" as InspectionType,
        status: "Completed" as InspectionStatus,
        priority: "Standard" as PriorityLevel,
        scheduledDate: new Date("2026-01-05"),
        scheduledTime: "15:00",
        submittedAt: new Date("2026-01-05T17:45:00"),
        workflow: "SERVICING_MBA",
        templateId: "servicing-mba-v1",
        data: {},
        property: PROPERTIES[5],
        inspector: USERS.david,
    },
    {
        id: "7",
        organizationId: ORGANIZATION_ID,
        propertyId: "1",
        inspectorId: "mike",
        type: "Move-In" as InspectionType,
        status: "Pending Review" as InspectionStatus,
        priority: "Standard" as PriorityLevel,
        scheduledDate: new Date("2026-01-14"),
        scheduledTime: "09:00",
        submittedAt: new Date("2026-01-14T10:45:00"),
        workflow: "ORIGINATION_MF",
        templateId: "origination-mf-v1",
        loanNumber: "LN-2026-00523",
        data: { propertyCondition: "Good", occupancyStatus: "Vacant" },
        property: PROPERTIES[0],
        inspector: USERS.mike,
    },
    {
        id: "8",
        organizationId: ORGANIZATION_ID,
        propertyId: "2",
        inspectorId: "mike",
        type: "Annual" as InspectionType,
        status: "Scheduled" as InspectionStatus,
        priority: "Urgent" as PriorityLevel,
        scheduledDate: new Date("2026-01-14"),
        scheduledTime: "14:30",
        workflow: "SERVICING_MBA",
        templateId: "servicing-mba-v1",
        data: {},
        property: PROPERTIES[1],
        inspector: USERS.mike,
    },
    {
        id: "9",
        organizationId: ORGANIZATION_ID,
        propertyId: "7",
        inspectorId: "sarah",
        type: "Move-In" as InspectionType,
        status: "In Progress" as InspectionStatus,
        priority: "Urgent" as PriorityLevel,
        scheduledDate: new Date("2026-01-15"),
        scheduledTime: "10:00",
        workflow: "ORIGINATION_MF",
        templateId: "origination-mf-v1",
        loanNumber: "LN-993821",
        data: { propertyType: "Multi-Family", units: 4 },
        property: PROPERTIES[6],
        inspector: USERS.sarah,
    },
    {
        id: "10",
        organizationId: ORGANIZATION_ID,
        propertyId: "8",
        inspectorId: "emily",
        type: "Annual" as InspectionType,
        status: "Scheduled" as InspectionStatus,
        priority: "Standard" as PriorityLevel,
        scheduledDate: new Date("2026-01-20"),
        scheduledTime: "11:00",
        workflow: "ORIGINATION_MF",
        templateId: "origination-mf-v1",
        loanNumber: "LN-994102",
        data: {},
        property: PROPERTIES[7],
        inspector: USERS.emily,
    },
];

// Helper to get inspection by ID
export const getInspectionById = (id: string): Inspection | undefined => {
    return INSPECTIONS.find((i) => i.id === id);
};

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Format a Date object to a display string (e.g., "Jan 12, 2026")
 */
export const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

/**
 * Format a time string (24h) to 12h format (e.g., "09:00" -> "9:00 AM")
 */
export const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes.toString().padStart(2, "0")} ${period}`;
};

/**
 * Format date and time together (e.g., "Jan 12, 2026 at 9:00 AM")
 */
export const formatDateTime = (date: Date, time: string): string => {
    return `${formatDate(date)} at ${formatTime(time)}`;
};

// ============================================================================
// Status Options (for filters)
// ============================================================================

export const INSPECTION_STATUS_OPTIONS = [
    "All",
    "Completed",
    "Scheduled",
    "In Progress",
    "Pending Review",
    "Cancelled",
] as const;

export const INSPECTION_TYPE_OPTIONS = [
    "Move-In",
    "Annual",
    "Move-Out",
] as const;

export const PRIORITY_OPTIONS = ["Standard", "Urgent"] as const;

// ============================================================================
// COMPATIBILITY ALIASES (Fixes Build Errors)
// ============================================================================

// 1. Export standard names as "MOCK_" names so the new code works
export const MOCK_INSPECTIONS = INSPECTIONS;
export const MOCK_PROPERTIES = PROPERTIES;
export const MOCK_USERS = Object.values(USERS); // Convert Record to Array


// 3. Make sure the date formatter is exported (it already is, but just in case)
// (Your file already exports 'formatDate', so we are good there)
