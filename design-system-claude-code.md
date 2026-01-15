# UNTITLED UI â€” CLAUDE CODE REFERENCE

> **Purpose:** Concise lookup for AI code generation. Use this alongside `design-system-context.md`.

---

## 1. TAILWIND CONFIG EXTENSION (Required in tailwind.config.ts)

```typescript
// Extend your Tailwind config with these Untitled UI semantic tokens
const config = {
  theme: {
    extend: {
      colors: {
        // Brand (Primary)
        brand: {
          25: '#FCFAFF',
          50: '#F9F5FF',
          100: '#F4EBFF',
          200: '#E9D7FE',
          300: '#D6BBFB',
          400: '#B692F6',
          500: '#9E77ED',
          600: '#7F56D9', // Primary brand
          700: '#6941C6',
          800: '#53389E',
          900: '#42307D',
        },
        // Gray (Neutral)
        gray: {
          25: '#FCFCFD',
          50: '#F9FAFB',
          100: '#F2F4F7',
          200: '#EAECF0',
          300: '#D0D5DD',
          400: '#98A2B3',
          500: '#667085',
          600: '#475467',
          700: '#344054',
          800: '#182230',
          900: '#101828',
          950: '#0C111D',
        },
        // Semantic States
        error: {
          25: '#FFFBFA',
          50: '#FEF3F2',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
        },
        warning: {
          25: '#FFFCF5',
          50: '#FFFAEB',
          500: '#F79009',
          600: '#DC6803',
          700: '#B54708',
        },
        success: {
          25: '#F6FEF9',
          50: '#ECFDF3',
          500: '#12B76A',
          600: '#039855',
          700: '#027A48',
        },
      },
      // Semantic Text Colors (use these, not raw grays)
      textColor: {
        primary: '#101828',      // gray-900 â€” headings, strong text
        secondary: '#344054',    // gray-700 â€” body text
        tertiary: '#475467',     // gray-600 â€” supporting text
        quaternary: '#667085',   // gray-500 â€” placeholders
        disabled: '#98A2B3',     // gray-400
        placeholder: '#667085',
        'brand-primary': '#7F56D9',
        'error-primary': '#D92D20',
      },
      // Semantic Border Colors
      borderColor: {
        primary: '#D0D5DD',      // gray-300 â€” default borders
        secondary: '#EAECF0',    // gray-200 â€” subtle borders (cards, dividers)
        tertiary: '#F2F4F7',     // gray-100 â€” very subtle
        brand: '#7F56D9',
        error: '#FDA29B',
      },
      // Semantic Background Colors
      backgroundColor: {
        primary: '#FFFFFF',
        'primary-hover': '#F9FAFB',
        secondary: '#F9FAFB',    // gray-50
        tertiary: '#F2F4F7',     // gray-100
        'brand-solid': '#7F56D9',
        'brand-solid-hover': '#6941C6',
        'error-primary': '#FEF3F2',
        'success-primary': '#ECFDF3',
        'warning-primary': '#FFFAEB',
      },
      // Shadows
      boxShadow: {
        xs: '0px 1px 2px rgba(16, 24, 40, 0.05)',
        sm: '0px 1px 3px rgba(16, 24, 40, 0.1), 0px 1px 2px rgba(16, 24, 40, 0.06)',
        md: '0px 4px 8px -2px rgba(16, 24, 40, 0.1), 0px 2px 4px -2px rgba(16, 24, 40, 0.06)',
        lg: '0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)',
        xl: '0px 20px 24px -4px rgba(16, 24, 40, 0.08), 0px 8px 8px -4px rgba(16, 24, 40, 0.03)',
      },
      // Border Radius
      borderRadius: {
        none: '0px',
        xxs: '2px',
        xs: '4px',
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px',
        '2xl': '16px',
        '3xl': '20px',
        full: '9999px',
      },
      // Spacing (uses default Tailwind 4px scale)
      spacing: {
        // Untitled UI uses standard Tailwind spacing
        // Key values: 1=4px, 2=8px, 3=12px, 4=16px, 5=20px, 6=24px
      },
      // Font Family
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      // Font Sizes (Display scale for headings)
      fontSize: {
        'display-2xl': ['4.5rem', { lineHeight: '5.625rem', letterSpacing: '-0.02em' }],
        'display-xl': ['3.75rem', { lineHeight: '4.5rem', letterSpacing: '-0.02em' }],
        'display-lg': ['3rem', { lineHeight: '3.75rem', letterSpacing: '-0.02em' }],
        'display-md': ['2.25rem', { lineHeight: '2.75rem', letterSpacing: '-0.02em' }],
        'display-sm': ['1.875rem', { lineHeight: '2.375rem' }],
        'display-xs': ['1.5rem', { lineHeight: '2rem' }],
      },
    },
  },
};
```

