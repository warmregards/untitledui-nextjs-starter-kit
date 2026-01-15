# Coreverus V1 — Executive Product Brief

**Version 1.0 | January 2026 | Status: Prototype Complete**

---

## Executive Summary

Coreverus is an enterprise inspection management platform purpose-built for property management companies. The platform unifies field inspection workflows with back-office operations, bridging the gap between office scheduling, client reporting, and team management with on-site data collection, photo documentation, and issue tracking.

The V1 prototype demonstrates a complete dual-role system serving both **Administrators** (dispatchers/owners managing operations) and **Inspectors** (field agents executing site visits). Built on Next.js 14 with the Untitled UI design system, the prototype establishes the visual language, interaction patterns, and data architecture required for production development.

This brief serves as the authoritative reference for engineering implementation, capturing UI specifications, component patterns, and business logic as designed.

---

## Document Ownership

| Role | Responsibility |
|------|----------------|
| **Product Owner & UI/UX Designer** | Sanel — Requirements definition, UI design, prototype development |
| **React Developer** | Ben — Frontend implementation |
| **React Developer** | Dan — Frontend implementation, mobile optimization |

---

## Platform Overview

### Mission Statement

Coreverus streamlines property inspection workflows by providing a unified system where office staff schedule and review inspections while field agents capture data and documentation on-site. The platform eliminates spreadsheet-based tracking, manual photo organization, and disconnected communication between office and field.

### Core User Roles

**Administrator (The Dispatcher/Owner)**
Responsible for business operations including asset management (property portfolios with owner/tenant data), team operations (inspector assignment, workload monitoring, submission review), client reporting (approval workflows, document delivery), and business configuration (templates, billing, branding).

**Inspector (The Field Agent)**
The mobile workforce executing inspections with access to route logistics (optimized daily schedules with drive time estimates), site access information (lockbox codes, alarm codes, entry instructions), data collection tools (checklist completion, photo documentation, issue flagging), and report submission (draft management, approval workflow).

---

## Technical Foundation

### Framework & Libraries

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first config) |
| UI Components | Untitled UI Design System + React Aria Components |
| Icons | Lucide React |
| Charts | Recharts |
| Date Handling | @internationalized/date |

### Design System: Visual Language

#### Color System

| Token | Hex | Usage |
|-------|-----|-------|
| Primary Brand | #7F56D9 (Purple) | CTAs, active states, progress indicators |
| Success | #17B26A (Green) | Completed items, positive feedback |
| Warning | #F79009 (Amber) | Pending reviews, attention required |
| Error | #F04438 (Red) | Failed items, critical issues |
| Neutral | Gray scale | Text hierarchy (primary, secondary, tertiary) |

#### Status Badge Pattern

Consistent circular badge system used across all modules:

| Status | Background | Text | Icon |
|--------|------------|------|------|
| Scheduled | Blue-50 | Blue-600 | Clock |
| In Progress | Amber-50 | Amber-600 | PlayCircle |
| Completed | Green-50 | Green-600 | CheckCircle |
| Cancelled | Gray-100 | Gray-500 | XCircle |

#### Urgency Indicator

High-priority items display a dedicated chip pattern:
- **Style:** Orange-50 background, Orange-700 text, Orange-200 border
- **Icon:** Zap (lightning bolt)
- **Placement:** Top-right of cards; inline with status in tables

#### Card Patterns

| Variant | Background | Border | Shadow | Usage |
|---------|------------|--------|--------|-------|
| Standard | White | Ring (subtle) | shadow-xs | Default containers |
| Highlighted | Brand-50 | Brand-200 ring | — | Active/in-progress items |
| Warning | Amber-50 | Amber-200 | — | Action required states |

#### Header Patterns

| Type | Usage | Structure |
|------|-------|-----------|
| Gallery Style | Detail pages | Large banner image with overlaid controls, clean info bar below |
| Standard | List pages | Title + description + primary action button (right-aligned) |

---

## Module Specifications

### A. Authentication & Onboarding

#### Admin Signup (`/sign-up`)

**Purpose:** New business owner creating an organization account

**Header Copy:** "Start your 14-day free trial"

**Form Fields:**
1. Full Name — required
2. Company Name — required, creates organization identity
3. Work Email — required
4. Password — required, minimum 8 characters

**Post-Registration:** Triggers Admin Onboarding Wizard on first dashboard load

#### Admin Onboarding Wizard

**Trigger:** `user.isNewAdmin === true`

