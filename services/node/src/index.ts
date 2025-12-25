import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { projectsRouter } from "./routes/projects.js";
import { runsRouter } from "./routes/runs.js";
import { exportsRouter } from "./routes/exports.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    mode: process.env.EXECUTION_MODE ?? "no-ai",
    pythonEndpoint: process.env.PYTHON_ENDPOINT ?? "http://localhost:8001"
  });
});

app.use("/api/projects", projectsRouter);
app.use("/api/runs", runsRouter);
app.use("/api/exports", exportsRouter);

const port = Number(process.env.PORT ?? 4000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`[scraper-ai-node] listening on http://localhost:${port}`);
});