---

## 2. COMPONENT API QUICK REFERENCE

### Button
```tsx
import { Button } from "@/components/base/button";

<Button 
  variant="primary" | "secondary" | "tertiary" | "link" | "destructive"
  size="sm" | "md" | "lg" | "xl" | "2xl"
  iconLeading={LucideIcon}
  iconTrailing={LucideIcon}
  disabled={boolean}
  loading={boolean}
>
  Label
</Button>
```

### Input
```tsx
import { Input } from "@/components/base/input";

<Input
  size="sm" | "md"
  destructive={boolean}
  iconLeading={LucideIcon}
  iconTrailing={LucideIcon}
  placeholder="Enter value..."
/>
```

### Select (Dropdown)
```tsx
import { Select } from "@/components/base/select";

<Select defaultValue="option1">
  <Select.Trigger placeholder="Select..." />
  <Select.Content>
    <Select.Item value="option1">Option 1</Select.Item>
    <Select.Item value="option2">Option 2</Select.Item>
  </Select.Content>
</Select>
```

### Checkbox
```tsx
import { Checkbox } from "@/components/base/checkbox";

<Checkbox size="sm" | "md" checked={boolean} onChange={fn}>
  <Checkbox.Indicator />
  <Checkbox.Label>Label text</Checkbox.Label>
  <Checkbox.Description>Supporting text</Checkbox.Description>
</Checkbox>
```

### Badge
```tsx
import { Badge } from "@/components/base/badge";

<Badge 
  variant="gray" | "brand" | "error" | "warning" | "success"
  size="sm" | "md" | "lg"
  iconLeading={LucideIcon}
>
  Label
</Badge>
```

### Modal / Dialog
```tsx
import { Modal } from "@/components/base/modal";

<Modal>
  <Modal.Trigger asChild>
    <Button>Open</Button>
  </Modal.Trigger>
  <Modal.Content size="sm" | "md" | "lg" | "xl">
    <Modal.Header>
      <Modal.Title>Title</Modal.Title>
      <Modal.Description>Description</Modal.Description>
    </Modal.Header>
    <Modal.Body>{/* Content */}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary">Cancel</Button>
      <Button variant="primary">Confirm</Button>
    </Modal.Footer>
  </Modal.Content>
</Modal>
```

### Avatar
```tsx
import { Avatar } from "@/components/base/avatar";

<Avatar size="xs" | "sm" | "md" | "lg" | "xl" | "2xl">
  <Avatar.Image src="/photo.jpg" alt="Name" />
  <Avatar.Fallback>JD</Avatar.Fallback>
</Avatar>
```

### Table
```tsx
import { Table } from "@/components/base/table";

<Table>
  <Table.Header>
    <Table.Row>
      <Table.HeaderCell>Name</Table.HeaderCell>
      <Table.HeaderCell>Status</Table.HeaderCell>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>John Doe</Table.Cell>
      <Table.Cell><Badge variant="success">Active</Badge></Table.Cell>
    </Table.Row>
  </Table.Body>
</Table>
```

### Tabs
```tsx
import { Tabs } from "@/components/base/tabs";

<Tabs defaultValue="tab1">
  <Tabs.List>
    <Tabs.Trigger value="tab1">Tab 1</Tabs.Trigger>
    <Tabs.Trigger value="tab2">Tab 2</Tabs.Trigger>
  </Tabs.List>
  <Tabs.Content value="tab1">Content 1</Tabs.Content>
  <Tabs.Content value="tab2">Content 2</Tabs.Content>
</Tabs>
```

### Toggle
```tsx
import { Toggle } from "@/components/base/toggle";

<Toggle size="sm" | "md" checked={boolean} onChange={fn} />
```

