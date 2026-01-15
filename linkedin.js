// const { chromium } = require("playwright");

// async function fetchLinkedInJobs(keywords) {
//   const browser = await chromium.launch({ headless: false }); // false for first run
//   const page = await browser.newPage();

//   await page.goto("https://www.linkedin.com/login", { waitUntil: "networkidle" });

//   await page.fill("#username", process.env.LINKEDIN_EMAIL);
//   await page.fill("#password", process.env.LINKEDIN_PASSWORD);
//   await page.click("button[type=submit]");

//   await page.waitForTimeout(5000);

//   const searchUrl =
//     `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
//       keywords
//     )}&f_TPR=r86400`; // last 24 hrs

//   await page.goto(searchUrl, { waitUntil: "networkidle" });
//   await page.waitForTimeout(5000);

//   const jobs = await page.evaluate(() => {
//     const cards = document.querySelectorAll("ul.jobs-search__results-list li");

//     return Array.from(cards).map(card => {
//       const title = card.querySelector("h3")?.innerText.trim();
//       const company = card.querySelector(".base-search-card__subtitle")?.innerText.trim();
//       const link = card.querySelector("a")?.href;

//       return { title, company, link };
//     });
//   });

//   await browser.close();
//   return jobs.filter(j => j.title && j.company && j.link);
// }

// module.exports = fetchLinkedInJobs;

const { chromium } = require("playwright");

async function fetchLinkedInJobs(keywords) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const page = await browser.newPage();

  const url = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(
    keywords
  )}&f_TPR=r86400`;

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  } catch (e) {
    console.log("⚠️  Page load timeout, continuing with partial load...");
  }
  await page.waitForTimeout(4000);

  const jobs = await page.evaluate(() => {
    return Array.from(
      document.querySelectorAll("ul.jobs-search__results-list li")
    ).map((card) => ({
      title: card.querySelector("h3")?.innerText.trim(),
      company: card
        .querySelector(".base-search-card__subtitle")
        ?.innerText.trim(),
      link: card.querySelector("a")?.href,
    }));
  });

  await browser.close();
  return jobs.filter((j) => j.title && j.company && j.link);
}

module.exports = fetchLinkedInJobs;
