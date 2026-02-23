# Super Admin Layout - Professional SaaS Dashboard

## 🎨 Overview

A modern, production-ready Super Admin dashboard layout for ArwaPark SaaS platform built with Next.js App Router, TypeScript, and Tailwind CSS.

## ✨ Features

- **Fixed Sidebar** - Collapsible on desktop, slide-over on mobile
- **Professional Topbar** - Search, theme toggle, notifications, user menu
- **Dark/Light Mode** - Full theme support with localStorage persistence
- **Fully Responsive** - Mobile-first design, tablet & desktop optimized
- **Clean SaaS UI** - Inspired by Stripe and Vercel design systems
- **TypeScript** - Full type safety
- **Modern Stack** - Next.js 16, Tailwind CSS, Lucide Icons

## 📁 Structure

```
frontend/
├── app/
│   └── super-admin/
│       ├── layout.tsx              # Route layout wrapper
│       ├── page.tsx                # Dashboard page
│       ├── companies/              # Companies management
│       ├── plans/                  # Plans & subscriptions
│       ├── revenue/                # Revenue analytics
│       ├── users/                  # User management
│       ├── logs/                   # Activity logs
│       ├── system/                 # System health
│       └── settings/               # Super admin settings
│
├── components/
│   └── super-admin/
│       ├── SuperAdminLayout.tsx    # Main layout component
│       ├── SuperAdminSidebar.tsx   # Collapsible sidebar
│       └── SuperAdminTopbar.tsx    # Top navigation bar
│
└── lib/
    └── utils.ts                    # Utility functions (cn)
```

## 🚀 Usage

### Layout Wrapper

The layout automatically:
- Checks authentication
- Validates SUPERADMIN role
- Redirects unauthorized users
- Wraps all super-admin routes

```tsx
// frontend/app/super-admin/layout.tsx
import SuperAdminLayout from '../../components/super-admin/SuperAdminLayout'

export default function Layout({ children }) {
  return <SuperAdminLayout>{children}</SuperAdminLayout>
}
```

### Creating New Pages

Simply create a new folder under `super-admin/`:

```tsx
// frontend/app/super-admin/analytics/page.tsx
export default function AnalyticsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      {/* Your content */}
    </div>
  )
}
```

## 🎯 Menu Items

| Icon | Name | Route | Description |
|------|------|-------|-------------|
| 📊 | Dashboard | `/super-admin` | Overview & metrics |
| 🏢 | Companies | `/super-admin/companies` | Tenant management |
| 👑 | Plans | `/super-admin/plans` | Subscription plans |
| 💰 | Revenue | `/super-admin/revenue` | Financial analytics |
| 👥 | Users | `/super-admin/users` | User management |
| 📋 | Logs | `/super-admin/logs` | Activity logs |
| 🔧 | System | `/super-admin/system` | Health & monitoring |
| ⚙️ | Settings | `/super-admin/settings` | Admin settings |

## 🎨 Styling & Customization

### Colors

The layout uses a purple/indigo theme with automatic dark mode support:

```css
/* Primary Colors */
purple-600  /* Main actions */
indigo-600  /* Accents */
gray-50/900 /* Backgrounds */
```

### Sidebar Customization

```tsx
// components/super-admin/SuperAdminSidebar.tsx
const menuItems: MenuItem[] = [
  { 
    name: 'New Section', 
    href: '/super-admin/new-section', 
    icon: YourIcon 
  },
  // ... add more items
]
```

### Theme Toggle

Automatically persists user preference:
- Click moon/sun icon in topbar
- Saves to localStorage
- Applies dark class to document root

## 🔐 Authentication

The layout enforces security:

```typescript
// Checks performed on mount:
1. Token exists in localStorage
2. Role === 'SUPERADMIN'
3. Redirects if unauthorized
```

## 📱 Responsive Behavior

| Screen | Behavior |
|--------|----------|
| Mobile (< 1024px) | Overlay sidebar, hamburger menu |
| Desktop (≥ 1024px) | Fixed sidebar, collapsible |

### Breakpoints

```css
lg: 1024px  /* Desktop sidebar */
md: 768px   /* Tablet adjustments */
sm: 640px   /* Mobile optimizations */
```

## 🛠️ Components

### SuperAdminLayout

Main wrapper that orchestrates sidebar and topbar:

**Props:** `children: React.ReactNode`

**Features:**
- Authentication guard
- Role validation
- Page title management
- Flexible content area

### SuperAdminSidebar

Collapsible navigation sidebar:

**Features:**
- Desktop collapse toggle
- Mobile slide-over
- Active route highlighting
- Tooltips in collapsed state
- System status indicator

**State:**
- `collapsed` - Desktop collapse state
- `mobileOpen` - Mobile menu visibility

### SuperAdminTopbar

Top navigation bar:

**Features:**
- Global search
- Theme toggle
- Notification bell
- User dropdown menu
- Logout functionality

## 🎭 Dark Mode

Implemented with Tailwind's dark mode:

```typescript
// Toggle function
const toggleTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', newTheme)
  document.documentElement.classList.toggle('dark', newTheme === 'dark')
}
```

## 🚦 Routing

All routes automatically inherit the layout:

```
/super-admin          → Dashboard
/super-admin/companies → Companies page
/super-admin/plans    → Plans page
... etc
```

## 🔧 Utilities

### `cn()` Function

Merges Tailwind classes with clsx:

```typescript
import { cn } from '../../lib/utils'

<div className={cn(
  "base-classes",
  condition && "conditional-classes"
)} />
```

## 📦 Dependencies

```json
{
  "lucide-react": "^0.275.0",  // Icons
  "clsx": "latest",             // Class merging
  "tailwind-merge": "latest"    // Tailwind deduplication
}
```

## 🎯 Best Practices

1. **Keep pages focused** - One responsibility per page
2. **Use loading states** - Show skeletons while data loads
3. **Handle errors** - Display user-friendly error messages
4. **Responsive first** - Test on mobile during development
5. **Accessibility** - Use semantic HTML and ARIA labels

## 🚀 Future Enhancements

- [ ] Breadcrumb navigation
- [ ] Keyboard shortcuts
- [ ] Command palette (⌘K)
- [ ] Favorites/pinned pages
- [ ] Multi-language support
- [ ] Customizable sidebar order

## 📝 Example Page Template

```tsx
"use client"

export default function ExamplePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Page Title
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Description
        </p>
      </div>

      {/* Content Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          {/* Card content */}
        </div>
      </div>
    </div>
  )
}
```

## 🎨 Design Tokens

```css
/* Spacing */
gap: 1rem (16px)
padding: 1.5rem (24px)
margin: 1rem (16px)

/* Shadows */
shadow-sm   /* Subtle */
shadow-lg   /* Cards */
shadow-xl   /* Modals */

/* Borders */
rounded-lg  /* Standard */
rounded-xl  /* Cards */
rounded-full /* Pills */

/* Transitions */
duration-200 /* Fast */
duration-300 /* Standard */
```

---

**Version:** 1.0.0  
**Last Updated:** January 4, 2026  
**Tech Stack:** Next.js 16.1.1, TypeScript, Tailwind CSS  
**Author:** ArwaPark SaaS Team
