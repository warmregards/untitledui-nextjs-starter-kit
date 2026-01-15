// =============================================================================
// ENUMS / TYPE ALIASES
// =============================================================================

export type UserRole = 'admin' | 'inspector';
export type OrganizationPlan = 'trial' | 'starter' | 'professional';
export type InspectionType = 'Move-In' | 'Annual' | 'Move-Out';
export type InspectionStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled' | 'Pending Review';
export type PriorityLevel = 'Standard' | 'Urgent';
export type ItemStatus = 'pass' | 'fail' | 'na' | 'pending';
export type SeverityLevel = 'low' | 'medium' | 'high';

// =============================================================================
// DUAL-WORKFLOW ARCHITECTURE
// =============================================================================

/**
 * WorkflowType - Defines the two primary inspection paths:
 * - ORIGINATION_MF: Origination Multi-Family (Path A) - Form-based questionnaire
 * - SERVICING_MBA: Servicing MBA (Path B) - Checklist with ratings
 */
export type WorkflowType = 'ORIGINATION_MF' | 'SERVICING_MBA';

/**
 * ValidationMode - Controls how strictly the template validates data:
 * - STRICT: All blockers must be resolved before submission
 * - FLEXIBLE: Warnings allowed, blockers still required
 */
export type ValidationMode = 'STRICT' | 'FLEXIBLE';

/**
 * FieldType - All supported field types across both workflows:
 * - TEXT: Single-line text input
 * - TEXTAREA: Multi-line text input
 * - SELECT: Dropdown selection
 * - DATE: Date picker
 * - NUMBER: Numeric input
 * - RATING_1_5: 1-5 rating scale (MBA ratings)
 * - PHOTO_ARRAY: Array of photo uploads
 * - REPEATER: Repeatable field group
 * - CHECKBOX: Boolean checkbox
 * - RADIO: Radio button group
 */
export type FieldType =
  | 'TEXT'
  | 'TEXTAREA'
  | 'SELECT'
  | 'DATE'
  | 'NUMBER'
  | 'RATING_1_5'
  | 'PHOTO_ARRAY'
  | 'REPEATER'
  | 'CHECKBOX'
  | 'RADIO';

/**
 * ValidationLevel - Field validation severity:
 * - BLOCKER: Must be completed before submission (red indicator)
 * - WARNING: Should be completed but can be skipped (yellow indicator)
 */
export type TemplateValidationLevel = 'BLOCKER' | 'WARNING';

// =============================================================================
// TEMPLATE STRUCTURE (JSON Schema Compatible)
// =============================================================================

/**
 * FieldOption - Options for SELECT/RADIO field types
 */
export interface FieldOption {
  value: string;
  label: string;
}

/**
 * TemplateField - Individual field definition within a section
 */
export interface TemplateField {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  validationLevel: TemplateValidationLevel;
  placeholder?: string;
  helpText?: string;
  options?: FieldOption[];
  defaultValue?: string | number | boolean;
  // Validation constraints
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
  // For REPEATER fields
  repeaterFields?: TemplateField[];
  minItems?: number;
  maxItems?: number;
}

/**
 * TemplateSection - Group of related fields
 */
export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  fields: TemplateField[];
}

/**
 * InspectionTemplate - Complete template definition
 * Supports both ORIGINATION_MF and SERVICING_MBA workflows
 */
