const fs = require("node:fs");
const path = require("node:path");

const cliPath = path.join(__dirname, "package", "cli.js");

if (!fs.existsSync(cliPath)) {
  console.error(`Bundle not found: ${cliPath}`);
  process.exit(1);
}

let source = fs.readFileSync(cliPath, "utf8");
const original = source;

const replacements = [
  // Claw Dev -> Octopadev (all variations)
  ["Claw Dev", "Octopadev"],
  ["claw-dev", "octopadev"],
  ["clawd", "octopad"],
  ["CLAWD", "OCTOPAD"],
  
  // Claude -> Octopadev
  ["Welcome to Claude Code", "Welcome to Octopadev"],
  ["Claude Code", "Octopadev"],
  
  // Model defaults - replace sonnet references with deepseek
  ["claude-sonnet-4", "deepseek-chat"],
  ["claude-sonnet", "deepseek-chat"],
  ["sonnet", "deepseek"],
];

for (const [from, to] of replacements) {
  source = source.split(from).join(to);
}

if (source !== original) {
  fs.writeFileSync(cliPath, source, "utf8");
  console.log("✅ Applied Octopadev branding patch successfully!");
  const changes = countChanges(original, source);
  console.log(`   Claw Dev → Octopadev: ${changes["Claw Dev"]} replacements`);
  console.log(`   clawd → octopad: ${changes["clawd"]} replacements`);
  console.log(`   sonnet → deepseek: ${changes["sonnet"]} replacements`);
} else {
  console.log("❌ Branding patch already applied or no matching strings found.");
}

function countChanges(original, modified) {
  const counts = {};
  const terms = ["Claw Dev", "clawd", "sonnet"];
  for (const term of terms) {
    const regex = new RegExp(term, "g");
    const originalMatches = (original.match(regex) || []).length;
    const modifiedMatches = (modified.match(regex) || []).length;
    counts[term] = originalMatches - modifiedMatches;
  }
  return counts;
}
