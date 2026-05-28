# Web Application

Next.js frontend application for the PFi project.

---

# Requirements

- Node.js 22+
- pnpm

---

# Local Development Setup

## 1. Install Dependencies

Install dependencies from the project root:

```bash
pnpm install
```

If you encounter this error:

```text
ERR_PNPM_IGNORED_BUILDS
```

Run:

```bash
pnpm approve-builds
```

Then:

- Press `a` to approve all packages
- Press `Enter`

After that, run installation again:

```bash
pnpm install
```

---

## 2. Create Environment File

Before starting the application, create `.env.local` from `.env.example`:

```bash
# /apps/web/
cp .env.example .env.local
```

Update the environment variables if needed.

---

## 3. Start Development Server

Move into the web application directory:

```bash
cd apps/web
```

Start the Next.js development server:

```bash
pnpm dev
```

---

# Application URL

```text
http://localhost:3000
```

---

# Notes

- Docker is optional for frontend development.
- This repository uses a pnpm workspace (monorepo structure).
- Only the `apps/web` application is required to run the frontend locally.

---

# Folder Structure

```text
apps/web/
├── app/                 # Next.js App Router
├── components/          # Shared UI components
├── features/            # Feature-based modules
├── i18n/                # Internationalization config
├── lib/                 # Utilities and helper functions
├── messages/            # Translation message files
├── providers/           # React providers
├── public/              # Static assets
├── proxy.ts             # Next.js middleware
├── .env.example         # Environment variables example
```
