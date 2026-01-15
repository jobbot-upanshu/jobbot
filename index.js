require("dotenv").config();

const fetchLinkedInJobs = require("./linkedin");
const fetchNaukriJobs = require("./naukri");
const isJobRelevant = require("./aiMatch");
const removeDuplicates = require("./dedupe");
const addJobsToSheet = require("./sheets");

async function runJobTracker() {
  console.log("🔍 Fetching jobs...");

  const linkedin = await fetchLinkedInJobs(process.env.KEYWORDS);
  const naukri = await fetchNaukriJobs(process.env.KEYWORDS);

  const allJobs = [
    ...linkedin.map((j) => ({ ...j, platform: "LinkedIn" })),
    ...naukri.map((j) => ({ ...j, platform: "Naukri" })),
  ];

  const matched = [];
  for (const job of allJobs) {
    const ok = await isJobRelevant(job, process.env.JOB_PROFILE);
    if (ok) matched.push(job);
  }

  const unique = removeDuplicates(matched);
  if (unique.length === 0) {
    console.log("✅ No new relevant jobs today");
    return;
  }

  await addJobsToSheet(unique);
  console.log(`✅ Added ${unique.length} jobs`);
}

// Run once (GitHub Actions handles scheduling)
runJobTracker();
