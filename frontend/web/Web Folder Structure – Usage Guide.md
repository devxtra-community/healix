Web Folder Structure – Usage Guide
This document explains the purpose and usage of each folder and important file inside the
frontend/web structure used in modern scalable applications.
• web/app: Contains all Next.js routes, pages, layouts, and global styles. This is where UI pages
are defined.
• web/components: Reusable UI components like buttons, navbar, footer, cards. No business
logic here.
• web/hooks: Custom React hooks such as authentication or data fetching helpers.
• web/lib: Core utilities like API configuration, authentication helpers, and shared logic.
• web/services: Handles communication with backend APIs (auth, product, order services).
• web/public: Static assets like images, icons, and SVGs.
• web/styles: Optional folder for themes, CSS modules, or design tokens.
• web/types: TypeScript interfaces and types shared across the app.
• middleware.ts: Used for route protection, authentication checks, and redirects.
• next.config.ts: Next.js configuration file.
• package.json: Project dependencies and scripts.
• tsconfig.json: TypeScript configuration.
This structure follows industry best practices and is suitable for scaling applications similar to
Amazon, Flipkart, or other large platforms.