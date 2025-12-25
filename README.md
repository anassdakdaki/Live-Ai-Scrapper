# Scraper AI

Deterministic-first web scraping platform with optional AI augmentation. Works end-to-end without AI and allows per-action AI toggles with full provenance and explainability.

## Project layout
- `apps/web`: Next.js (App Router, TS, Tailwind) UI for project workspace, schema editor, visual sandbox, execution console, and exports.
- `services/node`: Node/Express API for projects, runs, exports, storage (SQLite local, Postgres planned), AI abstraction, and orchestration with the Python worker.
- `services/python`: FastAPI + Playwright worker for deterministic crawling/extraction with optional AI semantic steps behind an interface.
- `packages/shared`: Shared types and contracts for projects, schema, selectors, and runs.
- `infra`: Dockerfiles and compose for local multi-service runs.

## Deterministic-first principles
- Default execution mode is `no-ai`; AI is an add-on. Every AI call must be explainable and reversible.
- Selectors, crawl rules, and schema are explicit and versioned per project snapshot.
- Exports generate runnable Node/Python code that works independently of the platform.
- Drift detection planned via selector confidence + validation failures.

## Getting started (local)
1) Install Node 20+, Python 3.10+, and Playwright dependencies.
2) Install JS deps: `npm install --workspaces`.
3) Install Python deps: `pip install -r services/python/requirements.txt`.
4) Run services:
   - Web: `npm run dev --workspace apps/web`
   - Node API: `npm run dev --workspace services/node`
   - Python worker: `uvicorn services.python.main:app --reload --host 0.0.0.0 --port 8001`

## Docker compose
```bash
docker-compose -f infra/docker-compose.yml up --build
```

## Next steps / roadmap
- Visual sandbox wired to Playwright session proxy with click-to-select + selector confidence/fallbacks.
- Schema editor with validators, lockable fields, and AI-assisted suggestions (OpenAI-compatible interface).
- Deterministic BFS crawler with intent scoring and auth replay.
- Extraction pipeline with fallback chain (CSS/XPath/Regex) and optional AI semantic layer.
- Drift detection, provenance metadata on every field, and exportable datasets (CSV/JSON/JSONL).

## AI integration (optional)
- AI providers must implement `AiClient.complete({ prompt, model?, temperature? })`.
- AI is only invoked on explicit user toggle per action (selector suggestion, schema detection, semantic extraction).
- All AI outputs must include confidence + rationale and be reversible to deterministic selectors.
