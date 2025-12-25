from typing import Any, Dict, List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from playwright.async_api import async_playwright
import asyncio
import datetime
import os


class Target(BaseModel):
    url: str
    intentScore: Optional[float] = None


class SchemaField(BaseModel):
    name: str
    type: str
    required: Optional[bool] = False
    validators: Optional[List[str]] = None
    locked: Optional[bool] = False


class ProjectSchema(BaseModel):
    name: str
    fields: List[SchemaField]


class CrawlRule(BaseModel):
    depthLimit: int
    rateLimitPerMinute: int
    sameDomainOnly: bool = True
    intentKeywords: Optional[List[str]] = None


class Project(BaseModel):
    id: str
    name: str
    targets: List[Target]
    schema: ProjectSchema
    crawl: CrawlRule
    executionMode: str


class RunRequest(BaseModel):
    runId: str
    project: Project
    testLimit: Optional[Dict[str, int]] = None


app = FastAPI(title="Scraper AI Python service", version="0.1.0")


@app.get("/health")
async def health():
    return {"status": "ok", "mode": "deterministic", "time": datetime.datetime.utcnow().isoformat()}


async def fetch_page(url: str) -> Dict[str, Any]:
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto(url, wait_until="domcontentloaded")
        content = await page.content()
        await browser.close()
        return {"url": url, "content": content}


@app.post("/run")
async def run(req: RunRequest):
    if not req.project.targets:
        raise HTTPException(status_code=400, detail="no targets provided")

    max_pages = req.testLimit.get("maxPages", 3) if req.testLimit else 3
    visited = []
    results: List[Dict[str, Any]] = []

    queue: List[Dict[str, Any]] = [{"url": t.url, "depth": 0} for t in req.project.targets]

    while queue and len(results) < max_pages:
        current = queue.pop(0)
        if current["url"] in visited:
            continue
        visited.append(current["url"])

        try:
            snapshot = await fetch_page(current["url"])
        except Exception as exc:  # pragma: no cover - best effort logging
            results.append(
                {
                    "url": current["url"],
                    "error": str(exc),
                    "timestamp": datetime.datetime.utcnow().isoformat(),
                }
            )
            continue

        # Deterministic placeholder: selectors resolved elsewhere; store provenance-ready slot
        results.append(
            {
                "url": current["url"],
                "data": {},
                "provenance": {"selector": {}, "timestamp": datetime.datetime.utcnow().isoformat()},
                "confidence": 1.0,
            }
        )

        # Simple BFS link discovery stub respecting depth
        if current["depth"] < req.project.crawl.depthLimit:
            # TODO: parse snapshot["content"] and enqueue candidate links with intent scoring
            pass

        await asyncio.sleep(60 / req.project.crawl.rateLimitPerMinute)

    # Persist results to tmp file for now
    output_dir = os.environ.get("PY_OUTPUT_DIR", "/tmp")
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, f"run-{req.runId}.json")
    with open(output_path, "w", encoding="utf-8") as f:
        import json

        json.dump({"runId": req.runId, "results": results}, f, indent=2)

    return {"runId": req.runId, "results": len(results), "output": output_path}
