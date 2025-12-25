import Database from "better-sqlite3";
import path from "node:path";
import { existsSync, mkdirSync } from "node:fs";

const dataDir = process.env.DATA_DIR ?? path.join(process.cwd(), "data");
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "scraper-ai.sqlite");
export const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    targets TEXT NOT NULL,
    schema TEXT NOT NULL,
    crawl TEXT NOT NULL,
    executionMode TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    updatedAt TEXT NOT NULL
  );
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS runs (
    id TEXT PRIMARY KEY,
    projectId TEXT NOT NULL,
    status TEXT NOT NULL,
    logs TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    FOREIGN KEY (projectId) REFERENCES projects(id)
  );
`);
