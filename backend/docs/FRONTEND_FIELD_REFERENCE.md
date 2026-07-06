# FRONTEND_FIELD_REFERENCE.md

# 1. Application Overview

## Purpose

This document serves as the **single source of truth** for the RepoLens frontend implementation.

Unlike `FRONTEND_API_CONTRACT.md`, which defines how the frontend communicates with the backend, this document defines **how backend data is mapped to frontend pages, components, interactions, and user experience**.

The goal is to eliminate frontend/backend mismatches and allow the frontend to be developed without reading backend code.

---

# Project Overview

RepoLens is an AI-powered repository intelligence platform that enables users to upload source code repositories, analyze their structure, inspect repository insights, browse source files, and interact with an AI assistant capable of answering repository-specific questions.

The application follows a modern SaaS dashboard architecture with authentication, repository management, analytics, semantic search, and AI-powered code understanding.

---

# Frontend Technology

## Core Technologies

- HTML5
- CSS3
- Vanilla JavaScript (ES6 Modules)
- Fetch API

No frontend framework is used.

The application should remain lightweight while following modern development practices.

---

# Styling

Use:

- Custom CSS
- CSS Variables
- Flexbox
- CSS Grid

Do NOT use:

- Bootstrap
- Tailwind CSS
- Material UI
- jQuery

---

# Theme

Supported Themes

- Dark Mode (Default)
- Light Mode

Design Inspiration

- GitHub
- Cursor
- Vercel
- Linear
- Supabase

Theme switching should update the entire application using CSS Variables without requiring page reloads.

---

# Responsive Design

The application must support:

- Desktop
- Tablet
- Mobile

Layouts should gracefully adapt while preserving usability.

---

# Application Structure

The frontend consists of the following pages:

1. Landing
2. Login
3. Register
4. Dashboard
5. Repositories
6. Repository Details
7. File Viewer
8. Settings
9. Error (404)

Repository Details is a single page containing multiple tabs.

Tabs include:

- Overview
- Explorer
- Insights
- AI Chat

These tabs share the same repository context and should not be implemented as separate pages.

---

# User Journey

```
Landing

        │

        ▼

Login / Register

        │

        ▼

Dashboard

        │

        ▼

Repositories

        │

        ▼

Repository Details

    ├── Overview
    ├── Explorer
    ├── Insights
    └── AI Chat

        │

        ▼

File Viewer

        │

        ▼

Settings
```

---

# Frontend Goals

The frontend should provide:

- Fast navigation
- Minimal API requests
- Responsive layouts
- Modern SaaS user experience
- Reusable components
- Clear repository visualization
- Smooth AI interaction
- Consistent styling
- Accessible navigation
- Production-ready code organization

---

# Design Principles

The frontend should follow these principles:

## Simplicity

Avoid unnecessary complexity.

Every page should have a clear purpose.

---

## Consistency

Spacing

Typography

Buttons

Cards

Forms

Colors

Icons

Layouts

should remain consistent throughout the application.

---

## Reusability

Components should be reusable wherever possible.

Examples include:

- Statistics Cards
- Repository Cards
- Badges
- Buttons
- Tables
- Modals
- Charts
- Toast Notifications
- Skeleton Loaders

---

## Performance

Prefer aggregated backend endpoints.

Avoid duplicate API requests.

Reuse existing data whenever possible.

Lazy-load expensive content such as repository file contents.

---

## Backend Compatibility

Frontend components must consume backend responses exactly as documented in:

- `FRONTEND_API_CONTRACT.md`

Do NOT:

- Rename response fields
- Modify backend response structures
- Invent additional backend fields
- Hardcode values already available from backend APIs

---

# Documentation Scope

This document defines:

- Page structure
- Component hierarchy
- Backend field mapping
- UI behavior
- User interactions
- Loading states
- Empty states
- Error states
- Refresh behavior
- Responsive behavior

This document should be treated as the authoritative implementation guide for the RepoLens frontend.

---


# 2. Global Design System

## Design Language

RepoLens follows a modern SaaS dashboard design inspired by:

- GitHub
- Cursor
- Vercel
- Linear
- Supabase

The design should prioritize:

- Clean layouts
- Minimal distractions
- High readability
- Fast navigation
- Consistent spacing
- Professional appearance

Every page should visually feel like part of the same application.

---

# Color System

## Primary

Purpose

- Primary Buttons
- Active Navigation
- Links
- Focus States

Style

Purple Accent

---

## Secondary

Purpose

- Secondary Buttons
- Card Highlights
- Small Badges

Style

Blue Accent

---

## Success

Purpose

- Completed Repository
- Success Toast
- Positive Status

Style

Green

---

## Warning

Purpose

- Processing
- Pending
- Uploading

Style

Orange

---

## Danger

Purpose

- Delete
- Errors
- Failed Operations

Style

Red

---

## Neutral

Purpose

- Text
- Borders
- Cards
- Backgrounds

Use multiple neutral shades for hierarchy.

---

# CSS Variables

Define all colors using CSS Variables.

Example categories:

- Background
- Surface
- Card
- Border
- Primary
- Secondary
- Success
- Warning
- Danger
- Text Primary
- Text Secondary
- Muted Text

Never hardcode colors inside components.

---

# Typography

Use a modern sans-serif font.

Hierarchy:

## Heading 1

Landing Hero

## Heading 2

Page Titles

## Heading 3

Section Titles

## Heading 4

Card Titles

## Body Text

Default content

## Caption

Metadata

Examples

Repository status

Last updated

File count

---

# Spacing System

Use consistent spacing throughout the application.

Small

Buttons

Icons

Badges

Medium

Cards

Inputs

Tables

Large

Page Sections

Dashboard Layout

Extra Large

Landing Sections

Hero

Avoid random spacing values.

---

# Border Radius

Maintain consistent rounded corners.

Apply to:

- Buttons
- Cards
- Inputs
- Modals
- Dropdowns
- Toasts

---

# Shadows

Use soft shadows.

Cards should elevate slightly on hover.

Avoid heavy shadows.

---

# Animations

Animations should be subtle.

Recommended:

- Fade In
- Fade Out
- Scale
- Slide
- Hover Lift

Avoid flashy animations.

---

# Icons

Use one consistent icon library across the application.

Examples:

Dashboard

Repository

Folder

File

Upload

Search

Settings

Profile

Logout

Theme

AI

