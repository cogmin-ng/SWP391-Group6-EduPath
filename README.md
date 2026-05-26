# EduPath (Monorepo with Frontend and Backend)

This project is managed as a monorepo using pnpm workspaces. The `frontend` and `backend` are located in their respective folders.

**Important:** All commands below should be run from the root directory of the project.

Quickstart:

1. Install all dependencies for both frontend and backend:

```bash
pnpm install
```

2. Generate Prisma client and run migrations:

```bash
pnpm prisma:generate
pnpm prisma:migrate
```

3. Start dev server:

```bash
pnpm dev
```
