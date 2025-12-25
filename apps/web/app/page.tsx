import Link from "next/link";

const sections = [
  {
    title: "Project Workspace",
    description:
      "Create, load, and version scraping projects with targets, schema, crawl rules, and execution modes.",
    actions: ["New Project", "Import", "Snapshots"]
  },
  {
    title: "Visual Browser Sandbox",
    description:
      "Embedded Playwright session for click-to-select, selector confidence, and manual overrides.",
    actions: ["Open Sandbox", "Record selectors", "Review fallbacks"]
  },
  {
    title: "Schema & Extraction",
    description:
      "Visual schema editor with validators, lockable fields, deterministic extraction with optional AI hints.",
    actions: ["Edit schema", "Detectors", "Validators"]
  },
  {
    title: "Crawler",
    description:
      "Deterministic BFS crawler with intent scoring, depth/rate/domain controls, and auth replay.",
    actions: ["Rules", "Depth limits", "Login replay"]
  },
  {
    title: "Thinker / Console",
    description:
      "Live logs of links, extracted fields, validations, confidence, and token usage when AI is on.",
    actions: ["Run test", "View logs", "Export report"]
  },
  {
    title: "Export",
    description:
      "Generate runnable Node/Python code with schema, crawl logic, selectors, and provenance.",
    actions: ["Export Node", "Export Python", "Download datasets"]
  }
];

export default function Page() {
  return (
    <main className="space-y-10">
      <header className="flex flex-col gap-3">
        <p className="text-sm uppercase tracking-[0.2em] text-slate-500">
          Scraper AI
        </p>
        <h1 className="text-4xl font-bold text-slate-900">
          Deterministic-first web scraping studio
        </h1>
        <p className="max-w-3xl text-lg text-slate-600">
          Build repeatable scrapers with transparent selectors, reproducible
          crawls, and optional AI hints. Control execution modes per project:
          No-AI, AI-assisted, or AI-autonomous with full explainability.
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="#"
            className="rounded-lg bg-ink px-4 py-2 text-white shadow hover:bg-slate-900"
          >
            Start test run
          </Link>
          <Link
            href="#"
            className="rounded-lg border border-slate-200 px-4 py-2 text-slate-800 hover:border-ink"
          >
            View console
          </Link>
        </div>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <article
            key={section.title}
            className="card flex flex-col gap-3 p-5 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">{section.title}</h3>
              <span className="rounded-full bg-fog px-3 py-1 text-xs font-medium uppercase tracking-wide text-slate-600">
                Deterministic-first
              </span>
            </div>
            <p className="text-slate-600">{section.description}</p>
            <div className="flex flex-wrap gap-2">
              {section.actions.map((action) => (
                <span
                  key={action}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {action}
                </span>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="card p-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-semibold">Execution modes</h2>
          <p className="max-w-4xl text-slate-600">
            AI is optional. Deterministic pipelines (selectors, regex/xpath/css,
            replayable sessions) are the default. AI hooks are pluggable via
            OpenAI-compatible interfaces and every suggestion is explainable and
            reversible.
          </p>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { mode: "No-AI", focus: "Strict selectors, replayable logic" },
              { mode: "AI-assisted", focus: "Hints for schema/selectors" },
              { mode: "AI-autonomous", focus: "Supervised autonomous runs" }
            ].map((item) => (
              <div key={item.mode} className="rounded-lg border border-fog p-4">
                <div className="flex items-center justify-between">
                  <p className="text-base font-semibold">{item.mode}</p>
                  <span className="text-xs uppercase tracking-wide text-slate-500">
                    Toggle per action
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-600">{item.focus}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
