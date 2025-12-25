import { Router } from "express";
import { db } from "../db.js";
import { z } from "zod";
import crypto from "node:crypto";

const projectSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  targets: z.array(z.object({ url: z.string().url(), intentScore: z.number().optional() })),
  schema: z.object({
    name: z.string(),
    fields: z.array(
      z.object({
        name: z.string(),
        type: z.enum(["string", "number", "boolean", "date", "array", "object"]),
        required: z.boolean().optional(),
        description: z.string().optional(),
        validators: z.array(z.string()).optional(),
        locked: z.boolean().optional(),
        aiSuggested: z.boolean().optional()
      })
    )
  }),
  crawl: z.object({
    depthLimit: z.number().min(0),
    rateLimitPerMinute: z.number().positive(),
    sameDomainOnly: z.boolean(),
    intentKeywords: z.array(z.string()).optional(),
    auth: z
      .object({
        cookies: z.record(z.string()).optional(),
        loginReplayScriptPath: z.string().optional()
      })
      .optional()
  }),
  executionMode: z.enum(["no-ai", "ai-assisted", "ai-autonomous"])
});

export const projectsRouter = Router();

projectsRouter.get("/", (_req, res) => {
  const rows = db.prepare("SELECT * FROM projects ORDER BY createdAt DESC").all();
  const projects = rows.map((row) => ({
    ...row,
    targets: JSON.parse(row.targets),
    schema: JSON.parse(row.schema),
    crawl: JSON.parse(row.crawl)
  }));
  res.json(projects);
});

projectsRouter.get("/:id", (req, res) => {
  const row = db.prepare("SELECT * FROM projects WHERE id = ?").get(req.params.id);
  if (!row) return res.status(404).json({ error: "project not found" });
  res.json({
    ...row,
    targets: JSON.parse(row.targets),
    schema: JSON.parse(row.schema),
    crawl: JSON.parse(row.crawl)
  });
});

projectsRouter.post("/", (req, res) => {
  const parse = projectSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const stmt = db.prepare(
    `INSERT INTO projects (id, name, description, targets, schema, crawl, executionMode, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  stmt.run(
    id,
    parse.data.name,
    parse.data.description ?? null,
    JSON.stringify(parse.data.targets),
    JSON.stringify(parse.data.schema),
    JSON.stringify(parse.data.crawl),
    parse.data.executionMode,
    now,
    now
  );
  res.status(201).json({ id, createdAt: now });
});

projectsRouter.put("/:id", (req, res) => {
  const parse = projectSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: parse.error.flatten() });
  const now = new Date().toISOString();
  const stmt = db.prepare(
    `UPDATE projects SET name = ?, description = ?, targets = ?, schema = ?, crawl = ?, executionMode = ?, updatedAt = ?
     WHERE id = ?`
  );
  const result = stmt.run(
    parse.data.name,
    parse.data.description ?? null,
    JSON.stringify(parse.data.targets),
    JSON.stringify(parse.data.schema),
    JSON.stringify(parse.data.crawl),
    parse.data.executionMode,
    now,
    req.params.id
  );
  if (result.changes === 0) return res.status(404).json({ error: "project not found" });
  res.json({ id: req.params.id, updatedAt: now });
});
