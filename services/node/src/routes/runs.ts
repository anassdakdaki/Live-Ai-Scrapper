import { Router } from "express";
import crypto from "node:crypto";
import fetch from "node-fetch";
import { db } from "../db.js";

const pythonEndpoint = process.env.PYTHON_ENDPOINT ?? "http://localhost:8001";

export const runsRouter = Router();

runsRouter.get("/", (_req, res) => {
  const rows = db.prepare("SELECT * FROM runs ORDER BY createdAt DESC").all();
  const runs = rows.map((row) => ({ ...row, logs: JSON.parse(row.logs) }));
  res.json(runs);
});

runsRouter.post("/", async (req, res) => {
  const { projectId, testLimit } = req.body ?? {};
  if (!projectId) return res.status(400).json({ error: "projectId required" });
  const project = db.prepare("SELECT * FROM projects WHERE id = ?").get(projectId);
  if (!project) return res.status(404).json({ error: "project not found" });

  const runId = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const logs: Record<string, unknown>[] = [];
  db.prepare("INSERT INTO runs (id, projectId, status, logs, createdAt) VALUES (?, ?, ?, ?, ?)")
    .run(runId, projectId, "pending", JSON.stringify(logs), createdAt);

  // Kick off deterministic crawl/extract in python service
  try {
    await fetch(`${pythonEndpoint}/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        runId,
        project,
        testLimit: testLimit ?? { maxPages: 5, maxDepth: 2 }
      })
    });
  } catch (err) {
    db.prepare("UPDATE runs SET status = ?, logs = ? WHERE id = ?").run(
      "failed",
      JSON.stringify([{ level: "error", message: String(err) }]),
      runId
    );
    return res.status(502).json({ error: "python service unreachable" });
  }

  db.prepare("UPDATE runs SET status = ? WHERE id = ?").run("running", runId);
  res.status(202).json({ runId, createdAt });
});
