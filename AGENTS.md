# trippy Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-01-20

## Active Technologies

- TypeScript 5.x, Next.js 16.1.4, React 19.2.3, Node.js 20.x (Vercel runtime) + Next.js App Router, Supabase JS/Auth/Storage, Stripe SDK, shadcn/ui + Radix + Tailwind, three.js + @react-three/fiber, Sentry (001-travel-memory-album)

## Project Structure

```text
src/
tests/
```

## Commands

npm test && npm run lint

## Code Style

TypeScript 5.x, Next.js 16.1.4, React 19.2.3, Node.js 20.x (Vercel runtime): Follow standard conventions

## Recent Changes

- 001-travel-memory-album: Added TypeScript 5.x, Next.js 16.1.4, React 19.2.3, Node.js 20.x (Vercel runtime) + Next.js App Router, Supabase JS/Auth/Storage, Stripe SDK, shadcn/ui + Radix + Tailwind, three.js + @react-three/fiber, Sentry

<!-- MANUAL ADDITIONS START -->
## Service MCP Defaults

- When implementing functionality related to Supabase, Stripe, GitHub, or Vercel, apply the changes directly in those services using their MCP tools as part of the implementation (create/update resources, not just code). If required identifiers or configuration details are missing, ask for them before proceeding.
<!-- MANUAL ADDITIONS END -->