Charts

Never mix multiple icon styles.

---

# Layout Structure

Authenticated pages follow one layout.

```
+---------------------------------------------+
| Navbar                                      |
+-----------+---------------------------------+
| Sidebar   |                                 |
|           |                                 |
|           |        Main Content             |
|           |                                 |
|           |                                 |
+-----------+---------------------------------+
```

Sidebar remains fixed.

Navbar remains fixed.

Only the content area scrolls.

---

# Navbar

Contains:

- Logo
- Global Search
- Theme Toggle
- Notifications
- Profile Menu

Visible on every authenticated page.

---

# Sidebar

Contains:

- Dashboard
- Repositories
- AI Chat
- Settings

The active page must always be highlighted.

Sidebar should collapse automatically on smaller screens.

---

# Cards

Cards are the primary content container.

Every card should include:

- Title
- Optional Description
- Content
- Optional Footer

Cards should have consistent:

- Padding
- Border Radius
- Shadow
- Hover State

---

# Buttons

Primary Button

Purpose

Main Actions

Examples

Login

Create Repository

Upload

Send Message

---

Secondary Button

Purpose

Alternative Actions

Examples

Cancel

View Details

---

Danger Button

Purpose

Delete Operations

---

Icon Button

Purpose

Compact Actions

Examples

Theme Toggle

Close Modal

Refresh

---

# Forms

All forms should follow identical styling.

Includes:

- Labels
- Inputs
- Validation Messages
- Helper Text
- Buttons

Validation should appear below the relevant field.

---

# Tables

Tables should support:

- Hover Row
- Responsive Layout
- Empty State
- Loading State

Avoid horizontal scrolling where possible.

---

# Modals

Use modals for:

- Create Repository
- Upload ZIP
- Delete Confirmation

Modals should:

- Darken background
- Trap keyboard focus
- Close on Escape
- Close using overlay click

---

# Notifications

Use Toast Notifications.

Types:

- Success
- Warning
- Error
- Information

Position:

Top Right

Auto-dismiss after a few seconds.

---

# Loading Experience

Use Skeleton Loaders instead of spinners wherever practical.

Examples:

Dashboard Cards

Repository List

Repository Details

Repository Tree

Use Loading Spinners for:

- File Upload
- AI Response Generation

---

# Empty States

Every page must define an empty state.

Examples:

Repositories

"No repositories found."

Dashboard

"No repositories available."

AI Chat

"Ask your first question."

Explorer

"No files available."

Every empty state should include:

- Illustration or Icon
- Title
- Description
- Primary Action (when applicable)

---

# Error States

Every page should gracefully handle errors.

Examples:

Network Error

Server Error

Unauthorized

Repository Not Found

Display:

- Error Icon
- Clear Message
- Retry Button

Never expose raw backend exceptions.

---

# Accessibility

Follow accessibility best practices.

- Keyboard Navigation
- Visible Focus States
- Proper Contrast
- Semantic HTML
- ARIA Labels where necessary

---

# Design Consistency Rules

Every new page or component must follow this design system.

Do not introduce:

- New spacing systems
- Different typography
- Different button styles
- Different card styles
- Different icon libraries

The entire application should appear as one cohesive professional SaaS product.

---

# 3. Frontend Folder Structure & JavaScript Architecture

## Project Structure

The frontend should follow a modular architecture to ensure maintainability, scalability, and separation of concerns.

```
frontend/
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── css/
│   ├── variables.css
│   ├── reset.css
│   ├── layout.css
│   ├── components.css
│   ├── utilities.css
│   ├── animations.css
│   ├── dark-theme.css
│   ├── light-theme.css
│   └── pages/
│       ├── landing.css
│       ├── auth.css
│       ├── dashboard.css
│       ├── repositories.css
│       ├── repository-details.css
│       ├── file-viewer.css
│       ├── settings.css
│       └── error.css
│
├── js/
│   ├── app.js
│   │
│   ├── api/
│   │   ├── auth.js
│   │   ├── dashboard.js
│   │   ├── projects.js
│   │   ├── repository.js
│   │   ├── intelligence.js
│   │   ├── semantic.js
│   │   ├── chat.js
│   │   └── request.js
│   │
│   ├── state/
│   │   ├── authState.js
│   │   ├── projectState.js
│   │   ├── themeState.js
│   │   └── uiState.js
│   │
│   ├── components/
│   │   ├── navbar.js
│   │   ├── sidebar.js
│   │   ├── cards.js
│   │   ├── charts.js
│   │   ├── explorer.js
│   │   ├── codeViewer.js
│   │   ├── modals.js
│   │   ├── forms.js
│   │   ├── toast.js
│   │   ├── loading.js
│   │   ├── emptyState.js
│   │   └── errorState.js
│   │
│   ├── pages/
│   │   ├── landing.js
│   │   ├── login.js
│   │   ├── register.js
│   │   ├── dashboard.js
│   │   ├── repositories.js
│   │   ├── repositoryDetails.js
│   │   ├── settings.js
│   │   ├── fileViewer.js
│   │   └── error404.js
│   │
│   └── utils/
│       ├── auth.js
│       ├── storage.js
│       ├── validators.js
│       ├── formatter.js
│       ├── constants.js
│       ├── router.js
│       └── helpers.js
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── repositories.html
├── repository-details.html
├── settings.html
├── 404.html
└── README.md
```

---

# Architecture Principles

The frontend must follow strict separation of responsibilities.

Every module should have one responsibility only.

Never mix:

- UI rendering
- API calls
- State management
- Business logic

inside the same file.

---

# CSS Organization

## variables.css

Contains:

- Colors
- Typography
- Shadows
- Border Radius
- Spacing
- Z-index
- Breakpoints

No component styling.

---

## reset.css

Contains:

- Browser Reset
- Normalize
- Global HTML rules

---

## layout.css

Contains:

- Navbar
- Sidebar
- Grid Layout
- Main Layout
- Responsive Layout

---

## components.css

Contains shared component styling.

Examples:

- Cards
- Buttons
- Tables
- Inputs
- Modals
- Badges
- Breadcrumbs
- Pagination

---

## utilities.css

Contains reusable utility classes.

Examples:

- Flex
- Grid
- Margin
- Padding
- Hidden
- Text Alignment

---

## animations.css

Contains all animations.

Examples:

- Fade
- Scale
- Slide
- Hover

---

