# MyLink - Project Guide

This project is a 'Linktree' clone service that allows users to gather and share multiple links on a single integrated page.

## 1. Project Overview
- **Purpose**: Provide a platform for creators and brands to efficiently promote various social media and web content through a single link.
- **Core Technologies**: Next.js (App Router), React 19, Tailwind CSS 4, Shadcn UI, Firebase.
- **Key Documents**:
  - `@docs/PRD.md`: Product requirements and data structure definitions.
  - `@docs/WIREFRAME.md`: UI design, user journey, and interaction details.
  - `@docs/USER_SCENARIOS.md`: User scenarios.

## 2. Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19
- **Styling**: Tailwind CSS 4 (via PostCSS)
- **UI Components**: Shadcn UI (based on Radix UI)
- **Backend/BaaS**: Firebase (Authentication, Firestore, Storage)
- **Icons**: Lucide React, Google Favicon API (Auto favicon extraction)

## 3. UI/UX & Design Guidelines (Based on @docs/WIREFRAME.md)
### 3.1 Layout Principles
- **Mobile-First**: All screens are based on a center-aligned layout optimized for mobile devices.
- **Responsive Design**: Maintain a card-style layout by limiting the container width to approximately 500-600px on desktop.

### 3.2 Main Screens & Logic
1. **Home (/)**: Service introduction and Google social login.
2. **Setup (/setup)**: Set a unique `username` upon initial signup. (Validation: lowercase, numbers, specific special characters / Real-time duplicate check required).
3. **Profile Management & View (/:username)**:
   - **Admin Mode**: Implement **Inline Editing** and **Auto-save** for profile photos, names, bios, and links by clicking directly on the elements.
   - **Visitor Mode**: Provide **Skeleton UI** during data loading and a 404 page for non-existent addresses.

### 3.3 Interaction Details
- **Link Behavior**: All external links must open in a new tab (`target="_blank" rel="noopener noreferrer"`).
- **Feedback**: Apply smooth animations (floating, color changes) on link hover and truncate long text with ellipses (`...`).
- **Sharing**: Support easy URL sharing via the Web Share API or clipboard copying.

## 4. Directory Structure
```text
C:\Users\HJ\Documents\my-link\
├── app/              # Next.js App Router pages and layouts
├── components/       # Reusable UI components (including Shadcn UI)
├── docs/             # Project planning and design documents
├── lib/              # Common utility functions (e.g., cn function in utils.js)
├── public/           # Static assets like images and icons
└── package.json      # Project dependencies and scripts
```

## 5. Development & Build Commands
- `npm run dev`: Run development server (http://localhost:3000)
- `npm run build`: Create production build
- `npm run start`: Run production server
- `npm run lint`: Static code analysis using ESLint

## 6. Development Notes
- **Styling**: Use Tailwind CSS 4 as the default; use the `cn` function for complex class compositions.
- **Data Management**: Adhere to the `users/{uid}/links` sub-collection structure considering Firestore security rules.
- **File Reference Convention**: Use the `@` prefix when referring to files (e.g., `@app/page.js`, `@docs/PRD.md`).
- **Configuration Note**: Ensure the `@/` alias points correctly to the root as the `app/` directory is located at the root level.
