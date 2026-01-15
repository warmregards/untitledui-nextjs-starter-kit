# Coreverus

**Property Inspection SaaS Platform**

A modern Next.js 14 application for managing property inspections with role-based access control for Admins and Inspectors.

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + Untitled UI Design System |
| Components | React Aria Components |
| Icons | Lucide React |
| Charts | Recharts |
| Map Integration | Static / CSS Grid Split-View |

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── (auth)/              # Authentication pages (login, signup, invite)
│   ├── (dashboard)/         # Protected routes
│   │   ├── dashboard/       # Main dashboard (role-specific views)
│   │   ├── inspections/     # Inspection list and detail pages
│   │   ├── properties/      # Property list and detail pages
│   │   └── settings/        # User and organization settings
│   └── layout.tsx           # Root layout
├── components/
│   ├── application/         # Complex application components
│   ├── base/                # Base UI components (buttons, inputs, etc.)
│   ├── features/            # Feature-specific components
│   ├── onboarding/          # Onboarding wizard components
│   └── ui/                  # Reusable UI primitives
├── contexts/                # React context providers
├── data/                    # Centralized mock data
├── types/                   # TypeScript type definitions
└── utils/                   # Utility functions
```

## Key Features

### Role-Based Access Control
- **Admin View:** Full dashboard with analytics, team management, and approval workflows
- **Inspector View:** Optimized mobile-first interface with today's schedule, route planning, and quick actions

### Dashboard
- Real-time statistics and KPIs
- Inspection trend charts (7-day / 30-day views)
- Pending approval queue with one-click review
- Top inspectors leaderboard

### Inspections Management
- List view with filtering by status, type, and date
- Split-view map interface for geographic context
- Detailed inspection reports with photo documentation
- Status workflow: Scheduled → In Progress → Completed

### Properties
- Property portfolio management
- Owner and tenant information tracking
- Access codes and entry instructions (inspector-only)
- Inspection history timeline

### Additional Features
- Offline-ready UI indicators
- Strict TypeScript typing throughout
- Responsive design (mobile, tablet, desktop)
- Dark mode support via CSS variables

## Type Definitions

Core types are defined in `src/types/index.ts`:

```typescript
// User roles
type UserRole = 'admin' | 'inspector';

// Inspection workflow
type InspectionStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
type InspectionType = 'Move-In' | 'Annual' | 'Move-Out';
type PriorityLevel = 'Standard' | 'Urgent';

// Core entities
interface User { id, email, fullName, role, avatar? }
interface Property { id, address, city, state, zip, ownerName, tenantName?, ... }
interface Inspection { id, propertyId, inspectorId?, type, status, scheduledDate, ... }
```

## Mock Data

Centralized mock data is available in `src/data/mock-data.ts`:

- `USERS` - User accounts (admin + inspectors)
- `PROPERTIES` - Property portfolio
- `INSPECTIONS` - Inspection records
- Helper functions: `formatDate()`, `formatTime()`, `getPropertyById()`

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

## License

Private - All rights reserved.