## Page CSS

Each page should contain only page-specific styling.

Never duplicate shared styles.

---

# JavaScript Organization

JavaScript follows ES6 Modules.

Every file exports reusable functions.

Avoid global variables.

---

# API Layer

Every backend endpoint should have one matching API module.

## auth.js

Responsible for:

- Register
- Login
- Refresh Token

---

## projects.js

Responsible for:

- Create Project
- List Projects
- Update Project
- Delete Project
- Upload Repository

---

## dashboard.js

Responsible for:

- Dashboard
- Overview
- Explorer
- Insights
- Repository File

---

## intelligence.js

Responsible for:

- Repository Intelligence

---

## semantic.js

Responsible for:

- Semantic Retrieval

---

## chat.js

Responsible for:

- AI Chat

---

## request.js

Contains:

- Fetch Wrapper
- Authorization Header
- Error Handling
- JSON Parsing
- Retry Logic (future)

Every API request should use this wrapper.

Never call fetch() directly from page files.

---

# State Management

Use lightweight JavaScript modules.

Global states:

## Authentication State

Contains:

- access token
- refresh token
- login status

---

## Repository State

Contains:

- current repository
- selected file
- explorer tree

---

## Theme State

Contains:

- current theme

---

## UI State

Contains:

- sidebar status
- active tab
- open modal
- loading indicators

---

# Page Modules

Each page should only coordinate:

- API Calls
- Component Rendering
- Event Listeners

Pages should never contain reusable UI logic.

---

# Component Modules

Every reusable UI element belongs inside:

```
js/components/
```

Components receive data.

Components return HTML or update the DOM.

They should never perform API requests directly.

---

# Utility Modules

Utilities contain helper functions only.

Examples:

- Date formatting
- File size formatting
- Token storage
- Validation
- Routing
- String helpers

Utilities should never manipulate the DOM.

---

# Routing

Each HTML page represents one route.

```
/

Landing

/login

Register

/register

Dashboard

/dashboard

Repositories

/repositories

Repository Details

/repository-details?id=1

Settings

/settings

404

/404
```

Repository tabs should use JavaScript.

Do not navigate to different HTML pages.

---

# Asset Management

Images

```
assets/images/
```

Icons

```
assets/icons/
```

Illustrations

```
assets/images/illustrations/
```

Logos

```
assets/images/logo/
```

---

# Naming Conventions

Use:

camelCase

Examples

```
loadDashboard()

fetchRepositories()

renderExplorer()

openUploadModal()
```

Files

```
repositoryDetails.js

themeState.js

auth.js
```

CSS

```
repository-card

sidebar-item

status-badge
```

Keep naming consistent throughout the project.

---

# Code Quality Guidelines

Every module should:

- Have a single responsibility
- Be reusable
- Be documented
- Avoid duplicate code
- Follow consistent naming

Avoid:

- Large monolithic files
- Repeated fetch logic
- Inline styles
- Inline JavaScript

---

# Future Scalability

The folder structure should allow future additions without restructuring.

Examples:

- Notifications
- Team Workspaces
- Repository Sharing
- AI History
- API Keys
- Billing

New modules should integrate naturally into the existing architecture.

---


# 4. Shared Components

This section defines every reusable frontend component used throughout RepoLens.

Each component specifies:

- Parent Page(s)
- Backend API
- Backend Fields
- Display Format
- User Interaction
- Refresh Trigger
- Loading State
- Empty State
- Error State

These components should be implemented once and reused across the application.

---

# 4.1 Navbar

## Parent Pages

- Dashboard
- Repositories
- Repository Details
- Settings

## Components

- RepoLens Logo
- Global Search (Future)
- Theme Toggle
- Notification Icon (Future)
- Profile Menu

## Backend API

None

## Backend Fields

None

## User Interaction

- Navigate Home
- Open Profile Menu
- Toggle Theme

## Refresh Trigger

Never

## Loading State

None

## Empty State

None

## Error State

None

---

# 4.2 Sidebar

## Parent Pages

- Dashboard
- Repositories
- Repository Details
- Settings

## Navigation Items

- Dashboard
- Repositories
- AI Chat
- Settings

## Backend API

None

## Backend Fields

None

## User Interaction

- Navigate between pages
- Highlight active page

## Refresh Trigger

Never

---

# 4.3 Repository Card

## Parent Page

Repositories

Dashboard

## Backend API

GET /api/projects/

## Backend Fields

| Backend Field | UI Component |
|--------------|--------------|
| id | Open Repository Button |
| name | Repository Title |
| repository_name | Repository Subtitle |
| description | Description |
| upload_type | Upload Type Badge |
| status | Status Badge |
| created_at | Created Date |
| updated_at | Last Updated |

## User Interaction

- Open Repository
- Upload ZIP
- Delete Repository

## Refresh Trigger

- Page Load
- Repository Created
- Repository Deleted
- Upload Completed

## Loading State

Repository Card Skeleton

## Empty State

"No repositories available."

## Error State

Error Card

---

# 4.4 Statistics Card

## Parent Pages

Dashboard

Repository Overview

## Backend API

GET /api/dashboard/

Repository Overview API

## Backend Fields

Dashboard Summary

- summary.total_repositories
- summary.total_files
- summary.total_functions
- summary.total_classes
- summary.total_frameworks
- summary.total_languages

Repository Statistics

- statistics.files
- statistics.functions
- statistics.classes
- statistics.imports
- statistics.dependencies
- statistics.frameworks
- statistics.metadata
- statistics.total_size_bytes
- statistics.average_file_size_bytes
- statistics.source_files
- statistics.avg_functions_per_file

## Display Format

Large Metric Card

## Refresh Trigger

Dashboard Refresh

Repository Refresh

---

# 4.5 Chart Card

## Parent Pages

Dashboard

Repository Details

## Backend API

GET /api/dashboard/

GET Repository Insights

## Backend Fields

Dashboard

- language_distribution
- processing_status
- project_type_distribution

Repository

- statistics.language_distribution
- statistics.extension_stats

## Recommended Charts

Language Distribution

Pie Chart

Repository Status

Donut Chart

Project Types

Bar Chart

Extension Distribution

Horizontal Bar

## Loading State

Skeleton Chart

## Empty State

"No data available."

---

# 4.6 Language Badge

## Parent Pages

Repository Details

## Backend API

Repository Overview

## Backend Fields

