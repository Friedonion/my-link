# Gemini Context: my-link / my-profile

This project is a modern web application built with Next.js, intended to serve as a personal profile or "link-in-bio" platform.

## Project Overview

- **Core Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Package Manager:** npm
- **Main Application Directory:** `my-profile/`

The project structure follows the standard Next.js App Router pattern, with components and pages located within the `my-profile/app/` directory.

## Building and Running

All commands should be executed within the `my-profile/` directory.

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the development server with Hot Module Replacement (HMR). |
| `npm run build` | Compiles the application for production deployment. |
| `npm run start` | Starts the production server after a build. |
| `npm run lint` | Runs ESLint to check for code quality and style issues. |

## Development Conventions

### Architecture
- **App Router:** Utilizes Next.js 15+ App Router for routing and server components.
- **Server Components:** Prefers React Server Components (RSC) by default for better performance and SEO.
- **Styling:** Uses Tailwind CSS 4 with a utility-first approach. Global styles are defined in `my-profile/app/globals.css`.

### Code Quality
- **TypeScript:** Strict typing is encouraged. Configuration is managed via `tsconfig.json`.
- **Linting:** Follows the `eslint-config-next` ruleset.
- **Formatting:** Standard Next.js/React formatting conventions.

### File Structure (within `my-profile/`)
- `app/`: Contains the application routes, layouts, and global styles.
- `public/`: Static assets like images and fonts.
- `next.config.ts`: Next.js configuration.
- `tailwind.config.ts`: (If applicable) Tailwind CSS configuration.
