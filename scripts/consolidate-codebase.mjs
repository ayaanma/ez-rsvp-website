import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const removedFiles = [];
const changedFiles = [];

const skipDirs = new Set([".git", ".next", "node_modules", "public"]);
const sourceExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".css"]);
const codeExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs"]);
const removableRoots = new Set(["components", "lib"]);
const protectedFiles = new Set([
  "lib/mock-data.ts",
  "lib/supabase-schema.sql",
  "types/index.ts"
]);

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function read(file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function write(file, content) {
  const full = path.join(root, file);
  const current = fs.existsSync(full) ? fs.readFileSync(full, "utf8") : "";
  if (current !== content) {
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
    changedFiles.push(file);
  }
}

function remove(file) {
  const full = path.join(root, file);
  if (fs.existsSync(full)) {
    fs.rmSync(full, { force: true });
    removedFiles.push(file);
  }
}

function walk(dir = root, results = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") && entry.name !== ".eslintrc.json") continue;
    if (entry.isDirectory() && skipDirs.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, results);
    else results.push(full);
  }
  return results;
}

function rel(full) {
  return path.relative(root, full).replaceAll(path.sep, "/");
}

function normalizeBlankLines(text) {
  return text.replace(/[ \t]+$/gm, "").replace(/\n{3,}/g, "\n\n").trim() + "\n";
}

function stripCssComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\
}

function stripCodeComments(text) {
  let output = "";
  let state = "normal";
  let templateDepth = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (state === "normal") {
      if (char === "\"" || char === "'") {
        state = char;
        output += char;
        continue;
      }
      if (char === "`") {
        state = "template";
        output += char;
        continue;
      }
      if (char === "/" && next === "/") {
        while (i < text.length && text[i] !== "\n") i++;
        output += "\n";
        continue;
      }
      if (char === "/" && next === "*") {
        i += 2;
        while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
        i++;
        continue;
      }
      output += char;
      continue;
    }

    if (state === "\"" || state === "'") {
      output += char;
      if (char === "\\") {
        output += text[++i] ?? "";
        continue;
      }
      if (char === state) state = "normal";
      continue;
    }

    if (state === "template") {
      output += char;
      if (char === "\\") {
        output += text[++i] ?? "";
        continue;
      }
      if (char === "`" && templateDepth === 0) {
        state = "normal";
        continue;
      }
      if (char === "$" && next === "{") {
        output += next;
        i++;
        templateDepth++;
        state = "templateExpression";
      }
      continue;
    }

    if (state === "templateExpression") {
      if (char === "\"" || char === "'") {
        state = char;
        output += char;
        continue;
      }
      if (char === "`") {
        state = "template";
        output += char;
        continue;
      }
      if (char === "/" && next === "/") {
        while (i < text.length && text[i] !== "\n") i++;
        output += "\n";
        continue;
      }
      if (char === "/" && next === "*") {
        i += 2;
        while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
        i++;
        continue;
      }
      output += char;
      if (char === "{") templateDepth++;
      if (char === "}") {
        templateDepth--;
        if (templateDepth === 0) state = "template";
      }
    }
  }

  return output;
}

function resolveImport(fromFile, specifier) {
  if (!specifier.startsWith(".") && !specifier.startsWith("@/")) return null;
  const base = specifier.startsWith("@/")
    ? path.join(root, specifier.slice(2))
    : path.resolve(root, path.dirname(fromFile), specifier);
  const candidates = [
    base,
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.jsx`,
    `${base}.mjs`,
    `${base}.css`,
    path.join(base, "index.ts"),
    path.join(base, "index.tsx")
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return rel(candidate);
  }
  return null;
}

function consolidateCss() {
  const globals = "app/globals.css";
  if (!exists(globals)) return;
  let css = read(globals);
  for (const file of ["app/interaction-fixes.css", "app/homepage-fixes.css"]) {
    if (!exists(file)) continue;
    const content = read(file).trim();
    if (content && !css.includes(content)) css += `\n\n${content}\n`;
  }
  css = normalizeBlankLines(stripCssComments(css));
  write(globals, css);

  for (const file of ["app/interaction-fixes.css", "app/homepage-fixes.css", "app/ui-fixes.css"]) {
    remove(file);
  }

  const layout = "app/layout.tsx";
  if (exists(layout)) {
    let content = read(layout)
      .replace(/import\s+["']\.\/interaction-fixes\.css["'];\s*/g, "")
      .replace(/import\s+["']\.\/homepage-fixes\.css["'];\s*/g, "")
      .replace(/import\s+["']\.\/ui-fixes\.css["'];\s*/g, "");
    write(layout, normalizeBlankLines(content));
  }
}

function removeComments() {
  for (const full of walk()) {
    const file = rel(full);
    const ext = path.extname(file);
    if (!sourceExtensions.has(ext)) continue;
    let content = read(file);
    if (ext === ".css") content = stripCssComments(content);
    if (codeExtensions.has(ext)) content = stripCodeComments(content);
    write(file, normalizeBlankLines(content));
  }
}

function removeUnreferencedModules() {
  const files = walk().filter((full) => sourceExtensions.has(path.extname(full)));
  const allSource = new Set(files.map(rel));
  const referenced = new Set();
  const entrypoints = new Set();

  for (const full of files) {
    const file = rel(full);
    if (file.startsWith("app/") || file === "proxy.ts" || file === "middleware.ts") entrypoints.add(file);
    const content = read(file);
    const importPattern = /(?:import|export)\s+(?:[^'";]+?\s+from\s+)?["']([^"']+)["']/g;
    let match;
    while ((match = importPattern.exec(content))) {
      const resolved = resolveImport(full, match[1]);
      if (resolved) referenced.add(resolved);
    }
  }

  let removedSomething = true;
  while (removedSomething) {
    removedSomething = false;
    for (const file of [...allSource]) {
      const top = file.split("/")[0];
      if (!removableRoots.has(top)) continue;
      if (protectedFiles.has(file)) continue;
      if (referenced.has(file)) continue;
      if (entrypoints.has(file)) continue;
      remove(file);
      allSource.delete(file);
      removedSomething = true;
    }
  }
}

consolidateCss();
removeComments();
removeUnreferencedModules();
removeComments();

console.log("Cleanup complete.");
if (changedFiles.length) console.log(`Changed files:\n${[...new Set(changedFiles)].sort().join("\n")}`);
if (removedFiles.length) console.log(`Removed files:\n${[...new Set(removedFiles)].sort().join("\n")}`);
console.log("Run npm run build and review git diff before committing.");