languages[]

## Display

Badge

Example

Python

JavaScript

HTML

CSS

---

# 4.7 Framework Badge

## Parent Pages

Repository Details

## Backend API

Repository Overview

## Backend Fields

frameworks[]

## Display

Badge

---

# 4.8 Dependency List

## Parent Pages

Repository Details

## Backend API

Repository Overview

## Backend Fields

dependencies[]

## Display

Scrollable List

---

# 4.9 Repository Tree

## Parent Pages

Repository Details

Explorer Tab

## Backend API

GET Explorer

## Backend Fields

tree[]

children[]

id

name

path

extension

language

size

type

## User Interaction

Expand Folder

Collapse Folder

Open File

## Refresh Trigger

Repository Changed

## Loading State

Skeleton Tree

## Empty State

"No files found."

---

# 4.10 Code Viewer

## Parent Page

Repository File Viewer

## Backend API

GET Repository File

## Backend Fields

filename

path

language

extension

size

content

## Features

Syntax Highlighting

Line Numbers

Copy Code

Word Wrap

Search

## Refresh Trigger

File Selection

## Loading State

Editor Skeleton

## Empty State

"No file selected."

---

# 4.11 AI Chat

## Parent Page

Repository Details

AI Chat Tab

## Backend API

POST /api/ai/chat/

## Backend Fields

Request

project_id

question

Response

success

provider

answer

## User Interaction

Send Message

Receive Response

Auto Scroll

Retry

## Loading State

Typing Indicator

## Empty State

"Ask your first question."

---

# 4.12 Toast Notification

## Parent Pages

Entire Application

## Trigger

Login Success

Repository Created

Upload Complete

Delete Success

AI Error

Validation Error

## Types

Success

Warning

Error

Info

---

# 4.13 Loading Components

Reusable Components

- Skeleton Card
- Skeleton Table
- Skeleton Tree
- Spinner
- Upload Progress

Used whenever backend data is loading.

---

# 4.14 Error Card

Reusable Error Component.

Contains

- Icon
- Title
- Description
- Retry Button

Used for

Network Errors

API Errors

Repository Errors

AI Errors

---

# 4.15 Empty State

Reusable Empty State Component.

Contains

- Illustration
- Title
- Description
- Primary Action

Examples

"No repositories."

"No AI conversations."

"No files found."

---

# 4.16 Theme Toggle

## Parent

Navbar

## State

themeState

## User Interaction

Toggle

Dark

Light

## Persistence

Store selected theme in Local Storage.

Apply automatically on application startup.

---


# 5. Authentication Pages

This section defines the public pages of RepoLens.

These pages are accessible without authentication.

---

# 5.1 Landing Page

## Purpose

The Landing Page introduces RepoLens and encourages users to register or log in.

This page is purely informational and does not consume backend APIs.

---

## Components

- Navigation Bar
- Hero Section
- Feature Cards
- Architecture Preview
- Demo Video / GIF
- AI Features Section
- Call To Action
- Footer

---

## Backend API

None

---

## Backend Fields

None

---

## Primary Actions

- Login
- Get Started
- Learn More

---

## User Flow

```
Landing

↓

Login

or

Register
```

---

## Loading State

None

---

## Empty State

Not Applicable

---

## Error State

404 only

---

# 5.2 Login Page

## Purpose

Authenticate users using JWT Authentication.

---

## Backend API

POST /api/auth/login/

---

## Request Fields

| Backend Field | UI Component |
|--------------|--------------|
| email | Email Input |
| password | Password Input |

---

## Success Response

| Backend Field | UI Action |
|--------------|-----------|
| access | Store Access Token |
| refresh | Store Refresh Token |

---

## Components

- Logo
- Login Form
- Email Input
- Password Input
- Login Button
- Register Link

---

## Validation

Email

- Required

Password

- Required

---

## Success Flow

```
User Login

↓

Store JWT

↓

Redirect Dashboard

↓

Load Dashboard API
```

---

## Error State

Display backend error returned by:

```
detail
```

Example

```
No active account found with the given credentials.
```

---

## Loading State

Disable Login Button

Show Spinner

---

## Refresh Trigger

Never

---

# 5.3 Register Page

## Purpose

Create a new RepoLens account.

---

## Backend API

POST /api/auth/register/

---

## Request Fields

| Backend Field | UI Component |
|--------------|--------------|
| username | Username Input |
| email | Email Input |
| password | Password Input |

---

## Success Response

| Backend Field | UI Usage |
|--------------|----------|
| id | Ignore |
| username | Optional Success Message |
| email | Optional Success Message |

---

## Components

- Register Form
- Username
- Email
- Password
- Register Button
- Login Link

---

## Validation

Username

Required

Email

Required

Password

Required

Display backend validation messages exactly as returned.

---

## Success Flow

```
Register

↓

Account Created

↓

Redirect Login

↓

User Login

↓

Dashboard
```

---

## Loading State

Disable Register Button

Show Spinner

---

## Error State

Display validation messages returned by backend.

Examples

```
Email already exists.

Username required.

Password validation errors.
```

---

# Authentication Guard

Protected Pages

- Dashboard
- Repositories
- Repository Details
- File Viewer
- Settings

If Access Token is missing

↓

Redirect Login

---

# Logout Flow

User

↓

Logout

↓

Remove Access Token

↓

Remove Refresh Token

↓

Clear Local State

↓

Redirect Landing Page

---

# Authentication State

Store

- Access Token
- Refresh Token
- Login Status

Never store passwords.

---

# Remember Me

Not implemented in backend.

Frontend should not invent this feature.

---

# Password Reset

Not implemented in backend.

Do not create UI for this feature.

---

# Authentication Page UX

Landing

↓

Login/Register

↓

Dashboard

Authentication should require the minimum number of clicks.

Keep forms simple and focused.

---

# 6. Dashboard & Repository Management

This section defines the Dashboard, Repository List, Project Creation, and Repository Upload workflow.

The Dashboard is the primary workspace immediately after user authentication.

---

# 6.1 Dashboard

## Purpose

Provide a high-level overview of all repositories and repository intelligence.

The Dashboard should load immediately after successful login.

---

## Backend API

```
GET /api/dashboard/
```

---

## Components

- Welcome Header
- Statistics Cards
- Recent Repositories
- Language Distribution Chart
- Repository Status Chart
- Project Type Chart
- Quick Actions

