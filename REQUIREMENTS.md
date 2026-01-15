# Coreverus V1 - Product Requirements & Architecture

> **Version:** 1.0
> **Last Updated:** January 2026
> **Status:** Prototype Complete

---

## 1. Product Overview

### Mission Statement
Coreverus is a dual-role platform designed to streamline property inspection workflows for property management companies. The platform bridges the gap between office operations (scheduling, client reporting, team management) and field execution (site access, data collection, issue documentation).

### Core Roles

#### Admin (The Dispatcher/Owner)
The administrative user responsible for business operations:
- **Asset Management:** Maintain property portfolios with owner/tenant data
- **Team Operations:** Assign inspectors, monitor workload, review submissions
- **Client Reporting:** Approve inspection reports, manage document delivery
- **Business Configuration:** Templates, billing, company branding

#### Inspector (The Field Agent)
The mobile workforce executing inspections:
- **Route Logistics:** Optimized daily schedule with drive time estimates
- **Site Access:** Quick access to lockbox codes, alarm codes, entry instructions
- **Data Collection:** Checklist completion, photo documentation, issue flagging
- **Report Submission:** Draft management, submission for approval

---

## 2. Tech Stack & UI Standards

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

### Visual Language

#### Color System
- **Primary Brand:** Purple (#7F56D9) - Used for CTAs, active states, progress indicators
- **Success:** Green (#17B26A) - Completed items, positive feedback
- **Warning:** Amber (#F79009) - Pending reviews, attention required
- **Error:** Red (#F04438) - Failed items, critical issues
- **Neutral:** Gray scale for text hierarchy (primary, secondary, tertiary)

#### Status Badge Pattern
Consistent circular badge system across all modules:
```
[Icon] + [Label]
├── Scheduled: Blue-50 bg + Blue-600 text + Clock icon
├── In Progress: Amber-50 bg + Amber-600 text + PlayCircle icon
├── Completed: Green-50 bg + Green-600 text + CheckCircle icon
└── Cancelled: Gray-100 bg + Gray-500 text + XCircle icon
```

#### Urgency Indicator
High-priority items use a dedicated pattern:
- **Style:** Orange chip with Zap icon
- **Placement:** Top-right of cards, inline with status in tables
- **Colors:** Orange-50 background, Orange-700 text, Orange-200 border

#### Header Patterns
- **Gallery Style (Detail Pages):** Large banner image with overlaid controls, clean info bar below
- **Standard (List Pages):** Title + description + primary action button aligned right

#### Card Patterns
- **Standard Card:** White background, subtle ring border, shadow-xs, rounded-xl
- **Highlighted Card:** Brand-50 background with Brand-200 ring (active/in-progress items)
- **Warning Card:** Amber-50 background with Amber-200 border (action required)

---

## 3. Feature Specifications (By Module)

### A. Authentication & Onboarding

#### Admin Signup Flow (`/sign-up`)
**Purpose:** New business owner creating an organization account

**Form Fields:**
1. Full Name (required)
2. Company Name (required) - Creates organization identity
3. Work Email (required)
4. Password (required, min 8 characters)

**Header Copy:** "Start your 14-day free trial"

**Post-Registration:** Triggers Admin Onboarding Wizard

#### Admin Onboarding Wizard
**Trigger:** `user.isNewAdmin === true` on first dashboard load

**Step 1 - Branding:**
- Title: "Let's set up your workspace"
- Action: Upload company logo (drag & drop zone)
- Options: "Skip for now" or "Continue"

**Step 2 - Team Invitation:**
- Title: "Invite your team"
- Action: Enter inspector email address
- Options: "Back", "Send Invite & Finish" or "Skip & Finish"

#### Inspector Signup Flow (`/accept-invite`)
**Purpose:** Team member joining via email invitation

**Context Display:**
- Company logo/avatar
- Heading: "Join [Company Name] on Coreverus"
- Subtext: "You have been invited by [Inviter Name] to join as an Inspector"

**Form Fields:**
1. Full Name (required)
2. Create Password (required)
3. Confirm Password (required, with match validation)

**CTA:** "Join Team"

#### Sign In (`/sign-in`)
Standard email/password authentication with "Forgot Password" link.

#### Forgot Password (`/forgot-password`)
Email-based password reset flow.

---

### B. Global Navigation

#### Dashboard Layout
**Desktop:** Fixed 64px sidebar + flexible content area
**Mobile:** Collapsible drawer with hamburger trigger

#### Header Bar (Global)
**Position:** Fixed top, spans content area (not sidebar)

**Components (Right-aligned):**
1. **Sync Status Widget**
   - Online state: Green CloudCheck icon + "Online • Synced"
   - Styling: Pill button with border, white background

2. **Weather Widget**
   - Format: "[City], [State] • [Temp]°F • [Condition]"
   - Icon: Sun/Cloud based on condition
   - Styling: Gray-100 pill background

3. **User Avatar**
   - Links to profile/settings
   - Shows initials fallback if no image

#### Sidebar Navigation
**Logo Area:** Company name with Building2 icon

**Role-Aware Navigation:**

| Route | Admin | Inspector |
|-------|-------|-----------|
| Dashboard | ✓ | ✓ |
| Inspections | ✓ | ✓ (filtered to assigned) |
| Properties | ✓ | ✓ (restricted view) |
| Settings | ✓ (full) | ✓ (limited tabs) |

**Footer Section:**
1. Role Switcher (development feature for testing)
2. User Profile card with avatar, name, email

---

### C. The Dashboard

#### Admin Dashboard View

**Header:**
- Title: "Dashboard"
- Subtitle: "Overview of your inspection operations"
- Actions: Date Range picker, Export button

**KPI Stats Grid (4 columns):**
1. **Total Inspections** - All time count with trend indicator
2. **In Progress** - Active inspections count
3. **Scheduled Today** - Today's workload
4. **Pending Reviews** - Warning variant, requires action

**Inspection Trends Chart:**
- Type: Dual-line chart (Scheduled vs Completed)
- Time Toggle: 7 Days / 30 Days
- Library: Recharts with custom tooltip

**Secondary Metrics Row:**
1. **Inspection Mix** - Donut chart by type (Move-In, Annual, Move-Out)
2. **Top Inspectors Leaderboard** - Bar chart with avatars, inspection counts

**Action Required Section:**
- Title: "Pending Approvals"
- List: Inspector submissions awaiting review
- Each item shows: Address, Inspector, Issue count, Time submitted, Review button

#### Inspector Dashboard View

**Header:**
- Personalized greeting: "Good [Morning/Afternoon/Evening], [Name]"
- Subtitle: "Here's your schedule for today"

**KPI Stats Grid (3 columns):**
1. **Today's Schedule** - Job count
2. **In Progress** - Active inspection
3. **Completed** - Monthly total with trend

**Main Content (3-column grid):**

**Column 1 - Today's Schedule:**
- Chronological list of scheduled inspections
- Each card shows: Time, Address, City, Type badge
- Active inspection highlighted with brand colors
- Actions: "Start" or "Resume" buttons

**Column 2 - Route Map:**
- Stylized SVG map with numbered stop markers
- Dotted route line connecting stops
- Bottom overlay: "Est. Drive Time: X hours"

**Column 3 - Sidebar Stack:**
1. **My Drafts** - Incomplete reports with progress bars
2. **Manager Feedback** - Recent approval/change request notifications
3. **Quick Actions** - Navigation shortcuts

---

### D. Inspections Module

#### List View (`/inspections`)

**Header:**
- Admin: "Inspections" + "Schedule Inspection" button
- Inspector: "My Inspections" (no create button)

**Toolbar:**
- Search input (filters by address)
- Status dropdown filter (All, Completed, Scheduled, In Progress, Cancelled)
- Date Range button (placeholder)
- Clear filters link (when filters active)

**Results Count:** "Showing X of Y inspections"

#### Elastic Split-View Layout
**Concept:** Airbnb-style toggle between table-focused and map-focused views

**Collapsed Map State (Default):**
- Table: 9 columns / Map: 3 columns
- Full data table visible with all columns
- Mini map with pins in sidebar

**Expanded Map State:**
- Table: 3 columns / Map: 9 columns
- Compact card list replaces table
- Full map with legend, inspector panel

**Toggle Button:** Maximize2/Minimize2 icons with "Expand Map"/"Collapse" labels

#### Map Panel (Chicago-themed)

**Visual Elements:**
- SVG-based stylized city grid
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
- Expand/Collapse button (top-left)
- Location card "Chicago Loop - X locations" (top-right, compact mode)
- Legend panel (bottom-left, expanded mode)
- Inspectors panel with availability (top-right, expanded mode)

**Z-Index Fix:**
When modals open, map controls receive `invisible` class to prevent bleed-through.

#### Data Table (Admin View)

**Columns:**
1. Property (Address + City/State, clickable)
2. Inspector (Avatar + Name, or "Assign" button)
3. Type (Move-In, Annual, Move-Out badge)
4. Status (Color-coded badge + Urgent indicator)
5. Date
6. Action (View button)

#### Data Table (Inspector View)

**Columns:**
1. Property (Address + City/State)
2. Type
3. Status (with Urgent indicator)
4. Date
5. Action (Start/Resume/View based on status)

#### Compact Card List (Expanded Map Mode)

**Card Structure:**
- Urgent badge (top-right if applicable)
- Address (bold)
- Date with Calendar icon
- Inspector (avatar + name) or "Assign Inspector" link
- Status indicator (circular icon)

#### Assign Inspector Modal

**Trigger:** Click "Assign" button on unassigned inspection

**Header:**
- Title: "Assign Inspector"
- Subtitle: Property address

**Search:** Filter inspectors by name

**Inspector List:**
Each option shows:
- Avatar + Name
- Availability badge (Available/Busy)
- Distance from property
- Jobs scheduled today

**Smart Assignment Context:** Helps dispatcher make informed decisions based on proximity and workload.

#### Create Inspection Sheet

**Trigger:** "Schedule Inspection" button (Admin only)

**Type:** Slide-in sheet from right

**Form Sections:**

1. **Property Selection**
   - Searchable dropdown of existing properties
   - Shows address preview when selected

2. **Inspection Details**
   - Type: Move-In, Annual, Move-Out (radio group)
   - Priority: Standard, Urgent (radio group)
   - Date: Custom DatePicker component
   - Time: Custom TimePicker component

3. **Assignment (Optional)**
   - Inspector dropdown
   - Can leave unassigned for later

**Actions:** Cancel, Schedule Inspection

#### Inspection Detail Page (`/inspections/[id]`)

**Header Section:**
- Breadcrumb: "Back to Inspections"
- Address (large) + Status badge
- Property meta: Type badge, sqft, year built, date
- Action buttons (role-specific)

##### Admin View

**Action Buttons:**
- Print Report
- Request Changes
- Approve Inspection

**Alert Banner:**
"Approval Requested" - Shows inspector name, submission time, issue count

**Summary Cards (3 columns):**
1. Progress percentage with bar
2. Issues Found (warning style, clickable)
3. Photos Uploaded count

**Room Checklist Accordion:**
- Expandable by room (Kitchen, Living Room, etc.)
- Each room shows: Status icon, name, issue count, item count
- Failed rooms default to expanded
- Items within show: Pass/Fail icon, name, notes, evidence photos

**Sidebar:**
1. Property Hero Card (image + "View Gallery" button)
2. Map Card (location preview)
3. Assigned Inspector Card (avatar, name, message button)
4. Activity Timeline (chronological event log)

##### Inspector View

**Action Buttons:**
- Save Draft
- Submit Report

**Room Checklist (Editable):**
- Segmented control per item: Pass / Fail / N/A
- Fail triggers defect form:
  - Severity: Low / Medium / High
  - Description textarea
  - Evidence photos upload zone

**Sidebar:**
1. Property Hero Card
2. **Access Information Card** (Inspector-specific)
   - Lockbox Code (with copy functionality)
   - Alarm Code (with copy functionality)
3. Map Card
4. Activity Timeline

#### Submit Report Modal (Inspector)

**Trigger:** "Submit Report" button

**Content:**
- Icon: Send in brand-colored circle
- Title: "Submit Inspection Report?"
- Summary: "X High Severity Issues found"
- Note: "This report will be sent to [Manager Name] for final approval"

**Actions:**
- "Go Back" (secondary)
- "Submit for Approval" (primary)

#### Approve Modal (Admin)

**Content:**
- Icon: CheckCircle in success-colored circle
- Title: "Approve Inspection"
- Description: Confirmation message about finalizing report

**Actions:** Cancel, Approve

#### Request Changes Modal (Admin)

**Content:**
- Icon: RotateCcw in amber-colored circle
- Title: "Request Changes"
- Description: "What needs to be fixed?"
- Textarea for feedback message

**Actions:** Cancel, Send Request

#### Gallery Modal

**Trigger:** "View Gallery" button on property card

**Content:**
- Header: "Media Gallery" + photo count + "Upload Photos" button
- Grid: 3-4 column responsive image grid
- Interaction: Click to expand (placeholder)

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
- Property cards with:
  - Image thumbnail
  - Address + city
  - Property type badge
  - Quick stats (beds, baths, sqft)
  - Last inspection date

**List View (Admin):**
- Table format with sortable columns
- Additional data columns visible

#### Property Detail Page (`/properties/[id]`)

##### Admin View - Full Access

**Header:**
- Gallery banner image
- Address overlay
- Action buttons: Edit Property, Schedule Inspection

**Info Bar:**
- Property type, Beds, Baths, Sqft, Year Built

**Tab Navigation:**
1. **Overview Tab**
   - Property description
   - Owner Information card (name, email, phone)
   - Tenant Information card (name, lease dates)
   - Recent inspections list

2. **Inspections Tab**
   - Complete inspection history
   - Status, date, inspector for each
   - Link to detail pages

3. **Documents Tab**
   - Document library (lease, photos, reports)
   - Upload functionality
   - Download/preview actions

4. **Financials Tab** (Admin-only)
   - Revenue tracking
   - Billing history

##### Inspector View - Restricted Access

**Visible Elements:**
- Property image and basic info
- Address and directions

**Access Information Card (Prominent):**
- Lockbox/Entry Code with copy button
- Alarm Code with copy button
- Access Notes (e.g., "Dog in yard. Ring doorbell first.")
- Visual: Amber background to draw attention

**Actions:**
- "Get Directions" - Opens in Waze/Maps
- "Copy Codes" - Clipboard functionality
- "Report Access Issue" - Flag problems

**Hidden from Inspector:**
- Owner contact information
- Tenant personal details
- Financial data
- Document library

#### Property Form Modal

**Trigger:** "Add Property" or "Edit Property" buttons

**Form Sections:**

1. **Asset Details**
   - Street Address (required)
   - City (required)
   - State
   - Zip Code
   - Property Image URL

2. **People**
   - Owner Name (required)
   - Owner Email
   - Tenant Name
   - Lease End Date (DatePicker)

3. **Access Information** (Amber highlighted section)
   - Lockbox / Entry Code
   - Alarm Code
   - Access Notes (textarea)

**Validation:** Address, City, and Owner Name required

**Actions:** Cancel, Add Property / Save Changes

---

### F. Settings Module

#### Settings Page (`/settings`)

**Layout:** Vertical tab navigation on left, content area on right

##### Admin Tabs

1. **Profile Tab**
   - Company logo upload
   - Company name
   - Admin contact information
   - Save Changes button

2. **Team Tab**
   - Team member list with:
     - Avatar, Name, Email
     - Role badge (Admin/Inspector)
     - Status indicator
     - Remove button
   - "Invite Member" button

3. **Templates Tab**
   - Template library display:
     - Standard Residential (85 items)
     - Commercial Safety (62 items)
     - HUD Section 8 (94 items)
   - Actions per template: Edit, Duplicate, Delete
   - "New Template" button
   - "Browse Library" button

4. **Billing Tab**
   - Current plan display
   - Payment method
   - Invoice history
   - Upgrade options

5. **Notifications Tab**
   - Email notification preferences
   - Push notification settings
   - Digest frequency options

##### Inspector Tabs

1. **Profile Tab**
   - Personal information
   - Avatar upload
   - Contact details

2. **Availability Tab**
   - Working hours configuration
   - Start Time (TimePicker)
   - End Time (TimePicker)
   - Working days checkboxes
   - Save button

3. **App Settings Tab**
   - Device storage management
   - Offline mode preferences
   - Photo quality settings

#### Invite Member Modal

**Trigger:** "Invite Member" button in Team tab

**Form:**
- Email Address input
- Role dropdown (Admin, Inspector)

**Actions:** Cancel, Send Invite

#### New Template Modal

**Trigger:** "New Template" button in Templates tab

**Form:**
- Template Name input
- Description textarea
- Starting point options:
  - Start from Scratch
  - Import Existing (file upload)

**Actions:** Cancel, Create Template

#### Edit Checklist Modal

**Trigger:** Edit button on template

**Content:**
- Checklist item list with:
  - Item name
  - Remove button per item
- "Add Item" button with input field

**Actions:** Cancel, Save Changes

#### Template Library Modal

**Trigger:** "Browse Library" button

**Content:**
- Grid of template cards:
  - Template name
  - Description
  - Item count
  - "Use Template" button

**Templates Available:**
- Standard Residential (85 items)
- Commercial Safety (62 items)
- HUD Section 8 (94 items)

---

## 4. Critical User Flows

### Flow 1: Admin Schedules New Inspection

```
1. Admin clicks "Schedule Inspection" on Inspections page
2. Create Inspection Sheet slides in from right
3. Admin selects property from dropdown
4. Admin chooses inspection type (Move-In/Annual/Move-Out)
5. Admin sets priority (Standard/Urgent)
6. Admin picks date using DatePicker
7. Admin picks time using TimePicker
8. Admin optionally assigns inspector
9. Admin clicks "Schedule Inspection"
10. Sheet closes, inspection appears in list
```

### Flow 2: Admin Assigns Inspector

```
1. Admin sees unassigned inspection in list
2. Admin clicks "Assign" button
3. Assign Inspector Modal opens
4. Modal shows available inspectors with:
   - Distance from property
   - Current daily workload
   - Availability status
5. Admin selects appropriate inspector
6. Modal closes, inspection updated
7. Inspector receives notification (future)
```

### Flow 3: Inspector Completes Inspection

```
1. Inspector views Dashboard
2. Inspector sees today's schedule
3. Inspector clicks "Start" on first job
4. Inspection detail page loads
5. Inspector reviews Access Information
6. Inspector works through room checklist:
   - Marks items Pass/Fail/N/A
   - Adds notes for failed items
   - Uploads evidence photos
7. Inspector clicks "Save Draft" periodically
8. When complete, Inspector clicks "Submit Report"
9. Submit Modal shows issue summary
10. Inspector confirms submission
11. Report sent to Admin for approval
```

### Flow 4: Admin Reviews and Approves

```
1. Admin sees "Pending Approvals" on Dashboard
2. Admin clicks "Review" on submission
3. Inspection detail page loads
4. Admin reviews:
   - Issue summary cards
   - Room-by-room findings
   - Evidence photos
5. Option A - Approve:
   - Admin clicks "Approve Inspection"
   - Confirmation modal appears
   - Admin confirms
   - Status changes to Completed
6. Option B - Request Changes:
   - Admin clicks "Request Changes"
   - Feedback modal appears
   - Admin enters required changes
   - Inspection returns to Inspector
```

### Flow 5: Sync Status Indication

```
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
```

### Flow 6: New Team Member Onboarding

```
1. Admin goes to Settings > Team
2. Admin clicks "Invite Member"
3. Modal opens with email + role fields
4. Admin enters inspector email
5. Admin selects "Inspector" role
6. Admin clicks "Send Invite"
7. Inspector receives email with invite link
8. Inspector clicks link, lands on /accept-invite
9. Page shows company info + inviter name
10. Inspector creates account (name + password)
11. Inspector clicks "Join Team"
12. Inspector redirected to their Dashboard
```

---

## 5. Component Library Reference

### Custom UI Components

| Component | Location | Purpose |
|-----------|----------|---------|
| DatePicker | `/components/ui/date-picker.tsx` | Calendar-based date selection |
| TimePicker | `/components/ui/time-picker.tsx` | 12-hour time selection with AM/PM |
| AdminWizard | `/components/onboarding/admin-wizard.tsx` | First-run setup flow |
| CreateInspectionSheet | `/components/features/inspections/` | Slide-in form for scheduling |
| PropertyFormModal | `/components/features/properties/` | Add/Edit property form |

### Base Components (Untitled UI)

| Component | Purpose |
|-----------|---------|
| Button | Primary, Secondary, Tertiary variants |
| Input | Text input with icon support |
| Badge | Status indicators |
| Avatar | User/company images with fallback |
| Table | Data tables with sorting |

---

## 6. Data Models (Conceptual)

### User
```typescript
interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'inspector';
  avatar?: string;
  organizationId: string;
  isNewAdmin?: boolean; // Triggers onboarding
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

## 7. Future Roadmap (V2 Considerations)

### In-App Messaging
- Contextual comments on checklist items
- Thread-based discussions between Admin and Inspector
- @mentions and notifications

### Mobile Native App
- React Native implementation
- Offline-first architecture
- Camera integration for photos
- GPS for location verification

### Automated Client Billing
- Generate invoices from completed inspections
- Integration with payment processors
- Automated email delivery to property owners

### Advanced Scheduling
- AI-powered route optimization
- Automatic inspector assignment based on proximity
- Calendar integrations (Google, Outlook)

### Reporting & Analytics
- Custom report builder
- Trend analysis dashboards
- Export to PDF/Excel
- Scheduled report delivery

### Integrations
- Property management systems (Yardi, AppFolio)
- CRM platforms (Salesforce, HubSpot)
- Accounting software (QuickBooks, Xero)
- Cloud storage (Dropbox, Google Drive)

---

## 8. Testing Checklist

### Role Switching
- [ ] Toggle between Admin and Inspector views via sidebar
- [ ] Verify correct navigation items per role
- [ ] Verify correct dashboard view per role
- [ ] Verify property detail restrictions for Inspector

### Authentication Flows
- [ ] Admin signup creates organization
- [ ] Inspector accept-invite joins existing org
- [ ] Onboarding wizard appears for new admin

### Inspection Workflows
- [ ] Schedule new inspection (Admin)
- [ ] Assign inspector to inspection
- [ ] Start/Resume inspection (Inspector)
- [ ] Submit inspection for review
- [ ] Approve or request changes (Admin)

### UI Interactions
- [ ] Map expand/collapse animation
- [ ] Modal z-index handling (map controls hide)
- [ ] DatePicker calendar navigation
- [ ] TimePicker hour/minute/period selection
- [ ] Form validations and error states

---

## 9. Known Limitations (Prototype)

1. **No Backend:** All data is mocked; no persistence
2. **No Authentication:** Role switching is client-side only
3. **No File Upload:** Logo/photo uploads are simulated
4. **No Real Maps:** Chicago map is stylized SVG
5. **No Notifications:** Email/push not implemented
6. **No Offline Support:** Sync status is visual only

---

## 10. Deployment Notes

### Environment
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

*Document generated for Coreverus V1 Prototype*
*For questions or clarifications, refer to the codebase or contact the development team.*
