const { chromium } = require("playwright");

async function fetchNaukriJobs(keywords) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-blink-features=AutomationControlled"],
  });
  const page = await browser.newPage();

  const query = keywords.split(" ").join("-");
  const url = `https://www.naukri.com/${query}-jobs`;

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  } catch (e) {
    console.log("⚠️  Page load timeout, continuing with partial load...");
  }
  await page.waitForTimeout(4000);

  const jobs = await page.evaluate(() => {
    return Array.from(document.querySelectorAll("article.jobTuple")).map(
      (card) => ({
        title: card.querySelector("a.title")?.innerText.trim(),
        company: card.querySelector("a.subTitle")?.innerText.trim(),
        link: card.querySelector("a.title")?.href,
      })
    );
  });

  await browser.close();
  return jobs.filter((j) => j.title && j.company && j.link);
}

module.exports = fetchNaukriJobs;