---

## Backend Field Mapping

### Statistics Cards

| Backend Field | Component | Display |
|--------------|-----------|---------|
| summary.total_repositories | Total Repositories Card | Large Number |
| summary.total_files | Indexed Files Card | Large Number |
| summary.total_functions | Functions Card | Large Number |
| summary.total_classes | Classes Card | Large Number |
| summary.total_frameworks | Frameworks Card | Large Number |
| summary.total_languages | Languages Card | Large Number |

---

### Recent Repositories

| Backend Field | Component |
|--------------|-----------|
| recent_repositories[].id | Open Repository |
| recent_repositories[].name | Repository Name |
| recent_repositories[].repository_name | Subtitle |
| recent_repositories[].status | Status Badge |
| recent_repositories[].created_at | Created Date |

---

### Processing Status Chart

Backend Field

```
processing_status[]
```

Chart

Donut Chart

Fields

```
status
count
```

---

### Language Distribution

Backend Field

```
language_distribution[]
```

Chart

Pie Chart

Fields

```
language
count
```

---

### Project Type Distribution

Backend Field

```
project_type_distribution[]
```

Chart

Horizontal Bar Chart

Fields

```
value
count
```

---

## User Actions

- Open Repository
- Create Repository
- Upload ZIP
- Refresh Dashboard

---

## Loading State

Display

- Skeleton Statistics Cards
- Skeleton Repository List
- Skeleton Charts

---

## Empty State

```
No repositories found.
```

Display

- Illustration
- Create Repository Button

---

## Error State

Display

- Error Card
- Retry Button

---

## Refresh Triggers

Dashboard reloads when

- Login Success
- Repository Created
- Repository Deleted
- ZIP Upload Completed
- Manual Refresh

---

# 6.2 Repository List

## Purpose

Display every repository owned by the authenticated user.

---

## Backend API

```
GET /api/projects/
```

---

## Components

- Search Bar (Frontend Filtering)
- Repository Grid
- Repository Card
- Status Badge
- Upload Button
- Open Button
- Delete Button

---

## Backend Field Mapping

| Backend Field | Component |
|--------------|-----------|
| id | Open Button |
| name | Repository Title |
| description | Description |
| repository_name | Subtitle |
| upload_type | Upload Badge |
| status | Status Badge |
| created_at | Created Date |
| updated_at | Updated Date |

---

## Card Actions

Open Repository

↓

Repository Details

Upload ZIP

↓

Upload Modal

Delete

↓

Confirmation Modal

---

## Loading State

Repository Skeleton Cards

---

## Empty State

```
No repositories available.
```

Show

Create Repository Button

---

## Refresh Trigger

- Repository Created
- Repository Deleted
- Upload Finished
- Manual Refresh

---

# 6.3 Create Repository

## Backend API

```
POST /api/projects/
```

---

## Form Fields

| Backend Field | UI Component |
|--------------|--------------|
| name | Repository Name Input |
| description | Description Textarea |
| upload_type | Upload Type Dropdown |
| repository_name | Repository Name Input |
| storage_path | Hidden/Internal Input |

---

## Components

- Modal
- Form
- Submit Button
- Cancel Button

---

## Validation

Display backend validation messages exactly as returned.

Do not duplicate backend validation logic.

---

## Success Flow

```
Create Repository

↓

Close Modal

↓

Refresh Repository List

↓

Show Success Toast
```

---

## Loading State

Disable Submit Button

Show Spinner

---

## Error State

Display backend validation errors.

---

# 6.4 Upload Repository

## Backend API

```
POST /api/projects/{id}/upload/
```

---

## Form

Multipart Form

---

## Backend Fields

| Backend Field | UI Component |
|--------------|--------------|
| zip_file | File Upload |

---

## Upload Rules

Accept

```
.zip
```

Maximum Size

```
100 MB
```

---

## Components

- Upload Modal
- Drag & Drop Zone
- File Picker
- Upload Progress
- Submit Button

---

## Success Response Mapping

| Backend Field | Component |
|--------------|-----------|
| message | Success Toast |
| status | Repository Status Badge |

---

## Success Flow

```
Select ZIP

↓

Upload

↓

Processing

↓

Repository Status Updated

↓

Refresh Dashboard

↓

Refresh Repository List

↓

Success Notification
```

---

## Loading State

- Upload Progress Bar
- Disable Upload Button
- Processing Indicator

---

## Error State

Display backend validation messages.

Examples

```
Only ZIP files are allowed.
```

```
ZIP file size cannot exceed 100 MB.
```

---

# 6.5 Dashboard UX Guidelines

Dashboard should always feel alive.

Recommendations

- Animate statistic cards when values load.
- Animate chart rendering.
- Refresh only affected sections after API calls.
- Avoid full page reloads.
- Preserve scroll position.
- Use optimistic UI only after successful backend responses.

---

# Dashboard API Usage Summary

| API | Used By |
|------|---------|
| GET /api/dashboard/ | Dashboard Home |
| GET /api/projects/ | Repository List |
| POST /api/projects/ | Create Repository |
| POST /api/projects/{id}/upload/ | Upload ZIP |
| DELETE /api/projects/{id}/ | Delete Repository |

---

# Performance Notes

- Dashboard should request aggregated dashboard data only once during page load.
- Repository List should be fetched independently to avoid unnecessary dashboard refreshes.
- Upload operations should refresh only the affected repository and dashboard statistics.
- Avoid duplicate API requests for the same data.
- Cache repository information in frontend state until it becomes stale.

---

# 7. Repository Workspace

The Repository Workspace is the core feature of RepoLens.

It provides a complete repository analysis experience within a **single page** using a tabbed interface.

The page should **not navigate** between Overview, Explorer, Insights, and AI Chat.

Instead, changing tabs should update only the content area while preserving the selected repository.

---

# Workspace Layout

```
+---------------------------------------------------------+
| Repository Header                                       |
| Name • Status • Languages • Frameworks                  |
+---------------------------------------------------------+

| Overview | Explorer | Insights | AI Chat |

-----------------------------------------------------------

Dynamic Tab Content

-----------------------------------------------------------
```

The selected repository remains active until the user changes it.

---

# Repository Header

## Backend API

```
GET /api/projects/{id}/
```

---

## Backend Field Mapping