**Step 1 — Branding**
- Title: "Let's set up your workspace"
- Action: Upload company logo (drag & drop zone)
- Options: "Skip for now" | "Continue"

**Step 2 — Team Invitation**
- Title: "Invite your team"
- Action: Enter inspector email address
- Options: "Back" | "Send Invite & Finish" | "Skip & Finish"

#### Inspector Signup (`/accept-invite`)

**Purpose:** Team member joining via email invitation

**Context Display:**
- Company logo/avatar
- Heading: "Join [Company Name] on Coreverus"
- Subtext: "You have been invited by [Inviter Name] to join as an Inspector"

**Form Fields:**
1. Full Name — required
2. Create Password — required
3. Confirm Password — required, match validation

**CTA:** "Join Team"

#### Sign In (`/sign-in`)

Standard email/password authentication with "Forgot Password" link.

#### Forgot Password (`/forgot-password`)

Email-based password reset flow.

---

### B. Global Navigation

#### Dashboard Layout

| Viewport | Structure |
|----------|-----------|
| Desktop | Fixed 64px sidebar + flexible content area |
| Mobile | Collapsible drawer with hamburger trigger |

#### Header Bar (Global)

**Position:** Fixed top, spans content area (excludes sidebar)

**Components (Right-aligned):**

1. **Sync Status Widget**
   - Online: Green CloudCheck icon + "Online • Synced"
   - Offline: Yellow CloudOff icon + "Offline • Pending"
   - Style: Pill button with border, white background

2. **Weather Widget**
   - Format: "[City], [State] • [Temp]°F • [Condition]"
   - Icon: Sun/Cloud based on condition
   - Style: Gray-100 pill background

3. **User Avatar**
   - Links to profile/settings
   - Fallback: Initials when no image uploaded

#### Sidebar Navigation

**Logo Area:** Company name with Building2 icon

**Role-Aware Navigation:**

| Route | Admin | Inspector |
|-------|-------|-----------|
| Dashboard | ✓ | ✓ |
| Inspections | ✓ (all) | ✓ (filtered to assigned) |
| Properties | ✓ (full access) | ✓ (restricted view) |
| Settings | ✓ (all tabs) | ✓ (limited tabs) |

**Footer Section:**
1. Role Switcher — development feature for testing
2. User Profile card — avatar, name, email

---

### C. Dashboard Module

#### Admin Dashboard View

**Header:**
- Title: "Dashboard"
- Subtitle: "Overview of your inspection operations"
- Actions: Date Range picker, Export button

**KPI Stats Grid (4 columns):**

| Metric | Description | Style |
|--------|-------------|-------|
| Total Inspections | All-time count | Standard + trend indicator |
| In Progress | Active inspection count | Standard |
| Scheduled Today | Today's workload | Standard |
| Pending Reviews | Awaiting approval | Warning variant |

**Inspection Trends Chart:**
- Type: Dual-line (Scheduled vs Completed)
- Toggle: 7 Days / 30 Days
- Library: Recharts with custom tooltip

**Secondary Metrics Row:**
1. **Inspection Mix** — Donut chart by type (Move-In, Annual, Move-Out)
2. **Top Inspectors Leaderboard** — Bar chart with avatars and inspection counts

**Action Required Section:**
- Title: "Pending Approvals"
- Content: List of inspector submissions awaiting review
- Each item: Address, Inspector name, Issue count, Time submitted, Review button

#### Inspector Dashboard View

**Header:**
- Personalized greeting: "Good [Morning/Afternoon/Evening], [Name]"
- Subtitle: "Here's your schedule for today"

**KPI Stats Grid (3 columns):**

| Metric | Description |
|--------|-------------|
| Today's Schedule | Job count for today |
| In Progress | Currently active inspection |
| Completed | Monthly total with trend indicator |

**Main Content (3-column grid):**

**Column 1 — Today's Schedule**
- Chronological list of scheduled inspections
- Card content: Time, Address, City, Type badge
- Active inspection: Highlighted with brand colors
- Actions: "Start" or "Resume" buttons

**Column 2 — Route Map**
- Stylized SVG map with numbered stop markers
- Dotted route line connecting stops
- Bottom overlay: "Est. Drive Time: X hours"

**Column 3 — Sidebar Stack**
1. **My Drafts** — Incomplete reports with progress bars
2. **Manager Feedback** — Recent approval/change request notifications
3. **Quick Actions** — Navigation shortcuts

---

### D. Inspections Module

#### List View (`/inspections`)

