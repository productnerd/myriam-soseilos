# Afterhours - Codebase Overview

This document provides a comprehensive overview of the project structure and its components to help new developers get started.

## Technology Stack

-   **Vite**: Build tool and development server
-   Frontend:
    • **TypeScript**
    • **React**
    • **Tailwind CSS** (CSS framework)
    • **shadcn-ui** (UI component library)
-   Backend:
    • **Supabase** (a BaaS platfrom that gives you a PostgreSQL database + a full suite of tools [authentication, APIs, file storage, edge (serverless) functions, dashboard (to manage DB)] to help building the backend)

## Project Structure

### Root Directory

-   `package.json` - Project dependencies and scripts
-   `vite.config.ts` - Vite configuration
-   `tsconfig.json` - TypeScript configuration
-   `tailwind.config.ts` - Tailwind CSS configuration
-   `postcss.config.js` - PostCSS configuration
-   `eslint.config.js` - ESLint configuration
-   `*.sql` files - Database migration scripts

### Source Code (`src/`)

#### Core Files

-   `index.html` - Application entry point
-   `index.tsx` - Mounting the app into the HTML document
-   `index.css` - Global styles
-   `App.tsx` - Root React component
-   `App.css` - App-specific styles

#### Directories

-   `assets/` - Static assets (images, fonts, etc.)
-   `components/` - Reusable React components
-   `pages/` - Page components and routing
-   `hooks/` - Custom React hooks
-   `store/` - State management
-   `utils/` - Utility functions
-   `types/` - TypeScript type definitions
-   `lib/` - Third-party library configurations
-   `integrations/` - External service integrations
-   `rpc/` - Remote procedure calls
-   `sql/` - SQL queries and database operations
-   `data/` - Static data and constants

### Database (`supabase/`)

Contains Supabase configuration and database-related files.

## Additional Resources

-   [Vite Documentation](https://vitejs.dev/)
-   [React Documentation](https://react.dev/)
-   [Tailwind CSS Documentation](https://tailwindcss.com/)
-   [shadcn-ui Documentation](https://ui.shadcn.com/)
-   [Supabase Documentation](https://supabase.com/docs)