| Backend Field | Component |
|--------------|-----------|
| id | Internal State |
| name | Repository Title |
| description | Repository Description |
| repository_name | Repository Subtitle |
| status | Status Badge |
| upload_type | Upload Badge |
| created_at | Created Date |
| updated_at | Updated Date |

---

## User Actions

- Switch Tabs
- Upload New ZIP
- Delete Repository
- Return to Repository List

---

# 7.1 Overview Tab

## Purpose

Provide a high-level summary of the selected repository.

---

## Backend API

```
GET /api/dashboard/projects/{project_id}/overview/
```

---

## Components

- Repository Identity
- Languages
- Frameworks
- Dependencies
- Metadata
- Entry Points
- Statistics Cards

---

## Backend Field Mapping

### Repository Identity

| Backend Field | Component |
|--------------|-----------|
| identity.name | Repository Name |
| identity.repository | Repository Display Name |
| identity.type | Project Type Badge |

---

### Languages

```
languages[]
```

Display

Language Badges

---

### Frameworks

```
frameworks[]
```

Display

Framework Badges

---

### Dependencies

```
dependencies[]
```

Display

Scrollable Dependency List

---

### Metadata

```
metadata[]
```

Display

Key-Value Table

Fields

- key
- value

---

### Entry Points

```
entry_points[]
```

Display

Entry Point Cards

Example

manage.py

main.py

app.py

---

### Statistics

Display using Statistics Cards.

Backend Fields

- statistics.files
- statistics.python_files
- statistics.javascript_files
- statistics.html_files
- statistics.css_files
- statistics.functions
- statistics.classes
- statistics.imports
- statistics.dependencies
- statistics.frameworks
- statistics.metadata
- statistics.total_size_bytes
- statistics.average_file_size_bytes
- statistics.source_files
- statistics.avg_functions_per_file

---

### Charts

Language Distribution

Uses

```
statistics.language_distribution
```

Chart

Pie Chart

---

Extension Distribution

Uses

```
statistics.extension_stats
```

Chart

Horizontal Bar

---

## Loading State

Overview Skeleton

---

## Empty State

```
Repository analysis unavailable.
```

---

## Error State

Retry Card

---

# 7.2 Explorer Tab

## Purpose

Browse the repository file structure.

---

## Backend API

```
GET /api/dashboard/projects/{project_id}/explorer/
```

---

## Components

- Folder Tree
- Expand/Collapse
- Search (Frontend)
- File Icons

---

## Backend Field Mapping

| Backend Field | Component |
|--------------|-----------|
| project | Workspace Title |
| tree | Repository Tree |

Each Tree Node

| Backend Field | Component |
|--------------|-----------|
| id | File Selection |
| name | File Name |
| path | Breadcrumb |
| extension | File Icon |
| language | Language Indicator |
| size | File Size |
| type | Folder/File |
| children | Nested Tree |

---

## User Interaction

Expand Folder

Collapse Folder

Select File

Open File

---

## Refresh Trigger

Repository Changed

---

## Loading State

Tree Skeleton

---

## Empty State

```
No files available.
```

---

# 7.3 Insights Tab

## Purpose

Present repository intelligence visually.

---

## Backend API

```
GET /api/dashboard/projects/{project_id}/insights/
```

---

## Backend Fields

Uses the same response structure as Repository Overview.

- identity
- languages
- frameworks
- dependencies
- metadata
- entry_points
- statistics

---

## Components

- Analytics Cards
- Charts
- Technology Summary
- Repository Metrics

---

## Recommended Charts

Files by Language

Extensions

Repository Size

Functions per File

---

## Loading State

Skeleton Charts

---

## Error State

Retry Card

---

# 7.4 AI Chat Tab

## Purpose

Allow users to ask repository-specific questions.

---

## Backend API

```
POST /api/ai/chat/
```

---

## Layout

```
+----------------------------------------------+

Repository Context

-----------------------------------------------

Conversation

-----------------------------------------------

Question Input

Send Button

+----------------------------------------------+
```

---

## Request Mapping

| Backend Field | UI Component |
|--------------|--------------|
| project_id | Hidden Current Repository |
| question | Chat Input |

---

## Response Mapping

| Backend Field | Component |
|--------------|-----------|
| success | Request Status |
| provider | Small Provider Badge |
| answer | AI Response |

---

## User Actions

Ask Question

Receive Answer

Copy Response

Clear Conversation

---

## Loading State

Typing Indicator

Disable Send Button

---

## Empty State

```
Ask a question about this repository.
```

---

## Error State

Display backend error.

---

# 7.5 Repository File Viewer

## Purpose

Display repository source code.

The File Viewer should open when a file is selected from the Explorer.

---

## Backend API

```
GET /api/dashboard/projects/{project_id}/files/{file_id}/
```

---

## Components

- Breadcrumb
- File Header
- Code Editor
- Copy Button
- Search
- Line Numbers

---

## Backend Field Mapping

| Backend Field | Component |
|--------------|-----------|
| filename | Editor Title |
| path | Breadcrumb |
| language | Syntax Highlighter |
| extension | File Icon |
| size | File Information |
| content | Code Editor |

---

## User Interaction

Select File

↓

Load File

↓

Display Syntax Highlighting

---

## Loading State

Editor Skeleton

---

## Empty State

```
Select a file to view its contents.
```

---

## Error State

```
Unable to load file.
```

Retry Button

---

# Workspace Refresh Rules

Reload Repository Workspace when

- Repository changes
- ZIP upload completes
- Manual refresh

Do NOT reload when switching tabs.

Tabs should reuse already loaded data whenever possible.

---

# Workspace Performance Guidelines

- Load Repository Header first.
- Lazy-load each tab on first access.
- Cache loaded tab data while the repository remains selected.
- Load file content only when a file is selected.
- Avoid repeated requests for Overview and Insights unless explicitly refreshed.
- Preserve the selected tab and scroll position whenever possible.

---


# 8. Settings & Error Pages

This section defines user settings, profile management, theme preferences, logout behavior, and application error pages.

---

# 8.1 Settings Page

## Purpose

Allow users to manage application preferences.

Current backend support is limited.

Settings should only expose implemented functionality.

Future features may be visually prepared but must remain disabled until backend support exists.

---

## Components

- Profile Summary
- Theme Settings
- Logout Button

Future (Disabled)

- API Keys
- Notification Preferences
- Password Change

---

## Backend APIs

None

Authentication state is already available from stored JWT.