export interface InspectionTemplate {
  id: string;
  title: string;
  version: string;
  workflowType: WorkflowType;
  validationMode: ValidationMode;
  sections: TemplateSection[];
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

// =============================================================================
// CORE INTERFACES
// =============================================================================

export interface Organization {
  id: string;
  name: string;
  logo?: string;
  plan: OrganizationPlan;
}

export interface User {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatar?: string;
}

export interface Property {
  id: string;
  organizationId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  imageUrl?: string;
  // Admin Data
  ownerName: string;
  ownerEmail?: string;
  tenantName?: string;
  leaseEndDate?: Date;
  // Inspector Data
  lockboxCode?: string;
  alarmCode?: string;
  accessNotes?: string;
}

/**
 * Inspection - Main inspection record
 * Links to a template and stores dynamic response data
 */
export interface Inspection {
  id: string;
  organizationId: string;
  propertyId: string;
  inspectorId?: string;
  type: InspectionType;
  status: InspectionStatus;
  priority: PriorityLevel;
  scheduledDate: Date;
  scheduledTime: string;
  submittedAt?: Date;

  // --- Workflow & Template ---
  workflow: WorkflowType;
  templateId: string;

  // --- Origination-Specific ---
  loanNumber?: string;

  // --- Dynamic Data Storage ---
  // Stores all field responses keyed by field ID
  // Example: { "mf_economic_outlook": "Positive", "pc_roof_rating": "3", "utility_photos": ["url1", "url2"] }
  data: Record<string, unknown>;

  // --- Relations (For frontend display) ---
  property?: Property;
  inspector?: User;
}

// =============================================================================
// LEGACY TYPES (Backwards Compatibility)
// =============================================================================

/** @deprecated Use WorkflowType instead */
export type InspectionWorkflow = 'origination' | 'servicing';

/** @deprecated Use TemplateValidationLevel instead */
export type ValidationLevel = 'blocker' | 'warning';

/** @deprecated Use FieldType instead */
export type OriginationFieldType = 'text' | 'textarea' | 'select' | 'date' | 'number' | 'checkbox' | 'radio';

// MBA Rating Scale (For RATING_1_5 field type)
export type MBARating = '1' | '2' | '3' | '4' | '5' | 'NA' | 'NX';

// =============================================================================
// CHECKLIST / SERVICING TYPES (Path B - MBA Ratings)
// =============================================================================

export interface ChecklistItem {
  id: string;
  name: string;
  category: string;
  status: ItemStatus;
  rating?: MBARating;
  note?: string;
  photos?: string[];
  severity?: SeverityLevel;
}

export interface ChecklistCategory {
  id: string;
  name: string;
  items: ChecklistItem[];
}

// =============================================================================
// LEGACY ORIGINATION TYPES (For backwards compatibility)
// =============================================================================

/** @deprecated Use FieldOption instead */
export interface OriginationFieldOption {
  value: string;
  label: string;
}

/** @deprecated Use TemplateField instead */
export interface OriginationField {
  id: string;
  label: string;
  type: OriginationFieldType;
  required: boolean;
  validationLevel: ValidationLevel;
  placeholder?: string;
  helpText?: string;
  options?: OriginationFieldOption[];
  defaultValue?: string | number | boolean;
  validation?: {
    min?: number;
    max?: number;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

/** @deprecated Use TemplateSection instead */
export interface OriginationSection {
  id: string;
  title: string;
  description?: string;
  fields: OriginationField[];
}

/** @deprecated Use InspectionTemplate instead */
export interface OriginationTemplate {
  id: string;
  name: string;
  version: string;
  workflow: 'origination';
  sections: OriginationSection[];
}

/** @deprecated Use InspectionTemplate instead */
export interface ServicingTemplate {
  id: string;
  name: string;
  version: string;
  workflow: 'servicing';
  categories: ChecklistCategory[];
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Helper type to extract field IDs from a template
 */
export type ExtractFieldIds<T extends InspectionTemplate> =
  T['sections'][number]['fields'][number]['id'];

/**
 * Type-safe data record based on template fields
 */
export type InspectionData<T extends Record<string, unknown> = Record<string, unknown>> = T;

/**
 * Workflow to Template mapping helper
 */
export const WORKFLOW_TEMPLATE_MAP: Record<WorkflowType, string> = {
  'ORIGINATION_MF': 'origination-mf-v1',
  'SERVICING_MBA': 'servicing-mba-v1',
};