**Header:**
- Admin: "Inspections" + "Schedule Inspection" button (primary)
- Inspector: "My Inspections" (no create button)

**Toolbar:**
- Search input — filters by address
- Status dropdown — All, Completed, Scheduled, In Progress, Cancelled
- Date Range button — placeholder for future implementation
- Clear filters link — visible when filters active

**Results Count:** "Showing X of Y inspections"

#### Elastic Split-View Layout

**Concept:** Airbnb-style toggle between table-focused and map-focused views

**Collapsed Map State (Default):**
- Grid ratio: Table 9 columns / Map 3 columns
- Full data table visible with all columns
- Mini map with pins in sidebar

**Expanded Map State:**
- Grid ratio: Table 3 columns / Map 9 columns
- Compact card list replaces table
- Full map with legend, inspector availability panel

**Toggle Button:** Maximize2/Minimize2 icons with "Expand Map"/"Collapse" labels

#### Map Panel

**Visual Elements:**
- SVG-based stylized city grid (Chicago-themed for prototype)
- Lake Michigan representation (blue gradient)
- Chicago River paths
- Street grid overlay

**Interactive Pins:**
- Position: Distributed across map matching inspection locations
- Icon: Status-specific (Clock, PlayCircle, CheckCircle, XCircle)
- Colors: Match status badge colors
- Tooltip: Address + Status on hover
- Click: Navigates to inspection detail

**Map Controls:**
- Expand/Collapse button — top-left
- Location card "Chicago Loop - X locations" — top-right (compact mode)
- Legend panel — bottom-left (expanded mode)
- Inspectors panel with availability — top-right (expanded mode)

**Z-Index Behavior:** When modals open, map controls receive `invisible` class to prevent bleed-through

#### Data Table (Admin View)

| Column | Content |
|--------|---------|
| Property | Address + City/State (clickable link) |
| Inspector | Avatar + Name, or "Assign" button |
| Type | Move-In / Annual / Move-Out badge |
| Status | Color-coded badge + Urgent indicator |
| Date | Scheduled date |
| Action | View button |

#### Data Table (Inspector View)

| Column | Content |
|--------|---------|
| Property | Address + City/State |
| Type | Badge |
| Status | Badge + Urgent indicator |
| Date | Scheduled date |
| Action | Start / Resume / View (based on status) |

#### Compact Card List (Expanded Map Mode)

**Card Structure:**
- Urgent badge — top-right if applicable
- Address — bold
- Date — with Calendar icon
- Inspector — avatar + name, or "Assign Inspector" link
- Status — circular icon indicator

#### Assign Inspector Modal

**Trigger:** Click "Assign" button on unassigned inspection

**Header:**
- Title: "Assign Inspector"
- Subtitle: Property address

**Search:** Filter inspectors by name

**Inspector List Options:**
- Avatar + Name
- Availability badge (Available/Busy)
- Distance from property
- Jobs scheduled today

**Purpose:** Smart assignment context helps dispatcher make informed decisions based on proximity and workload

#### Create Inspection Sheet

**Trigger:** "Schedule Inspection" button (Admin only)

**Type:** Slide-in sheet from right

**Form Sections:**

**1. Property Selection**
- Searchable dropdown of existing properties
- Shows address preview when selected

**2. Inspection Details**
- Type: Move-In / Annual / Move-Out — radio group
- Priority: Standard / Urgent — radio group
- Date: Custom DatePicker component
- Time: Custom TimePicker component

**3. Assignment (Optional)**
- Inspector dropdown
- Can leave unassigned for later assignment

**Actions:** Cancel | Schedule Inspection

#### Inspection Detail Page (`/inspections/[id]`)

**Header Section:**
- Breadcrumb: "Back to Inspections"
- Address (large) + Status badge
- Property meta: Type badge, sqft, year built, scheduled date
- Action buttons (role-specific)

##### Admin View — Inspection Detail

**Action Buttons:**
- Print Report
- Request Changes
- Approve Inspection

**Alert Banner (when pending approval):**
- Message: "Approval Requested"
- Content: Inspector name, submission time, issue count

**Summary Cards (3 columns):**

| Card | Content | Style |
|------|---------|-------|
| Progress | Percentage with progress bar | Standard |
| Issues Found | Count (clickable) | Warning |
| Photos Uploaded | Count | Standard |

**Room Checklist Accordion:**
- Expandable sections by room (Kitchen, Living Room, etc.)
- Each room header: Status icon, name, issue count, item count
- Failed rooms: Default to expanded state
- Item rows: Pass/Fail icon, name, notes, evidence photo thumbnails