---

## Backend Fields

None

---

## Theme Section

Component

Theme Toggle

Options

- Dark
- Light

Storage

Local Storage

Behavior

Theme changes should apply immediately without page reload.

---

## Logout

Behavior

User clicks Logout

↓

Remove Access Token

↓

Remove Refresh Token

↓

Clear Repository State

↓

Clear UI State

↓

Redirect to Landing Page

---

## Loading State

None

---

## Error State

None

---

# 8.2 Profile Section

## Purpose

Display basic user information.

Current backend does not expose a dedicated profile endpoint.

Display only locally available information.

Future backend integration may expand this section.

---

## Components

- Avatar Placeholder
- User Email
- Logout

---

## Backend Fields

Current Implementation

None

Future

Profile API

---

# 8.3 Theme Management

Theme State

Dark (Default)

Light

---

## User Interaction

Toggle Theme

↓

Update CSS Variables

↓

Store Preference

↓

Apply Immediately

---

# 8.4 Error Pages

## 404

Purpose

Page Not Found

Components

- Illustration
- Large 404
- Description
- Return Home Button

---

## API Error

Reusable Error Card

Display

- Error Icon
- Message
- Retry Button

---

## Unauthorized

Display

Session expired.

Redirect to Login.

---

## Repository Not Found

Display

Repository unavailable.

Return to Repository List.

---

## Empty Repository

Display

Repository exists but contains no indexed files.

Suggest uploading a repository.

---

## AI Error

Display backend error returned from AI API.

Allow Retry.

---

# User Experience Guidelines

Never expose stack traces.

Never expose raw backend exceptions.

Always provide

- Explanation
- Retry Action
- Navigation Option

---


# 9. Backend Field Mapping

This section maps every backend response field to the frontend component that consumes it.

These mappings must be followed exactly.

Do NOT rename backend fields.

Do NOT create aliases.

Consume backend responses exactly as defined in `FRONTEND_API_CONTRACT.md`.

---

# Dashboard

## API

GET /api/dashboard/

### Summary

| Backend Field | Frontend Component | Display |
|---------------|-------------------|----------|
| summary.total_repositories | Total Repository Card | Large Metric |
| summary.total_files | Indexed Files Card | Large Metric |
| summary.total_functions | Functions Card | Large Metric |
| summary.total_classes | Classes Card | Large Metric |
| summary.total_frameworks | Frameworks Card | Large Metric |
| summary.total_languages | Languages Card | Large Metric |

---

### Recent Repositories

| Backend Field | Component |
|---------------|-----------|
| recent_repositories[].id | Open Repository Action |
| recent_repositories[].name | Repository Card Title |
| recent_repositories[].repository_name | Repository Subtitle |
| recent_repositories[].status | Status Badge |
| recent_repositories[].created_at | Created Date |

---

### Processing Status

| Backend Field | Component |
|---------------|-----------|
| processing_status[].status | Donut Chart Label |
| processing_status[].count | Donut Chart Value |

---

### Language Distribution

| Backend Field | Component |
|---------------|-----------|
| language_distribution[].language | Pie Chart Label |
| language_distribution[].count | Pie Chart Value |

---

### Project Type Distribution

| Backend Field | Component |
|---------------|-----------|
| project_type_distribution[].value | Bar Chart Label |
| project_type_distribution[].count | Bar Chart Value |

---

# Repository List

## API

GET /api/projects/

| Backend Field | Component |
|---------------|-----------|
| id | Repository Card / Open Button |
| name | Repository Title |
| description | Description |
| repository_name | Repository Subtitle |
| upload_type | Upload Badge |
| status | Status Badge |
| created_at | Created Date |
| updated_at | Updated Date |

---

# Repository Header

## API

GET /api/projects/{id}/

| Backend Field | Component |
|---------------|-----------|
| id | Current Repository State |
| name | Repository Header |
| description | Repository Description |
| repository_name | Repository Subtitle |
| upload_type | Upload Badge |
| status | Status Badge |
| created_at | Created Date |
| updated_at | Updated Date |

---

# Repository Overview

## API

GET /api/dashboard/projects/{project_id}/overview/

### Identity

| Backend Field | Component |
|---------------|-----------|
| identity.name | Repository Name |
| identity.repository | Repository Subtitle |
| identity.type | Project Type Badge |

---

### Languages

| Backend Field | Component |
|---------------|-----------|
| languages[] | Language Badges |

---

### Frameworks

| Backend Field | Component |
|---------------|-----------|
| frameworks[] | Framework Badges |

---

### Dependencies

| Backend Field | Component |
|---------------|-----------|
| dependencies[] | Dependency List |

---

### Metadata

| Backend Field | Component |
|---------------|-----------|
| metadata[].key | Metadata Table Key |
| metadata[].value | Metadata Table Value |

---

### Entry Points

| Backend Field | Component |
|---------------|-----------|
| entry_points[] | Entry Point Cards |

---

### Statistics

| Backend Field | Component |
|---------------|-----------|
| statistics.files | Statistics Card |
| statistics.python_files | Statistics Card |
| statistics.javascript_files | Statistics Card |
| statistics.html_files | Statistics Card |
| statistics.css_files | Statistics Card |
| statistics.functions | Statistics Card |
| statistics.classes | Statistics Card |
| statistics.imports | Statistics Card |
| statistics.dependencies | Statistics Card |
| statistics.frameworks | Statistics Card |
| statistics.metadata | Statistics Card |
| statistics.total_size_bytes | Statistics Card |
| statistics.average_file_size_bytes | Statistics Card |
| statistics.source_files | Statistics Card |
| statistics.avg_functions_per_file | Statistics Card |

---

### Charts

| Backend Field | Component |
|---------------|-----------|
| statistics.language_distribution | Language Distribution Chart |
| statistics.extension_stats | Extension Distribution Chart |

---

# Repository Explorer

## API

GET /api/dashboard/projects/{project_id}/explorer/

| Backend Field | Component |
|---------------|-----------|
| project | Workspace Header |
| tree | Repository Tree |

Tree Node Mapping

| Backend Field | Component |
|---------------|-----------|
| id | File Selection |
| name | File Name |
| path | Breadcrumb |
| extension | File Icon |
| language | Language Indicator |
| size | File Size |
| type | Folder/File Icon |
| children | Nested Tree |

---

# Repository File Viewer

## API

