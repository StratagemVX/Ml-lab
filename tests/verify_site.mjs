import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const htmlPath = path.join(rootDir, "index.html");
const cssPath = path.join(rootDir, "style.css");
const jsPath = path.join(rootDir, "script.js");

assert.ok(fs.existsSync(htmlPath), "index.html must exist");
assert.ok(fs.existsSync(cssPath), "style.css must exist");
assert.ok(fs.existsSync(jsPath), "script.js must exist");

const html = fs.readFileSync(htmlPath, "utf8");
assert.match(html, /<!DOCTYPE html>/i, "index.html must declare HTML5 doctype");
assert.ok(html.includes('href="style.css"'), "index.html must link style.css");
assert.ok(html.includes('src="script.js"'), "index.html must load script.js");

execFileSync(process.execPath, ["--check", jsPath], { stdio: "inherit" });

const script = fs.readFileSync(jsPath, "utf8");
const bundledFiles = [...script.matchAll(/fileName:\s*"([^"]+)"/g)].map((m) => m[1]);
assert.equal(bundledFiles.length, 10, "Expected 10 bundled program text files");

for (const fileName of bundledFiles) {
  const fullPath = path.join(rootDir, fileName);
  assert.ok(fs.existsSync(fullPath), `Missing bundled program file: ${fileName}`);
  assert.ok(fs.statSync(fullPath).size > 0, `Empty bundled program file: ${fileName}`);
}

console.log(`Verified index.html, style.css, script.js syntax, and ${bundledFiles.length} bundled program files.`);