**Sidebar:**
1. Property Hero Card — image + "View Gallery" button
2. Map Card — location preview
3. Assigned Inspector Card — avatar, name, message button
4. Activity Timeline — chronological event log

##### Inspector View — Inspection Detail

**Action Buttons:**
- Save Draft
- Submit Report

**Room Checklist (Editable):**
- Segmented control per item: Pass / Fail / N/A
- Fail selection triggers defect form:
  - Severity: Low / Medium / High — radio group
  - Description: Textarea
  - Evidence photos: Upload zone with drag & drop

**Sidebar:**
1. Property Hero Card
2. **Access Information Card** (Inspector-exclusive)
   - Lockbox Code — with copy button
   - Alarm Code — with copy button
3. Map Card
4. Activity Timeline

#### Submit Report Modal (Inspector)

**Trigger:** "Submit Report" button

**Content:**
- Icon: Send in brand-colored circle
- Title: "Submit Inspection Report?"
- Summary: "X High Severity Issues found"
- Note: "This report will be sent to [Manager Name] for final approval"

**Actions:** "Go Back" (secondary) | "Submit for Approval" (primary)

#### Approve Modal (Admin)

**Content:**
- Icon: CheckCircle in success-colored circle
- Title: "Approve Inspection"
- Description: Confirmation message about finalizing report

**Actions:** Cancel | Approve

#### Request Changes Modal (Admin)

**Content:**
- Icon: RotateCcw in amber-colored circle
- Title: "Request Changes"
- Description: "What needs to be fixed?"
- Textarea: Feedback message input

**Actions:** Cancel | Send Request

#### Gallery Modal

**Trigger:** "View Gallery" button on property card

**Header:** "Media Gallery" + photo count + "Upload Photos" button

**Content:** 3-4 column responsive image grid

**Interaction:** Click to expand (placeholder for lightbox)

---

### E. Properties Module

#### List View (`/properties`)

**Header:**
- Title: "Properties"
- Admin action: "Add Property" button
- Inspector: No add button

**Toolbar:**
- Search input
- View toggle: Grid / List (Admin only)

**Grid View (Default):**
- 3-column responsive grid
- Property card content:
  - Image thumbnail
  - Address + city
  - Property type badge
  - Quick stats (beds, baths, sqft)
  - Last inspection date

**List View (Admin only):**
- Table format with sortable columns
- Additional data columns visible

#### Property Detail Page (`/properties/[id]`)

##### Admin View — Full Access

**Header:**
- Gallery banner image
- Address overlay
- Action buttons: Edit Property | Schedule Inspection

**Info Bar:** Property type, Beds, Baths, Sqft, Year Built

**Tab Navigation:**

| Tab | Content |
|-----|---------|
| Overview | Property description, Owner Information card, Tenant Information card, Recent inspections list |
| Inspections | Complete inspection history with status, date, inspector, links to details |
| Documents | Document library (lease, photos, reports), Upload/Download/Preview actions |
| Financials | Revenue tracking, Billing history (Admin-only) |

##### Inspector View — Restricted Access

**Visible Elements:**
- Property image and basic info
- Address and directions

**Access Information Card (Prominent):**
- Style: Amber background to draw attention
- Lockbox/Entry Code — with copy button
- Alarm Code — with copy button
- Access Notes — e.g., "Dog in yard. Ring doorbell first."

**Actions:**
- "Get Directions" — Opens in Waze/Maps
- "Copy Codes" — Clipboard functionality
- "Report Access Issue" — Flag problems

**Hidden from Inspector:**
- Owner contact information
- Tenant personal details
- Financial data
- Document library

#### Property Form Modal

**Trigger:** "Add Property" or "Edit Property" buttons

**Form Sections:**

**1. Asset Details**
- Street Address — required
- City — required
- State
- Zip Code
- Property Image URL

**2. People**
- Owner Name — required
- Owner Email
- Tenant Name
- Lease End Date — DatePicker

**3. Access Information** (Amber highlighted section)
- Lockbox / Entry Code
- Alarm Code
- Access Notes — textarea

**Validation:** Address, City, and Owner Name are required fields

**Actions:** Cancel | Add Property / Save Changes

---

### F. Settings Module

#### Settings Page (`/settings`)

**Layout:** Vertical tab navigation on left, content area on right

##### Admin Tabs

