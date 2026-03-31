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
  ["Welcome to Claude Code", "Welcome to Octopadev"],
  ["Claude Code", "Octopadev"],

  // Octopad mini mascot in the startup panel.
  ["▛███▜", "CLAWD"],
  ["▟███▟", "CLAWD"],
  ["▙███▙", "CLAWD"],
  ["█████", " DEV "],
  ["▘▘ ▝▝", "     "],

  // Larger welcome art variants.
  [" █████████ ", "  OCTOPADEV  "],
  ["██▄█████▄██", " [OCTOPADEV] "],
  ["█ █   █ █", " OCTOPADEV "],
];

for (const [from, to] of replacements) {
  source = source.split(from).join(to);
}

if (source !== original) {
  fs.writeFileSync(cliPath, source, "utf8");
  console.log("Applied local Octopadev branding patch.");
} else {
  console.log("Branding patch already applied or no matching strings found.");
}
