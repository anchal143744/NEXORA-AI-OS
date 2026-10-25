# Frontend Architecture

The frontend foundation lives in apps/web and uses Next.js 15 App Router, TypeScript, TailwindCSS, shadcn-style primitives, Framer Motion, Zustand, TanStack Query, React Hook Form and Zod.

The architecture is organized into app, components, features, layouts, hooks, stores, providers, services, lib, types and styles. Providers establish theme, auth, tenant, workspace, localization, realtime and AI context before business modules are added.
