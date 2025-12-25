import { Router } from "express";
import { db } from "../db.js";

export const exportsRouter = Router();

exportsRouter.get("/:projectId/node", (req, res) => {
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.projectId);
  if (!project) return res.status(404).json({ error: "project not found" });
  const parsed = {
    ...project,
    targets: JSON.parse(project.targets),
    schema: JSON.parse(project.schema),
    crawl: JSON.parse(project.crawl)
  };

  const code = `// Auto-generated deterministic scraper (Node.js)
import fs from "node:fs";
import playwright from "playwright";

const schema = ${JSON.stringify(parsed.schema, null, 2)};
const targets = ${JSON.stringify(parsed.targets, null, 2)};

async function run() {
  const browser = await playwright.chromium.launch({ headless: true });
  const page = await browser.newPage();

  const results = [];
  for (const target of targets) {
    await page.goto(target.url, { waitUntil: "domcontentloaded" });
    // TODO: plug in deterministic selectors from schema.fields
    const record = {};
    results.push({ url: target.url, record });
  }
  await browser.close();
  fs.writeFileSync("data.json", JSON.stringify(results, null, 2));
}

run();`;

  res.header("Content-Type", "text/plain").send(code);
});

exportsRouter.get("/:projectId/python", (req, res) => {
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.projectId);
  if (!project) return res.status(404).json({ error: "project not found" });
  const parsed = {
    ...project,
    targets: JSON.parse(project.targets),
    schema: JSON.parse(project.schema),
    crawl: JSON.parse(project.crawl)
  };

  const code = `# Auto-generated deterministic scraper (Python + Playwright)
import json
from playwright.sync_api import sync_playwright

schema = ${JSON.stringify(parsed.schema, null, 2)}
targets = ${JSON.stringify(parsed.targets, null, 2)}

def run():
    results = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        for target in targets:
            page.goto(target["url"], wait_until="domcontentloaded")
            record = {}
            results.append({"url": target["url"], "record": record})
        browser.close()
    with open("data.json", "w") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    run()
`;

  res.header("Content-Type", "text/plain").send(code);
});