---

## 3. COMMON PATTERNS

### Card (No Component â€” Use Utilities)
```tsx
<div className="bg-white border border-secondary rounded-xl shadow-xs p-5">
  {/* Card content */}
</div>
```

### Form Field with Label + Hint
```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-sm font-medium text-secondary">Field Label</label>
  <Input placeholder="Enter value..." />
  <p className="text-sm text-tertiary">This is a hint text.</p>
</div>
```

### Section Header
```tsx
<div className="flex items-center justify-between pb-5 border-b border-secondary">
  <div>
    <h2 className="text-lg font-semibold text-primary">Section Title</h2>
    <p className="text-sm text-tertiary">Supporting description text</p>
  </div>
  <Button size="sm" iconLeading={Plus}>Add New</Button>
</div>
```

### Empty State
```tsx
<div className="flex flex-col items-center justify-center py-12 text-center">
  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
    <FolderIcon className="w-6 h-6 text-gray-400" />
  </div>
  <h3 className="text-md font-semibold text-primary mb-1">No items yet</h3>
  <p className="text-sm text-tertiary mb-4">Get started by creating your first item.</p>
  <Button size="sm">Create Item</Button>
</div>
```

### Status Badge Patterns
```tsx
// Completed / Success
<Badge variant="success" size="sm" iconLeading={CheckCircle}>Complete</Badge>

// In Progress / Warning  
<Badge variant="warning" size="sm" iconLeading={Clock}>In Progress</Badge>

// Error / Blocked
<Badge variant="error" size="sm" iconLeading={AlertCircle}>Blocked</Badge>

// Neutral / Default
<Badge variant="gray" size="sm">Draft</Badge>
```

---

## 4. UTILITY DEPENDENCIES

### cx() â€” Classname Merger
```typescript
// Required utility â€” use in every component
// Located at: @/utils/cx.ts

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cx(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### Required NPM Packages
```json
{
  "dependencies": {
    "react-aria-components": "^1.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x",
    "lucide-react": "^0.x"
  }
}
```

---

## 5. MOBILE-FIRST BREAKPOINTS

```typescript
// Tailwind breakpoints (use for responsive)
sm: '640px'   // Large phones landscape
md: '768px'   // Tablets
lg: '1024px'  // Small laptops
xl: '1280px'  // Desktops

// Pattern: Mobile-first, stack vertically, then go horizontal
<div className="flex flex-col gap-4 md:flex-row md:items-center">
```

---

## 6. FOCUS & INTERACTION STATES

```typescript
// Focus ring pattern (accessibility)
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"

// Hover pattern
"hover:bg-gray-50"

// Disabled pattern  
"disabled:opacity-50 disabled:cursor-not-allowed"

// Active/Selected pattern
"data-[state=active]:bg-gray-50 data-[state=active]:text-brand-700"
```

---

## 7. ICON USAGE (Lucide)

```tsx
import { 
  Plus, 
  Check, 
  X, 
  ChevronDown, 
  ChevronRight,
  Search,
  Upload,
  Camera,
  AlertCircle,
  CheckCircle,
  Clock,
  Trash2,
  Edit2,
  MoreVertical,
  ArrowLeft,
  ArrowRight,
  Home,
  Settings,
  User,
  Building2,
  MapPin,
  Calendar,
  FileText,
  Image as ImageIcon,
} from "lucide-react";

// Standard icon sizes
// In buttons/inputs: w-5 h-5 (20px)
// In badges: w-3 h-3 (12px) for sm, w-4 h-4 (16px) for md
// Standalone: w-6 h-6 (24px)
```

---

## 8. DO NOT DO (Anti-patterns)

âŒ **Don't** use raw Tailwind colors (`bg-slate-100`) â€” use semantic tokens (`bg-secondary`)
âŒ **Don't** create custom Card components â€” use utility pattern
âŒ **Don't** use `shadow-md` or larger on cards â€” use `shadow-xs`
âŒ **Don't** use `rounded-2xl` on inputs/buttons â€” use `rounded-lg` (8px)
âŒ **Don't** use custom CSS if Tailwind utility exists
âŒ **Don't** skip the `cx()` utility for conditional classes