GET /api/dashboard/projects/{project_id}/files/{file_id}/

| Backend Field | Component |
|---------------|-----------|
| filename | Editor Title |
| path | Breadcrumb |
| language | Syntax Highlighter |
| extension | File Icon |
| size | File Metadata |
| content | Code Editor |

---

# AI Chat

## API

POST /api/ai/chat/

### Request

| Backend Field | Component |
|---------------|-----------|
| project_id | Hidden Current Repository |
| question | Chat Input |

### Response

| Backend Field | Component |
|---------------|-----------|
| success | Request Status |
| provider | Provider Badge |
| answer | AI Response Bubble |

---

# Semantic Retrieval

## API

POST /api/semantic/retrieve/

### Request

| Backend Field | Component |
|---------------|-----------|
| project_id | Hidden Repository ID |
| question | Semantic Search Input |
| top_k | Advanced Search Option |

---

# Repository Intelligence

## API

GET /api/intelligence/{project_id}/

Uses the same backend field mapping as Repository Overview.

Frontend should reuse the same components whenever possible.

---

# Mapping Rules

Every backend field should have exactly one clear frontend purpose.

Never duplicate mappings.

Prefer reusable components.

Backend response structures must be consumed exactly as returned.

This section should be treated as the authoritative field mapping reference for the RepoLens frontend.

---


# 10. Frontend Implementation Guidelines

This section defines the implementation rules that every frontend page, component, and API integration must follow.

The objective is to ensure a consistent, scalable, and production-ready frontend.

---

# API Consumption Rules

Consume backend APIs exactly as documented in:

```
docs/FRONTEND_API_CONTRACT.md
```

Never:

- Invent endpoints
- Rename backend fields
- Modify backend response structures
- Hardcode backend values

Always use the existing backend implementation.

---

# API Layer

Every backend endpoint should have exactly one corresponding API module.

```
api/
│
├── auth.js
├── dashboard.js
├── projects.js
├── repository.js
├── intelligence.js
├── semantic.js
├── chat.js
└── request.js
```

Every request must go through:

```
request.js
```

Responsibilities

- Authorization Header
- JSON Parsing
- Error Handling
- Token Refresh (Future)
- Request Wrapper

Pages should never call fetch() directly.

---

# State Management

Maintain only lightweight application state.

Authentication

- Access Token
- Refresh Token
- Login Status

Repository

- Current Repository
- Current File
- Explorer Tree

UI

- Active Tab
- Sidebar State
- Current Theme
- Loading State

Avoid unnecessary global state.

---

# Refresh Rules

Dashboard

Refresh after

- Login
- Repository Creation
- Repository Upload
- Repository Deletion
- Manual Refresh

Repository List

Refresh after

- Repository Creation
- Repository Upload
- Repository Deletion

Repository Workspace

Refresh after

- Repository Change
- Upload Completion
- Manual Refresh

Repository File

Refresh only when

- Another file is selected

AI Chat

Do not reload previous responses.

Only append new messages.

Settings

Refresh only after user changes theme.

---

# Caching Strategy

Cache

- Repository List
- Dashboard Data
- Repository Overview
- Repository Explorer

Do NOT cache

- AI Responses
- File Content after repository changes

Reload cached data only when required.

---

# Lazy Loading

Load only when needed.

Examples

Repository Explorer

↓

Load tree only when Explorer tab opens.

Repository File

↓

Load content only after file selection.

AI Chat

↓

Load only when AI tab opens.

---

# Error Handling

Every API request must handle:

400

Validation Errors

401

Unauthorized

403

Forbidden

404

Not Found

500

Internal Server Error

Display user-friendly messages.

Never expose backend stack traces.

---

# Loading Behaviour

Show loading indicators whenever backend requests are active.

Use

- Skeleton Cards
- Skeleton Tables
- Skeleton Trees
- Loading Spinner

Disable buttons while requests are in progress.

---

# Empty States

Every page should define an empty state.

Examples

Repositories

"No repositories found."

Explorer

"No files available."

AI Chat

"Ask your first repository question."

Dashboard

"No repository statistics available."

Provide a primary action whenever possible.

---

# Success Feedback

Display Toast Notifications for

- Login
- Registration
- Repository Created
- Upload Completed
- Repository Deleted
- Theme Changed

Notifications should automatically dismiss.

---

# Navigation Rules

Landing

↓

Login / Register

↓

Dashboard

↓

Repositories

↓

Repository Details

↓

Settings

Repository tabs should never trigger page navigation.

Switch content dynamically.

---

# Responsive Behaviour

Desktop

Full Sidebar

Multi-column Layout

Tablet

Collapsible Sidebar

Responsive Grid

Mobile

Hamburger Menu

Single-column Layout

Scrollable Tables

Responsive Charts

Touch-friendly Buttons

---

# Performance Guidelines

Prefer aggregated backend endpoints.

Avoid duplicate API calls.

Reuse cached data.

Load expensive resources lazily.

Render only visible content where possible.

Keep animations lightweight.

---

# Component Guidelines

Every component should:

- Be reusable
- Have a single responsibility
- Accept backend data through parameters
- Never perform API requests directly

Components should only render UI.

---

# Accessibility

Implement

- Keyboard Navigation
- Visible Focus States
- Semantic HTML
- Proper Labels
- High Contrast Support

Ensure the application remains usable without a mouse.

---

# Security

Never store passwords.

Store JWT tokens securely.

Always send

```
Authorization: Bearer <access_token>
```

for protected APIs.

Clear authentication state on logout.

---

# Future Extensibility

The architecture should support future additions without major restructuring.

Examples

- Team Workspaces
- Notifications
- API Keys
- AI History
- Repository Sharing
- Billing
- Plugin Support

Future features should integrate into the existing modular structure.

---

# Final Implementation Rules

The frontend must:

- Follow this document exactly.
- Use only backend APIs documented in `FRONTEND_API_CONTRACT.md`.
- Use only backend field names defined in `FRONTEND_API_CONTRACT.md`.
- Reuse components wherever possible.
- Keep pages lightweight.
- Minimize API requests.
- Prefer modular JavaScript.
- Maintain a consistent design language.
- Deliver a responsive, production-ready SaaS experience.

This document, together with `FRONTEND_API_CONTRACT.md`, forms the complete frontend implementation specification for RepoLens.

No backend source code should be required once these two documents are available.

---