| Tab | Content |
|-----|---------|
| Profile | Company logo upload, Company name, Admin contact info, Save Changes button |
| Team | Team member list (Avatar, Name, Email, Role badge, Status, Remove button), "Invite Member" button |
| Templates | Template library (Standard Residential 85 items, Commercial Safety 62 items, HUD Section 8 94 items), Edit/Duplicate/Delete per template, "New Template" button, "Browse Library" button |
| Billing | Current plan display, Payment method, Invoice history, Upgrade options |
| Notifications | Email preferences, Push notification settings, Digest frequency options |

##### Inspector Tabs

| Tab | Content |
|-----|---------|
| Profile | Personal information, Avatar upload, Contact details |
| Availability | Working hours (Start/End TimePickers), Working days checkboxes, Save button |
| App Settings | Device storage management, Offline mode preferences, Photo quality settings |

#### Invite Member Modal

**Trigger:** "Invite Member" button in Team tab

**Form:**
- Email Address — input
- Role — dropdown (Admin, Inspector)

**Actions:** Cancel | Send Invite

#### New Template Modal

**Trigger:** "New Template" button in Templates tab

**Form:**
- Template Name — input
- Description — textarea
- Starting point:
  - Start from Scratch
  - Import Existing (file upload)

**Actions:** Cancel | Create Template

#### Edit Checklist Modal

**Trigger:** Edit button on template

**Content:**
- Checklist item list with item name and remove button per item
- "Add Item" button with input field

**Actions:** Cancel | Save Changes

#### Template Library Modal

**Trigger:** "Browse Library" button

**Content:** Grid of template cards with name, description, item count, "Use Template" button

**Available Templates:**
- Standard Residential (85 items)
- Commercial Safety (62 items)
- HUD Section 8 (94 items)

---

## Critical User Flows

### Flow 1: Admin Schedules New Inspection

1. Admin clicks "Schedule Inspection" on Inspections page
2. Create Inspection Sheet slides in from right
3. Admin selects property from searchable dropdown
4. Admin chooses inspection type (Move-In/Annual/Move-Out)
5. Admin sets priority (Standard/Urgent)
6. Admin picks date using DatePicker
7. Admin picks time using TimePicker
8. Admin optionally assigns inspector from dropdown
9. Admin clicks "Schedule Inspection"
10. Sheet closes, inspection appears in list

### Flow 2: Admin Assigns Inspector

1. Admin sees unassigned inspection in list (shows "Assign" button)
2. Admin clicks "Assign" button
3. Assign Inspector Modal opens showing property address
4. Modal displays available inspectors with distance, workload, and availability
5. Admin selects appropriate inspector
6. Modal closes, inspection updated with assignment
7. Inspector receives notification (future implementation)

### Flow 3: Inspector Completes Inspection

1. Inspector views Dashboard with today's schedule
2. Inspector clicks "Start" on first scheduled job
3. Inspection detail page loads
4. Inspector reviews Access Information card (lockbox, alarm codes)
5. Inspector works through room checklist:
   - Marks items Pass / Fail / N/A using segmented controls
   - For failed items: selects severity, adds description, uploads evidence photos
6. Inspector clicks "Save Draft" periodically
7. When complete, Inspector clicks "Submit Report"
8. Submit Modal shows issue summary and approval note
9. Inspector confirms with "Submit for Approval"
10. Report sent to Admin's Pending Approvals queue

### Flow 4: Admin Reviews and Approves

1. Admin sees "Pending Approvals" count on Dashboard
2. Admin clicks "Review" on pending submission
3. Inspection detail page loads with "Approval Requested" banner
4. Admin reviews:
   - Summary cards (progress, issues, photos)
   - Room-by-room findings in accordion
   - Evidence photos for failed items
5. **Option A — Approve:**
   - Admin clicks "Approve Inspection"
   - Confirmation modal appears
   - Admin confirms
   - Status changes to Completed
6. **Option B — Request Changes:**
   - Admin clicks "Request Changes"
   - Feedback modal appears with textarea
   - Admin enters required changes
   - Inspection returns to Inspector with feedback

### Flow 5: Sync Status Indication

1. App monitors network connectivity
2. Header displays current status:
   - Online: Green icon + "Online • Synced"
   - Offline: Yellow icon + "Offline • Pending"
3. When offline:
   - Data cached locally
   - Changes queued for sync
4. When reconnected:
   - Automatic sync triggered
   - Status updates to "Syncing..."
   - Then "Online • Synced"

### Flow 6: New Team Member Onboarding

