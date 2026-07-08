# Secret Notes

Secure note-taking service built for the S4-CONINT Continuous Integration semester project.
Notes are stored **only in encrypted form** (AES-256-GCM) and are decrypted on the fly only
when the correct passphrase is provided.

## Repo structure

```
secret-notes/
├── backend/           Fastify REST API — encryption, storage, retrieval (Feature A + B)
│   ├── src/
│   ├── test/          Jest unit tests
│   ├── e2e/            Playwright API tests (run against staging)
│   ├── perf/           k6 performance tests (run against staging)
│   └── Jenkinsfile
├── frontend/          React (Vite) UI + PostHog A/B toggle (Feature C)
│   ├── src/
│   ├── e2e/            Playwright UI tests
│   ├── perf/            k6 performance tests
│   └── Jenkinsfile
├── deploy/            Blue/Green scripts + router config, runs on the AWS EC2 host
├── .github/workflows/ GitHub Actions pipelines (cloud-hosted CI)
├── docs/              FHTW-template project documentation
└── docker-compose.yml Local dev stack (Postgres + backend + frontend)
```

## Local development

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
docker compose up --build
```

- Frontend: http://localhost:8080
- Backend API: http://localhost:3000 (health check: `/health`)
- Postgres: localhost:5432 (user/password/db: `secretnotes`)

## Running tests locally

```bash
# Backend
cd backend && npm ci && npm test        # Jest unit tests
cd backend && npm run test:e2e          # Playwright (needs BASE_URL of a running instance)

# Frontend
cd frontend && npm ci && npm test       # Vitest (Jest-compatible) unit/component tests
cd frontend && npm run test:e2e         # Playwright (needs BASE_URL of a running instance)
```

## Branching strategy

- `main` — integration branch. Every push runs **Lint, Unit Test, Build**.
- `feature/*` — one branch per feature/task, merged into `main` via PR.
- `deploy/production` — every push runs the **full pipeline**: Lint, Test, Build, Deliver
  (push to Docker Hub), Deploy (green environment on AWS), E2E/Performance tests, and — if
  they pass — the Blue/Green traffic switch.

## CI/CD

Each of the two apps (`backend`, `frontend`) has its own pipeline, run on **two** platforms:

- **Cloud-hosted:** GitHub Actions — `.github/workflows/backend.yml` / `frontend.yml`
- **Self-hosted:** Jenkins on AWS EC2 — `backend/Jenkinsfile` / `frontend/Jenkinsfile`

See [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) for the full FHTW-template writeup
(infrastructure, SonarQube, Snyk, PostHog, Blue/Green details, etc.).
Test