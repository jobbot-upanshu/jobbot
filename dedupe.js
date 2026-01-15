const fs = require("fs");

const FILE = "seen.json";

function loadSeen() {
  if (!fs.existsSync(FILE)) return new Set();
  return new Set(JSON.parse(fs.readFileSync(FILE)));
}

function saveSeen(set) {
  fs.writeFileSync(FILE, JSON.stringify([...set]));
}

function removeDuplicates(jobs) {
  const seen = loadSeen();
  const unique = [];

  for (const job of jobs) {
    if (!seen.has(job.link)) {
      seen.add(job.link);
      unique.push(job);
    }
  }

  saveSeen(seen);
  return unique;
}

module.exports = removeDuplicates;