1. Admin navigates to Settings → Team tab
2. Admin clicks "Invite Member"
3. Modal opens with email and role fields
4. Admin enters inspector email address
5. Admin selects "Inspector" role from dropdown
6. Admin clicks "Send Invite"
7. Inspector receives email with invite link
8. Inspector clicks link, lands on `/accept-invite`
9. Page displays company info and inviter name
10. Inspector creates account (name + password with confirmation)
11. Inspector clicks "Join Team"
12. Inspector redirected to their Dashboard

---

## Component Library Reference

### Custom UI Components

| Component | Location | Purpose |
|-----------|----------|---------|
| DatePicker | `/components/ui/date-picker.tsx` | Calendar-based date selection |
| TimePicker | `/components/ui/time-picker.tsx` | 12-hour time selection with AM/PM toggle |
| AdminWizard | `/components/onboarding/admin-wizard.tsx` | First-run setup flow |
| CreateInspectionSheet | `/components/features/inspections/` | Slide-in scheduling form |
| PropertyFormModal | `/components/features/properties/` | Add/Edit property form |

### Base Components (Untitled UI)

| Component | Purpose |
|-----------|---------|
| Button | Primary, Secondary, Tertiary variants |
| Input | Text input with icon support |
| Badge | Status indicators with color variants |
| Avatar | User/company images with initials fallback |
| Table | Data tables with sorting capability |

---

## Data Models

### User

```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'inspector';
  avatar?: string;
  organizationId: string;
  isNewAdmin?: boolean; // Triggers onboarding wizard
}
```

### Organization

```typescript
interface Organization {
  id: string;
  name: string;
  logo?: string;
  createdAt: Date;
  plan: 'trial' | 'starter' | 'professional';
}
```

### Property

```typescript
interface Property {
  id: string;
  organizationId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  imageUrl?: string;
  ownerName: string;
  ownerEmail?: string;
  tenantName?: string;
  leaseEndDate?: string;
  lockboxCode?: string;
  alarmCode?: string;
  accessNotes?: string;
}
```

### Inspection

```typescript
interface Inspection {
  id: string;
  propertyId: string;
  type: 'Move-In' | 'Annual' | 'Move-Out';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
  priority: 'Standard' | 'Urgent';
  scheduledDate: Date;
  scheduledTime: string;
  inspectorId?: string;
  submittedAt?: Date;
  approvedAt?: Date;
  rooms: Room[];
}
```

### Room

```typescript
interface Room {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'pending';
  items: ChecklistItem[];
}
```

### ChecklistItem

```typescript
interface ChecklistItem {
  id: string;
  name: string;
  status: 'pass' | 'fail' | 'na' | 'pending';
  severity?: 'low' | 'medium' | 'high';
  note?: string;
  photos?: string[];
}
```

---

## Known Prototype Limitations

The following items are simulated or not implemented in the V1 prototype:

1. **No Backend** — All data is mocked; no persistence between sessions
2. **No Authentication** — Role switching is client-side only
3. **No File Upload** — Logo/photo uploads are simulated
4. **No Real Maps** — Chicago map is stylized SVG illustration
5. **No Notifications** — Email/push not implemented
6. **No Offline Support** — Sync status is visual only

---

## Future Roadmap (V2 Considerations)

**In-App Messaging** — Contextual comments on checklist items, thread-based discussions, @mentions and notifications

**Mobile Native App** — React Native implementation, offline-first architecture, camera integration, GPS location verification

**Automated Client Billing** — Invoice generation from completed inspections, payment processor integration, automated email delivery

**Advanced Scheduling** — AI-powered route optimization, automatic inspector assignment by proximity, calendar integrations (Google, Outlook)

**Reporting & Analytics** — Custom report builder, trend analysis dashboards, PDF/Excel export, scheduled report delivery

**Integrations** — Property management systems (Yardi, AppFolio), CRM platforms (Salesforce, HubSpot), accounting software (QuickBooks, Xero), cloud storage (Dropbox, Google Drive)

---

## Deployment Notes

### Environment Requirements

- Node.js 18+
- npm or yarn package manager

### Build Commands

```bash
npm install
npm run dev     # Development server
npm run build   # Production build
npm run start   # Production server
```

### Key Dependencies

```json
{
  "next": "^14.x",
  "react": "^18.x",
  "tailwindcss": "^4.x",
  "lucide-react": "latest",
  "recharts": "latest",
  "react-aria-components": "latest",
  "@internationalized/date": "latest"
}
```

---

*Document prepared by Sanel (Product Owner & UI/UX Designer)*
*For engineering implementation by Ben and Dan*
