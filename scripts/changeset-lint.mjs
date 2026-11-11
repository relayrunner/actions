// Fails when a changeset names any package other than @relayrunner/actions.
// `changeset version` throws on a name that isn't in the workspace, which
// would stop the Release workflow after merge. This catches it in the PR.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const PUBLISHED = "@relayrunner/actions";
const dir = join(import.meta.dirname, "..", ".changeset");

const problems = [];
for (const file of readdirSync(dir)) {
  if (!file.endsWith(".md") || file.toLowerCase() === "readme.md") continue;
  const text = readFileSync(join(dir, file), "utf8");
  const frontmatter = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!frontmatter) {
    problems.push(`${file}: no frontmatter`);
    continue;
  }
  for (const line of frontmatter[1].split(/\r?\n/)) {
    if (!line.trim()) continue;
    const match = /^\s*["']?([^"':]+)["']?\s*:\s*(major|minor|patch)\s*$/.exec(line);
    if (!match) problems.push(`${file}: can't read "${line.trim()}"`);
    else if (match[1] !== PUBLISHED) {
      problems.push(`${file}: names "${match[1]}", but only "${PUBLISHED}" is versioned`);
    }
  }
}

if (problems.length > 0) {
  console.error(`changeset-lint:\n${problems.map((p) => `  ${p}`).join("\n")}`);
  process.exit(1);
}
