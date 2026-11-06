# Scraper AI

An early prototype for a web scraping workspace, with a Next.js interface, an Express API, SQLite storage, and a Python Playwright worker.

## Current state

This repository contains the service structure and an interface concept. It does not yet provide a complete scraping workflow.

| Component | Implemented | Still needed |
| --- | --- | --- |
| Web | Workspace overview and feature cards | Connect controls to the API; browser sandbox |
| API | Project storage, run routes, and export templates | Worker payload handling and run completion tracking |
| Worker | Page fetching, rate delays, and JSON output | Field extraction and link discovery |
| AI | Client interface and no-op implementation | Provider integration |
| Exports | Node and Python template routes | Working selectors and complete extraction logic |

The worker currently writes empty data records. Exported scripts are templates that require implementation.

## Layout

- `apps/web/`: Next.js interface.
- `services/node/`: Express routes and SQLite storage.
- `services/python/`: FastAPI and Playwright worker.
- `packages/shared/`: Shared TypeScript contracts.
- `infra/`: Docker configuration.

## Development

Use Node.js 20+ and Python 3.10+. The JavaScript workspace currently contains `workspace:*` dependencies; the checked-in npm install instructions require workspace dependency fixes before they work with npm.

The Python worker can be started separately:

```sh
python -m pip install -r services/python/requirements.txt
python -m playwright install chromium
python -m uvicorn main:app --app-dir services/python --reload --port 8001
```

Health endpoint: http://localhost:8001/health.

Service defaults are web `3000`, Node API `4000`, and Python worker `8001`. The Node API reads `PYTHON_ENDPOINT` and `DATA_DIR`; the worker reads `PY_OUTPUT_DIR`.

Dockerfiles and Compose configuration are included in `infra/`, but depend on resolving the JavaScript workspace setup.

## Next work

1. Fix workspace installation and build commands.
2. Parse stored project JSON before sending it to the worker and validate worker responses.
3. Implement selectors, link discovery, and completed/failed run reporting.
4. Connect the interface and test one project through export.
5. Add an AI provider only after the deterministic workflow works.
